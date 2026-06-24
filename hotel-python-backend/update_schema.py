import os
import sys

from sqlalchemy import text
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config.database import SessionLocal

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

try:
    print("Adding online_quota to room_categories...")
    db.execute(text("ALTER TABLE room_categories ADD COLUMN online_quota INT NULL"))
    db.commit()
    print("Added online_quota to room_categories")
except Exception as e:
    db.rollback()
    print(f"Skipped online_quota for room_categories: {e}")

# Website-facing room specs editable from the CMS (luas/kasur/kapasitas/fasilitas).
for _col, _type in (
    ("room_size", "VARCHAR(20)"),
    ("bed_type", "VARCHAR(50)"),
    ("capacity", "INT"),
    ("amenities", "VARCHAR(500)"),
):
    try:
        db.execute(text(f"ALTER TABLE room_categories ADD COLUMN {_col} {_type} NULL"))
        db.commit()
        print(f"Added {_col} to room_categories")
    except Exception as e:
        db.rollback()
        print(f"Skipped {_col} for room_categories: {e}")

# Website-facing fields on the shared hotels table (used by the public Hotels page).
for _col, _type in (
    ("description", "TEXT"),
    ("show_on_website", "TINYINT(1) DEFAULT 0"),
):
    try:
        db.execute(text(f"ALTER TABLE hotels ADD COLUMN {_col} {_type} NULL"))
        db.commit()
        print(f"Added {_col} to hotels")
    except Exception as e:
        db.rollback()
        print(f"Skipped {_col} for hotels: {e}")

try:
    db.execute(text("UPDATE hotels SET show_on_website=1 WHERE name='HOTEL NEW IDOLA'"))
    db.commit()
    print("Enabled HOTEL NEW IDOLA on website")
except Exception as e:
    db.rollback()
    print(f"Skipped enabling New Idola: {e}")

db.close()
print("Done.")
