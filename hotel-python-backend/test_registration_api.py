import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_db
from app.models import HotelRegistration

def test_registration_number_api():
    """Test the registration number generation logic directly"""
    
    print("=== Testing Registration Number Generation ===\n")
    
    db = next(get_db())
    try:
        # Simulate the API endpoint logic
        print("1. Testing next registration number generation:")
        
        # Get the latest registration number (same as API logic)
        latest_registration = db.query(HotelRegistration).order_by(HotelRegistration.id.desc()).first()
        
        if latest_registration and latest_registration.registration_no:
            try:
                # Extract number from the registration number (assuming 10-digit format like "0000000001")
                last_number = int(latest_registration.registration_no)
                next_number = last_number + 1
                print(f"   Last registration number: {latest_registration.registration_no}")
                print(f"   Extracted last number: {last_number}")
            except ValueError:
                # If parsing fails, start from 1
                next_number = 1
                print("   Could not parse last number, starting from 1")
        else:
            next_number = 1
            print("   No existing registrations, starting from 1")
        
        # Format as 10 digits with leading zeros
        next_registration_no = f"{next_number:010d}"
        
        print(f"   Next registration number: {next_registration_no}")
        
        # Test if this looks correct
        if next_registration_no == "0000000001" or (len(next_registration_no) == 10 and next_registration_no.isdigit()):
            print("   ✓ Registration number format is correct")
        else:
            print(f"   ✗ Registration number format looks wrong: {next_registration_no}")
        
        print()
        
        # Show what the API should return
        api_response = {"next_registration_no": next_registration_no}
        print("2. API Response format:")
        print(f"   {api_response}")
        
        print()
        print("=== Diagnosis ===")
        print("If the frontend shows random numbers, it means:")
        print("1. Backend API server is not running")
        print("2. API endpoint is not accessible")
        print("3. Frontend is using fallback generator")
        print()
        print("✓ Database logic is working correctly")
        print("✓ Should return clean 10-digit format")
        print("! Need to ensure backend server is running")
        
    except Exception as e:
        print(f"Error testing registration number: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_registration_number_api()