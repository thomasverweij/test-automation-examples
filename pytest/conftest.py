"""
Pytest configuration and fixtures for API testing.
"""

import pytest
from client import Client


@pytest.fixture
def base_url():
    """Base URL for the API server."""
    return "http://localhost:8888"


@pytest.fixture
def api_client(base_url):
    """Create an API client instance."""
    return Client(base_url=base_url)


@pytest.fixture
def test_user_credentials():
    """Test user credentials for authentication tests."""
    return {
        "user1": {"username": "user1", "password": "password1", "requires_2fa": True},
        "user2": {"username": "user2", "password": "password2", "requires_2fa": False},
    }
