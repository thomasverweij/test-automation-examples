"""
Test cases for authentication endpoints.
"""

import pytest
from client.api.authentication import get_auth_status
from client.models import UnauthenticatedStatus


def test_get_auth_status_unauthenticated(api_client):
    """Test getting authentication status when not authenticated."""
    response = get_auth_status.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    assert response.parsed is not None
    assert isinstance(response.parsed, UnauthenticatedStatus)
    assert response.parsed.authenticated is False


def test_auth_status_structure(api_client):
    """Test that the auth status response has correct structure."""
    response = get_auth_status.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    parsed = response.parsed
    assert parsed is not None
    assert hasattr(parsed, 'authenticated')
    assert isinstance(parsed.authenticated, bool)
