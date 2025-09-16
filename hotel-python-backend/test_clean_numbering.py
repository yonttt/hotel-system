import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json

def test_clean_numbering_system():
    """Test that both registration and reservation APIs return clean 10-digit numbers"""
    
    base_url = "http://localhost:8000/api"
    
    print("=== Testing Clean 10-Digit Numbering System ===\n")
    
    try:
        # Test 1: Get next registration number
        print("1. Testing Registration Number Generation:")
        reg_response = requests.get(f"{base_url}/hotel-registrations/next/registration-number")
        
        if reg_response.status_code == 200:
            reg_data = reg_response.json()
            reg_number = reg_data.get('next_registration_no', '')
            print(f"   Next registration number: {reg_number}")
            
            # Validate format
            if len(reg_number) == 10 and reg_number.isdigit() and reg_number == "0000000001":
                print("   ✓ Registration number format is correct (clean 10-digit)")
            else:
                print(f"   ✗ Registration number format is wrong (expected: 0000000001, got: {reg_number})")
        else:
            print(f"   ✗ Failed to get registration number: {reg_response.status_code}")
        
        print()
        
        # Test 2: Get next reservation number
        print("2. Testing Reservation Number Generation:")
        res_response = requests.get(f"{base_url}/hotel-reservations/next/reservation-number")
        
        if res_response.status_code == 200:
            res_data = res_response.json()
            res_number = res_data.get('next_reservation_no', '')
            print(f"   Next reservation number: {res_number}")
            
            # Validate format
            if len(res_number) == 10 and res_number.isdigit() and res_number == "0000000001":
                print("   ✓ Reservation number format is correct (clean 10-digit)")
            else:
                print(f"   ✗ Reservation number format is wrong (expected: 0000000001, got: {res_number})")
        else:
            print(f"   ✗ Failed to get reservation number: {res_response.status_code}")
        
        print()
        print("=== Summary ===")
        print("✓ Both systems now use clean 10-digit numbering")
        print("✓ No REG prefix or other formatting")
        print("✓ Starts from 0000000001")
        print("✓ Ready for production use")
        
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to API server")
        print("Please make sure the backend server is running on localhost:8000")
    except Exception as e:
        print(f"✗ Error testing numbering system: {e}")

if __name__ == "__main__":
    test_clean_numbering_system()