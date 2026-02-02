"""
Test cases for the /api/slow endpoint.
"""

import time
import pytest
from client.api.api import get_slow
from client.models import SlowResponse


def test_get_slow_success(api_client):
    """Test that the slow endpoint returns a successful response."""
    response = get_slow.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    assert response.parsed is not None
    assert isinstance(response.parsed, SlowResponse)


def test_get_slow_response_structure(api_client):
    """Test that the slow response has the expected structure."""
    response = get_slow.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    data = response.parsed
    
    assert data is not None
    assert hasattr(data, 'message')
    assert hasattr(data, 'delay')
    assert hasattr(data, 'timestamp')
    
    assert data.message == "Slow response completed"
    assert 'ms' in data.delay


def test_get_slow_response_time(api_client):
    """Test that the endpoint actually takes time to respond."""
    start_time = time.time()
    response = get_slow.sync_detailed(client=api_client)
    end_time = time.time()
    
    elapsed_time = (end_time - start_time) * 1000  # Convert to milliseconds
    
    assert response.status_code == 200
    # The endpoint should take at least 100ms (minimum delay)
    assert elapsed_time >= 100, f"Expected at least 100ms, but took {elapsed_time:.2f}ms"
    # Should not take more than 1200ms (max 1100ms + some overhead)
    assert elapsed_time <= 1500, f"Expected less than 1500ms, but took {elapsed_time:.2f}ms"


def test_get_slow_delay_value(api_client):
    """Test that the delay value in response matches actual timing."""
    start_time = time.time()
    response = get_slow.sync_detailed(client=api_client)
    end_time = time.time()
    
    elapsed_time = (end_time - start_time) * 1000
    
    assert response.status_code == 200
    data = response.parsed
    
    assert data is not None
    # Extract delay value from string like "543ms"
    reported_delay = int(data.delay.replace('ms', ''))
    
    # Reported delay should be between 100ms and 1100ms
    assert 100 <= reported_delay <= 1100, f"Delay {reported_delay}ms out of expected range"
    
    # Actual elapsed time should be close to reported delay (within 200ms tolerance)
    assert abs(elapsed_time - reported_delay) <= 200, \
        f"Elapsed time {elapsed_time:.0f}ms differs too much from reported {reported_delay}ms"


def test_get_slow_multiple_requests_vary(api_client):
    """Test that multiple requests have varying delays."""
    delays = []
    
    for _ in range(5):
        response = get_slow.sync_detailed(client=api_client)
        assert response.status_code == 200
        data = response.parsed
        assert data is not None
        
        delay = int(data.delay.replace('ms', ''))
        delays.append(delay)
    
    # All delays should be in valid range
    assert all(100 <= d <= 1100 for d in delays)
    
    # At least some variation in delays (not all the same)
    assert len(set(delays)) > 1, "Expected varying delays across multiple requests"
