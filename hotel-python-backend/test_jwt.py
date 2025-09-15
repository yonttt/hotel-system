"""
Test JWT token verification directly
"""
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.security import verify_token, create_access_token

def test_jwt():
    """Test JWT token creation and verification"""
    # Create a token
    token = create_access_token(data={"sub": "admin"})
    print(f"Created token: {token}")
    
    # Verify the token
    username = verify_token(token)
    print(f"Verified username: {username}")
    
    # Test with the token from our API test
    api_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc1NzkxNDU5OH0.uHpogjUDjq-GW5AHMZYrqMpFIiQfzv_tlkS0cF85lCk"
    username_from_api = verify_token(api_token)
    print(f"API token verification: {username_from_api}")

if __name__ == "__main__":
    test_jwt()