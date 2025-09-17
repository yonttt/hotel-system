#!/usr/bin/env python3
"""
Test script to verify authentication and dropdown data connectivity
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_authentication():
    """Test login with database users"""
    print("🔐 Testing Authentication System...")
    
    # Test admin login
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful!")
            print(f"   User: {data.get('user', {}).get('username')}")
            print(f"   Role: {data.get('user', {}).get('role')}")
            return data.get('access_token')
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_dropdown_data(token=None):
    """Test dropdown data endpoints"""
    print("\n📋 Testing Dropdown Data Connectivity...")
    
    headers = {}
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    endpoints = [
        ('/api/cities', 'Cities'),
        ('/api/nationalities', 'Nationalities'),
        ('/api/category-markets', 'Category Markets'),
        ('/api/market-segments', 'Market Segments'),
        ('/api/payment-methods', 'Payment Methods'),
        ('/api/registration-types', 'Registration Types')
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            if response.status_code == 200:
                data = response.json()
                count = len(data) if isinstance(data, list) else 0
                print(f"✅ {name}: {count} items loaded")
                if count > 0 and isinstance(data, list):
                    print(f"   Sample: {data[0].get('name', 'N/A')}")
            else:
                print(f"❌ {name}: Failed ({response.status_code})")
        except Exception as e:
            print(f"❌ {name}: Error - {e}")

def test_other_users():
    """Test other user accounts"""
    print("\n👥 Testing Other User Accounts...")
    
    users = [
        ("manager", "manager123"),
        ("staff", "staff123")
    ]
    
    for username, password in users:
        login_data = {"username": username, "password": password}
        try:
            response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {username.title()} login successful!")
                print(f"   Role: {data.get('user', {}).get('role')}")
            else:
                print(f"❌ {username.title()} login failed: {response.status_code}")
        except Exception as e:
            print(f"❌ {username.title()} login error: {e}")

if __name__ == "__main__":
    print("🏨 Hotel System Database Connectivity Test")
    print("=" * 50)
    
    # Test authentication
    token = test_authentication()
    
    # Test dropdown data
    test_dropdown_data(token)
    
    # Test other users
    test_other_users()
    
    print("\n" + "=" * 50)
    print("✅ Database connectivity test completed!")
    print("\n📝 Summary:")
    print("   • Authentication: Using database users with JWT tokens")
    print("   • Dropdown Data: Connected to database lookup tables")
    print("   • User Roles: admin, manager, staff accounts available")
    print("   • Frontend: http://localhost:5173 (login page)")
    print("   • Backend API: http://127.0.0.1:8000/docs")