#!/usr/bin/env python3
"""
Script to parse Robot Framework xunit output and upload results to PostgreSQL
Usage: python upload_results.py <results_directory>
"""

import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
import psycopg2
from psycopg2.extras import execute_values
import hashlib
import os
import shutil
from pathlib import Path
from zoneinfo import ZoneInfo

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'testresults'),
    'user': os.getenv('DB_USER', 'grafana'),
    'password': os.getenv('DB_PASSWORD', 'grafana123')
}


def generate_run_id():
    """Generate a unique run ID based on timestamp"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    hash_suffix = hashlib.md5(str(datetime.now().timestamp()).encode()).hexdigest()[:8]
    return f"run_{timestamp}_{hash_suffix}"


def parse_timestamp(timestamp_str):
    """Parse ISO 8601 timestamp and convert to UTC"""
    if not timestamp_str:
        return datetime.now(timezone.utc)
    
    try:
        parsed_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
        if parsed_time.tzinfo is None:
            local_tz = datetime.now().astimezone().tzinfo
            parsed_time = parsed_time.replace(tzinfo=local_tz).astimezone(timezone.utc)
        return parsed_time
    except (ValueError, AttributeError):
        return datetime.now(timezone.utc)


def parse_duration(duration_str):
    """Parse duration string to milliseconds"""
    try:
        return float(duration_str) * 1000
    except (ValueError, TypeError):
        return 0.0


def determine_test_status(testcase):
    """Determine test status and extract messages from testcase element"""
    skip = testcase.find('skipped')
    if skip is not None:
        return 'skipped', skip.get('message', 'Test skipped'), skip.text or ''
    
    failure = testcase.find('failure')
    if failure is not None:
        return 'failed', failure.get('message', 'Test failed'), failure.text or ''
    
    error = testcase.find('error')
    if error is not None:
        return 'error', error.get('message', 'Test error'), error.text or ''
    
    return 'passed', 'Test passed', None


def parse_testcase(testcase, suite_name, suite_start_time, cumulative_time):
    """Parse a single test case and return test result data"""
    test_name = testcase.get('name', 'Unknown Test')
    duration_ms = parse_duration(testcase.get('time', '0'))
    status, message, error_message = determine_test_status(testcase)
    
    test_start = suite_start_time + cumulative_time
    test_end = test_start + timedelta(milliseconds=duration_ms)
    
    return {
        'test_name': test_name,
        'suite_name': suite_name,
        'status': status,
        'message': message,
        'error_message': error_message,
        'duration_ms': duration_ms,
        'start_time': test_start,
        'end_time': test_end
    }


def parse_testsuite(testsuite):
    """Parse a single test suite and return all test results"""
    suite_name = testsuite.get('name', 'Unknown Suite')
    suite_start_time = parse_timestamp(testsuite.get('timestamp'))
    
    test_results = []
    cumulative_time = timedelta(0)
    
    for testcase in testsuite.findall('testcase'):
        test_result = parse_testcase(testcase, suite_name, suite_start_time, cumulative_time)
        test_results.append(test_result)
        cumulative_time += timedelta(milliseconds=test_result['duration_ms'])
    
    return test_results


def calculate_summary(test_results):
    """Calculate summary statistics from test results"""
    total_tests = len(test_results)
    passed = sum(1 for t in test_results if t['status'] == 'passed')
    failed = sum(1 for t in test_results if t['status'] in ('failed', 'error'))
    skipped = sum(1 for t in test_results if t['status'] == 'skipped')
    total_duration_ms = sum(t['duration_ms'] for t in test_results)
    
    if failed > 0:
        run_status = 'failed'
    elif skipped > 0 and passed == 0:
        run_status = 'skipped'
    else:
        run_status = 'passed'
    
    start_time = test_results[0]['start_time'] if test_results else datetime.now(timezone.utc)
    end_time = test_results[-1]['end_time'] if test_results else datetime.now(timezone.utc)
    
    return {
        'total_tests': total_tests,
        'passed': passed,
        'failed': failed,
        'skipped': skipped,
        'duration_ms': total_duration_ms,
        'status': run_status,
        'start_time': start_time,
        'end_time': end_time
    }


def parse_xunit_file(filepath):
    """Parse xunit XML file and extract test results"""
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        testsuites = root.findall('testsuite') if root.tag == 'testsuites' else [root]
        
        test_results = []
        for testsuite in testsuites:
            test_results.extend(parse_testsuite(testsuite))
        
        return {
            'test_results': test_results,
            'summary': calculate_summary(test_results)
        }
    
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        sys.exit(1)


def insert_test_run(cursor, run_id, summary, report_url):
    """Insert test run summary into database"""
    cursor.execute("""
        INSERT INTO test_runs 
        (run_id, start_time, end_time, total_tests, passed, failed, skipped, duration_ms, status, report_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        run_id,
        summary['start_time'],
        summary['end_time'],
        summary['total_tests'],
        summary['passed'],
        summary['failed'],
        summary['skipped'],
        summary['duration_ms'],
        summary['status'],
        report_url
    ))


