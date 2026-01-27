#!/usr/bin/env python3
"""
Script to parse Robot Framework xunit output and upload results to PostgreSQL
Usage: python upload_results.py <xunit_file>
"""

import sys
import xml.etree.ElementTree as ET
from datetime import datetime
import psycopg2
from psycopg2.extras import execute_values
import hashlib
import os

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


def parse_xunit_file(filepath):
    """Parse xunit XML file and extract test results"""
    try:
        tree = ET.parse(filepath)
        root = tree.getroot()
        
        # Handle both xunit formats (testsuites/testsuite)
        if root.tag == 'testsuites':
            testsuites = root.findall('testsuite')
        else:
            testsuites = [root]
        
        test_results = []
        total_tests = 0
        passed = 0
        failed = 0
        skipped = 0
        total_duration_ms = 0
        start_time = None
        end_time = None
        
        for testsuite in testsuites:
            suite_name = testsuite.get('name', 'Unknown Suite')
            
            for testcase in testsuite.findall('testcase'):
                test_name = testcase.get('name', 'Unknown Test')
                duration_str = testcase.get('time', '0')
                
                try:
                    duration_seconds = float(duration_str)
                    duration_ms = int(duration_seconds * 1000)
                except (ValueError, TypeError):
                    duration_ms = 0
                
                total_duration_ms += duration_ms
                total_tests += 1
                
                # Determine test status
                failure = testcase.find('failure')
                error = testcase.find('error')
                skip = testcase.find('skipped')
                
                if skip is not None:
                    status = 'skipped'
                    skipped += 1
                    message = skip.get('message', 'Test skipped')
                    error_message = skip.text or ''
                elif failure is not None:
                    status = 'failed'
                    failed += 1
                    message = failure.get('message', 'Test failed')
                    error_message = failure.text or ''
                elif error is not None:
                    status = 'error'
                    failed += 1
                    message = error.get('message', 'Test error')
                    error_message = error.text or ''
                else:
                    status = 'passed'
                    passed += 1
                    message = 'Test passed'
                    error_message = None
                
                # Use current timestamp for test times
                test_start = datetime.now()
                test_end = datetime.now()
                
                if start_time is None:
                    start_time = test_start
                end_time = test_end
                
                test_results.append({
                    'test_name': test_name,
                    'suite_name': suite_name,
                    'status': status,
                    'message': message,
                    'error_message': error_message,
                    'duration_ms': duration_ms,
                    'start_time': test_start,
                    'end_time': test_end
                })
        
        # Calculate overall run status
        if failed > 0:
            run_status = 'failed'
        elif skipped > 0 and passed == 0:
            run_status = 'skipped'
        else:
            run_status = 'passed'
        
        return {
            'test_results': test_results,
            'summary': {
                'total_tests': total_tests,
                'passed': passed,
                'failed': failed,
                'skipped': skipped,
                'duration_ms': total_duration_ms,
                'status': run_status,
                'start_time': start_time or datetime.now(),
                'end_time': end_time or datetime.now()
            }
        }
    
    except ET.ParseError as e:
        print(f"Error parsing XML file: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        sys.exit(1)


def upload_to_database(run_id, data):
    """Upload test results to PostgreSQL database"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Insert test run summary
        summary = data['summary']
        cursor.execute("""
            INSERT INTO test_runs 
            (run_id, start_time, end_time, total_tests, passed, failed, skipped, duration_ms, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            run_id,
            summary['start_time'],
            summary['end_time'],
            summary['total_tests'],
            summary['passed'],
            summary['failed'],
            summary['skipped'],
            summary['duration_ms'],
            summary['status']
        ))
        
        # Insert individual test results
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
            for test in data['test_results']
        ]
        
        execute_values(cursor, """
            INSERT INTO test_results 
            (run_id, test_name, test_suite, status, message, duration_ms, error_message, start_time, end_time)
            VALUES %s
        """, test_data)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("✓ Successfully uploaded test results to database")
        print(f"  Run ID: {run_id}")
        print(f"  Total Tests: {summary['total_tests']}")
        print(f"  Passed: {summary['passed']}")
        print(f"  Failed: {summary['failed']}")
        print(f"  Skipped: {summary['skipped']}")
        print(f"  Duration: {summary['duration_ms']}ms")
        
        return True
        
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        return False


def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python upload_results.py <xunit_file>")
        print("Example: python upload_results.py output.xml")
        sys.exit(1)
    
    xunit_file = sys.argv[1]
    
    print(f"Parsing xunit file: {xunit_file}")
    data = parse_xunit_file(xunit_file)
    
    run_id = generate_run_id()
    print(f"Generated run ID: {run_id}")
    
    success = upload_to_database(run_id, data)
    
    if success:
        print("\n✓ Results uploaded successfully!")
        sys.exit(0)
    else:
        print("\n✗ Failed to upload results")
        sys.exit(1)


if __name__ == '__main__':
    main()
