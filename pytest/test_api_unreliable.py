"""
Test cases for the /api/unreliable endpoint.
"""

import pytest
from client.api.api import get_unreliable
from client.models import SuccessResponse, ErrorResponse


def test_get_unreliable_returns_response(api_client):
    """Test that the unreliable endpoint returns some response."""
    response = get_unreliable.sync_detailed(client=api_client)
    
    # Should return either 200 or 500
    assert response.status_code in [200, 500]


def test_get_unreliable_success_response(api_client):
    """Test the structure of a successful response from the unreliable endpoint."""
    # Retry until we get a success (max 10 attempts)
    for _ in range(10):
        response = get_unreliable.sync_detailed(client=api_client)
        if response.status_code == 200:
            assert response.parsed is not None
            assert isinstance(response.parsed, SuccessResponse)
            assert hasattr(response.parsed, 'message')
            assert hasattr(response.parsed, 'timestamp')
            assert response.parsed.message == "Request succeeded"
            break
    else:
        pytest.skip("Could not get a successful response after 10 attempts")


def test_get_unreliable_error_response(api_client):
    """Test the structure of an error response from the unreliable endpoint."""
    # Retry until we get an error (max 10 attempts)
    for _ in range(10):
        response = get_unreliable.sync_detailed(client=api_client)
        if response.status_code == 500:
            assert response.parsed is not None
            assert isinstance(response.parsed, ErrorResponse)
            assert hasattr(response.parsed, 'error')
            assert hasattr(response.parsed, 'message')
            assert response.parsed.error == "Internal Server Error"
            assert response.parsed.message == "This endpoint randomly fails"
            break
    else:
        pytest.skip("Could not get an error response after 10 attempts")


def test_get_unreliable_retry_logic(api_client):
    """Test that the endpoint eventually succeeds with retries."""
    max_retries = 20
    success_count = 0
    error_count = 0
    
    for _ in range(max_retries):
        response = get_unreliable.sync_detailed(client=api_client)
        if response.status_code == 200:
            success_count += 1
        elif response.status_code == 500:
            error_count += 1
    
    # Both success and error should occur at least once in 20 attempts
    assert success_count > 0, "Expected at least one success in 20 attempts"
    assert error_count > 0, "Expected at least one error in 20 attempts"
    
    # Roughly 50% success rate (allow for variance)
    assert 5 <= success_count <= 15, f"Expected roughly 10 successes, got {success_count}"
