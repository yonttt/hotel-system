import os
import sys

from sqlalchemy import text
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal

db = SessionLocal()
try:
    print("Adding columns to group_bookings...")
    db.execute(text("ALTER TABLE group_bookings ADD COLUMN market_segment VARCHAR(50) DEFAULT 'Normal'"))
    db.commit()
    print("Added market_segment to group_bookings")
except Exception as e:
    db.rollback()
    print(f"Skipped market_segment for group_bookings: {e}")

try:
    db.execute(text("ALTER TABLE group_bookings ADD COLUMN arrival_time VARCHAR(20) NULL"))
    db.commit()
    print("Added arrival_time to group_bookings")
except Exception as e:
    db.rollback()
    print(f"Skipped arrival_time for group_bookings: {e}")

try:
    print("Adding columns to hotel_reservations...")
    db.execute(text("ALTER TABLE hotel_reservations ADD COLUMN market_segment VARCHAR(50) DEFAULT 'Normal'"))
    db.commit()
    print("Added market_segment to hotel_reservations")
except Exception as e:
    db.rollback()
    print(f"Skipped market_segment for hotel_reservations: {e}")

try:
    db.execute(text("ALTER TABLE hotel_reservations ADD COLUMN arrival_time VARCHAR(20) NULL"))
    db.commit()
    print("Added arrival_time to hotel_reservations")
except Exception as e:
    db.rollback()
    print(f"Skipped arrival_time for hotel_reservations: {e}")

db.close()
print("Done.")