def insert_test_results(cursor, run_id, test_results):
    """Insert individual test results into database"""
    test_data = [
        (
            run_id,
            test['test_name'],
            test['suite_name'],
            test['status'],
            test['message'],
            test['duration_ms'],
            test['error_message'],
            test['start_time'],
            test['end_time']
        )
        for test in test_results
    ]
    
    execute_values(cursor, """
        INSERT INTO test_results 
        (run_id, test_name, test_suite, status, message, duration_ms, error_message, start_time, end_time)
        VALUES %s
    """, test_data)


def print_upload_summary(run_id, summary):
    """Print summary of uploaded results"""
    print("✓ Successfully uploaded test results to database")
    print(f"  Run ID: {run_id}")
    print(f"  Total Tests: {summary['total_tests']}")
    print(f"  Passed: {summary['passed']}")
    print(f"  Failed: {summary['failed']}")
    print(f"  Skipped: {summary['skipped']}")
    print(f"  Duration: {summary['duration_ms']}ms")


def upload_to_database(run_id, data, report_url=None):
    """Upload test results to PostgreSQL database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        insert_test_run(cursor, run_id, data['summary'], report_url)
        insert_test_results(cursor, run_id, data['test_results'])
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print_upload_summary(run_id, data['summary'])
        return True
        
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False


def copy_report_file(source_path, destination_path, filename):
    """Copy a single report file if it exists"""
    source = source_path / filename
    if source.exists():
        destination = destination_path / filename
        shutil.copy2(source, destination)
        print(f"  ✓ Archived {filename}")
        return True
    return False


def archive_html_reports(run_id, results_dir):
    """Copy Robot Framework HTML reports to archive directory with timestamps"""
    try:
        script_dir = Path(__file__).parent
        results_path = Path(results_dir)
        archive_dir = script_dir / 'reports' / 'archive' / run_id
        
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        files_to_copy = ['log.html', 'report.html']
        copied_count = sum(
            copy_report_file(results_path, archive_dir, filename) 
            for filename in files_to_copy
        )
        
        if copied_count > 0:
            print(f"✓ Archived reports to: reports/archive/{run_id}/")
            return True
        else:
            print("⚠ No HTML reports found to archive")
            return False
            
    except Exception as e:
        print(f"Error archiving reports: {e}")
        return False


def validate_arguments():
    """Validate command line arguments and return results directory"""
    if len(sys.argv) < 2:
        print("Usage: python upload_results.py <results_directory>")
        print("Example: python upload_results.py results")
        sys.exit(1)
    
    return Path(sys.argv[1])


def validate_xunit_file(results_dir):
    """Check if xunit.xml exists in results directory"""
    xunit_file = results_dir / 'xunit.xml'
    
    if not xunit_file.exists():
        print(f"✗ Error: xunit.xml not found in {results_dir}")
        print("Make sure to run robot with --xunit option:")
        print("  uv run robot --xunit xunit.xml --outputdir results test_suite.robot")
        sys.exit(1)
    
    return xunit_file


def generate_report_url(run_id):
    """Generate URL for archived report"""
    return f"http://localhost:8080/archive/{run_id}/report.html"


def print_final_status(db_success, archive_success, run_id):
    """Print final status and exit"""
    if db_success:
        print("\n✓ Results uploaded successfully!")
        if archive_success:
            print(f"✓ Reports available at: http://localhost:8080/archive/{run_id}/")
        sys.exit(0)
    else:
        print("\n✗ Failed to upload results")
        sys.exit(1)


def main():
    """Main function"""
    results_dir = validate_arguments()
    xunit_file = validate_xunit_file(results_dir)
    
    print(f"Parsing xunit file: {xunit_file}")
    data = parse_xunit_file(str(xunit_file))
    
    run_id = generate_run_id()
    print(f"Generated run ID: {run_id}")
    
    report_url = generate_report_url(run_id)
    db_success = upload_to_database(run_id, data, report_url)
    archive_success = archive_html_reports(run_id, results_dir)
    
    print_final_status(db_success, archive_success, run_id)


if __name__ == '__main__':
    main()
