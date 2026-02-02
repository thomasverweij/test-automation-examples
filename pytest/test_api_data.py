"""
Test cases for the /api/data endpoint.
"""

import pytest
from client.api.api import get_data
from client.models import DataResponse


def test_get_data_success(api_client):
    """Test successful retrieval of data from /api/data endpoint."""
    response = get_data.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    assert response.parsed is not None
    assert isinstance(response.parsed, DataResponse)


def test_get_data_response_structure(api_client):
    """Test that the data response has the expected structure."""
    response = get_data.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    data = response.parsed
    
    assert data is not None
    assert hasattr(data, 'message')
    assert hasattr(data, 'timestamp')
    assert hasattr(data, 'data')
    
    assert data.message == "Hello from API"
    # Timestamp is parsed as datetime object by the client
    from datetime import datetime
    assert isinstance(data.timestamp, datetime)
    assert data.data is not None


def test_get_data_items_structure(api_client):
    """Test that the data.items field contains expected values."""
    response = get_data.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    data = response.parsed
    
    assert data is not None
    assert data.data is not None
    assert hasattr(data.data, 'items')
    assert hasattr(data.data, 'status')
    
    assert data.data.items == ["item1", "item2", "item3"]
    assert data.data.status == "success"


def test_get_data_timestamp_format(api_client):
    """Test that the timestamp is a valid datetime object."""
    response = get_data.sync_detailed(client=api_client)
    
    assert response.status_code == 200
    data = response.parsed
    
    assert data is not None
    # Verify timestamp is a datetime object with timezone info
    from datetime import datetime
    assert isinstance(data.timestamp, datetime)
    assert data.timestamp.tzinfo is not None
