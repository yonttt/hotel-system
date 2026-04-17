import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from sqlalchemy import text

room_types_data = [
    {"category_code": "EXE", "category_name": "Executive", "normal_rate": 345000, "weekend_rate": 360000, "description": ""},
    {"category_code": "SPR", "category_name": "Superior", "normal_rate": 325000, "weekend_rate": 340000, "description": ""},
    {"category_code": "DLX", "category_name": "Deluxe", "normal_rate": 295000, "weekend_rate": 310000, "description": ""},
    {"category_code": "STD", "category_name": "Standard", "normal_rate": 270000, "weekend_rate": 280000, "description": ""},
    {"category_code": "BIS", "category_name": "Business", "normal_rate": 190000, "weekend_rate": 205000, "description": ""},
    {"category_code": "APT", "category_name": "Apartemen", "normal_rate": 360000, "weekend_rate": 375000, "description": ""},
    {"category_code": "APT DLX", "category_name": "APT DLX", "normal_rate": 1000000, "weekend_rate": 1000000, "description": ""}
]

db = SessionLocal()
try:
    for rt in room_types_data:
        # Check if exists
        existing = db.execute(text("SELECT id FROM room_categories WHERE category_code = :code AND hotel_name = 'HOTEL NEW IDOLA'"), {"code": rt["category_code"]}).first()
        if existing:
            db.execute(text("""
                UPDATE room_categories 
                SET category_name = :name, normal_rate = :n_rate, weekend_rate = :w_rate, description = :desc
                WHERE category_code = :code AND hotel_name = 'HOTEL NEW IDOLA'
            """), {"code": rt["category_code"], "name": rt["category_name"], "n_rate": rt["normal_rate"], "w_rate": rt["weekend_rate"], "desc": rt["description"]})
        else:
            db.execute(text("""
                INSERT INTO room_categories (category_code, category_name, normal_rate, weekend_rate, description, is_active, hotel_name)
                VALUES (:code, :name, :n_rate, :w_rate, :desc, 1, 'HOTEL NEW IDOLA')
            """), {"code": rt["category_code"], "name": rt["category_name"], "n_rate": rt["normal_rate"], "w_rate": rt["weekend_rate"], "desc": rt["description"]})
    db.commit()
    print("Room types for HOTEL NEW IDOLA successfully seeded!")
except Exception as e:
    db.rollback()
    print(f"Error: {e}")
finally:
    db.close()