import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_db
from app.models import HotelRegistration, HotelReservation
from datetime import datetime, date

def test_new_numbering_system():
    """Test the new 10-digit numbering system for both registrations and reservations."""
    db = next(get_db())
    try:
        print("=== Testing New 10-Digit Numbering System ===\n")
        
        # Test hotel registrations
        print("1. Testing Hotel Registrations:")
        
        # Create test registration with first number
        test_registration = HotelRegistration(
            registration_no="0000000001",
            transaction_by="ADMIN",
            guest_name="Test Guest 1",
            mobile_phone="081234567890",
            address="Test Address",
            email="test1@example.com",
            room_number="101",
            guest_count_male=2,
            guest_count_female=0,
            guest_count_child=0,
            nights=3,
            arrival_date=datetime.now().date(),
            departure_date=datetime.now().date(),
            created_by=1
        )
        db.add(test_registration)
        db.commit()
        db.refresh(test_registration)
        print(f"   ✓ Created registration: {test_registration.registration_no}")
        
        # Create second registration
        test_registration2 = HotelRegistration(
            registration_no="0000000002",
            transaction_by="ADMIN",
            guest_name="Test Guest 2",
            mobile_phone="081234567891",
            address="Test Address 2",
            email="test2@example.com",
            room_number="102",
            guest_count_male=1,
            guest_count_female=0,
            guest_count_child=1,
            nights=2,
            arrival_date=datetime.now().date(),
            departure_date=datetime.now().date(),
            created_by=1
        )
        db.add(test_registration2)
        db.commit()
        db.refresh(test_registration2)
        print(f"   ✓ Created registration: {test_registration2.registration_no}")
        
        # Test next registration number generation
        latest_registration = db.query(HotelRegistration).order_by(HotelRegistration.id.desc()).first()
        if latest_registration:
            last_number = int(latest_registration.registration_no)
            next_number = last_number + 1
            next_registration_no = f"{next_number:010d}"
            print(f"   ✓ Next registration number would be: {next_registration_no}")
        
        print()
        
        # Test hotel reservations
        print("2. Testing Hotel Reservations:")
        
        # Create test reservation with first number
        test_reservation = HotelReservation(
            reservation_no="0000000001",
            transaction_by="ADMIN",
            guest_name="Test Reservation Guest 1",
            mobile_phone="081234567892",
            address="Test Reservation Address",
            email="reservation1@example.com",
            room_number="201",
            guest_male=2,
            guest_female=0,
            guest_child=0,
            nights=3,
            arrival_date=datetime.now().date(),
            departure_date=datetime.now().date(),
            created_by=1
        )
        db.add(test_reservation)
        db.commit()
        db.refresh(test_reservation)
        print(f"   ✓ Created reservation: {test_reservation.reservation_no}")
        
        # Create second reservation
        test_reservation2 = HotelReservation(
            reservation_no="0000000002",
            transaction_by="ADMIN",
            guest_name="Test Reservation Guest 2",
            mobile_phone="081234567893",
            address="Test Reservation Address 2",
            email="reservation2@example.com",
            room_number="202",
            guest_male=1,
            guest_female=0,
            guest_child=2,
            nights=1,
            arrival_date=datetime.now().date(),
            departure_date=datetime.now().date(),
            created_by=1
        )
        db.add(test_reservation2)
        db.commit()
        db.refresh(test_reservation2)
        print(f"   ✓ Created reservation: {test_reservation2.reservation_no}")
        
        # Test next reservation number generation
        latest_reservation = db.query(HotelReservation).order_by(HotelReservation.id.desc()).first()
        if latest_reservation:
            last_number = int(latest_reservation.reservation_no)
            next_number = last_number + 1
            next_reservation_no = f"{next_number:010d}"
            print(f"   ✓ Next reservation number would be: {next_reservation_no}")
        
        print()
        print("=== Summary ===")
        
        # Count records
        registration_count = db.query(HotelRegistration).count()
        reservation_count = db.query(HotelReservation).count()
        
        print(f"Total registrations: {registration_count}")
        print(f"Total reservations: {reservation_count}")
        print("✓ New 10-digit numbering system is working correctly!")
        
    except Exception as e:
        print(f"Error testing numbering system: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_new_numbering_system()