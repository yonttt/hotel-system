import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_db
from app.models import HotelRegistration, HotelReservation

def clear_tables():
    """Clear all data from hotel_registrations and hotel_reservations tables."""
    db = next(get_db())
    try:
        # Clear hotel_reservations table
        reservation_count = db.query(HotelReservation).count()
        print(f"Found {reservation_count} records in hotel_reservations table")
        
        if reservation_count > 0:
            db.query(HotelReservation).delete()
            print("Cleared all records from hotel_reservations table")
        
        # Clear hotel_registrations table
        registration_count = db.query(HotelRegistration).count()
        print(f"Found {registration_count} records in hotel_registrations table")
        
        if registration_count > 0:
            db.query(HotelRegistration).delete()
            print("Cleared all records from hotel_registrations table")
        
        # Commit the changes
        db.commit()
        print("Successfully cleared both tables. Ready for new 10-digit numbering system.")
        
    except Exception as e:
        print(f"Error clearing tables: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_tables()