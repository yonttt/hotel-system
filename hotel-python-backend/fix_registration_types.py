#!/usr/bin/env python3
"""
Script to fix null registration_type values in hotel_reservations table
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models import HotelReservation
from sqlalchemy import text

def fix_registration_types():
    """Fix null registration_type values in database"""
    db = SessionLocal()
    try:
        # Update all null registration_type values to 'Reservasi'
        result = db.execute(
            text("UPDATE hotel_reservations SET registration_type = 'Reservasi' WHERE registration_type IS NULL")
        )
        
        # Commit the changes
        db.commit()
        
        print(f"✅ Fixed {result.rowcount} records with null registration_type")
        
        # Check if there are any invalid registration_type values
        invalid_records = db.execute(
            text("SELECT COUNT(*) as count FROM hotel_reservations WHERE registration_type NOT IN ('Reservasi', 'Walkin', 'Group')")
        ).fetchone()
        
        if invalid_records.count > 0:
            print(f"⚠️ Found {invalid_records.count} records with invalid registration_type values")
            
            # Fix invalid values to 'Reservasi'
            result2 = db.execute(
                text("UPDATE hotel_reservations SET registration_type = 'Reservasi' WHERE registration_type NOT IN ('Reservasi', 'Walkin', 'Group')")
            )
            db.commit()
            print(f"✅ Fixed {result2.rowcount} records with invalid registration_type")
        
        print("✅ All registration_type values have been fixed!")
        
    except Exception as e:
        print(f"❌ Error fixing registration_type values: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_registration_types()