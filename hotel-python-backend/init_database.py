import sys
import os
from datetime import datetime

# Add the current directory to Python path
sys.path.insert(0, '.')

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import User
import mysql.connector
from app.core.config import settings

def create_default_users():
    """Create default users in the database"""
    db = SessionLocal()
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"Users already exist in database ({existing_users} users found)")
            return
        
        # Create default admin user
        admin_user = User(
            username="admin",
            password=get_password_hash("admin123"),
            email="admin@hotel.com",
            role="admin"
        )
        
        # Create default manager user
        manager_user = User(
            username="manager",
            password=get_password_hash("manager123"),
            email="manager@hotel.com",
            role="manager"
        )
        
        # Create default staff user
        staff_user = User(
            username="staff",
            password=get_password_hash("staff123"),
            email="staff@hotel.com",
            role="staff"
        )
        
        db.add(admin_user)
        db.add(manager_user)
        db.add(staff_user)
        db.commit()
        
        print("✅ Default users created successfully:")
        print("   - admin/admin123 (Admin)")
        print("   - manager/manager123 (Manager)")
        print("   - staff/staff123 (Staff)")
        
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

def populate_dropdown_tables():
    """Populate dropdown tables with initial data"""
    try:
        # Get direct MySQL connection
        from app.core.database import get_db_connection
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Insert Cities
        cities_data = [
            ('Jakarta', 'DKI Jakarta'),
            ('Surabaya', 'Jawa Timur'),
            ('Bandung', 'Jawa Barat'),
            ('Medan', 'Sumatera Utara'),
            ('Semarang', 'Jawa Tengah'),
            ('Makassar', 'Sulawesi Selatan'),
            ('Palembang', 'Sumatera Selatan'),
            ('Tangerang', 'Banten'),
            ('Depok', 'Jawa Barat'),
            ('Bekasi', 'Jawa Barat')
        ]
        
        # Check if cities already exist
        cursor.execute("SELECT COUNT(*) FROM cities")
        cities_count = cursor.fetchone()[0]
        
        if cities_count == 0:
            cursor.execute("""
                INSERT INTO cities (name, province) VALUES (%s, %s)
            """)
            for city, province in cities_data:
                cursor.execute("INSERT INTO cities (name, province) VALUES (%s, %s)", (city, province))
            print("✅ Cities data inserted successfully")
        else:
            print(f"Cities already exist in database ({cities_count} cities found)")
        
        # Insert Countries/Nationalities
        countries_data = [
            'INDONESIA', 'MALAYSIA', 'SINGAPORE', 'THAILAND', 'PHILIPPINES',
            'VIETNAM', 'BRUNEI', 'MYANMAR', 'LAOS', 'CAMBODIA',
            'CHINA', 'JAPAN', 'SOUTH KOREA', 'INDIA', 'AUSTRALIA',
            'NEW ZEALAND', 'UNITED STATES', 'UNITED KINGDOM', 'GERMANY', 'FRANCE',
            'NETHERLANDS', 'ITALY', 'SPAIN', 'RUSSIA', 'SAUDI ARABIA'
        ]
        
        cursor.execute("SELECT COUNT(*) FROM nationalities")
        countries_count = cursor.fetchone()[0]
        
        if countries_count == 0:
            for country in countries_data:
                cursor.execute("INSERT INTO nationalities (name) VALUES (%s)", (country,))
            print("✅ Countries/Nationalities data inserted successfully")
        else:
            print(f"Countries already exist in database ({countries_count} countries found)")
        
        # Insert Category Markets
        category_markets_data = [
            ('Walk In', 'Direct walk-in guests'),
            ('Online Travel Agent', 'Bookings from OTA platforms'),
            ('Travel Agent', 'Traditional travel agency bookings'),
            ('Corporate', 'Business and corporate bookings'),
            ('Group', 'Group bookings and events'),
            ('Government', 'Government official bookings'),
            ('Airline Crew', 'Airline crew accommodation'),
            ('Regular Guest', 'Returning regular customers')
        ]
        
        cursor.execute("SELECT COUNT(*) FROM category_markets")
        category_count = cursor.fetchone()[0]
        
        if category_count == 0:
            for name, description in category_markets_data:
                cursor.execute("INSERT INTO category_markets (name, description) VALUES (%s, %s)", (name, description))
            print("✅ Category Markets data inserted successfully")
        else:
            print(f"Category Markets already exist in database ({category_count} categories found)")
        
        # Insert Market Segments
        market_segments_data = [
            ('Business', 'Business travelers'),
            ('Leisure', 'Leisure and vacation travelers'),
            ('Meeting & Event', 'Meeting and event attendees'),
            ('Wedding', 'Wedding guests and parties'),
            ('Transit', 'Transit passengers'),
            ('Long Stay', 'Extended stay guests'),
            ('Medical', 'Medical tourism guests'),
            ('Education', 'Educational tour groups')
        ]
        
        cursor.execute("SELECT COUNT(*) FROM market_segments")
        segments_count = cursor.fetchone()[0]
        
        if segments_count == 0:
            for name, description in market_segments_data:
                cursor.execute("INSERT INTO market_segments (name, description) VALUES (%s, %s)", (name, description))
            print("✅ Market Segments data inserted successfully")
        else:
            print(f"Market Segments already exist in database ({segments_count} segments found)")
        
        # Insert Payment Methods
        payment_methods_data = [
            ('Cash', 'Cash payment'),
            ('Credit Card', 'Credit card payment'),
            ('Debit Card', 'Debit card payment'),
            ('Bank Transfer', 'Bank transfer payment'),
            ('Mobile Payment', 'Mobile payment (e-wallet)'),
            ('Company Billing', 'Company account billing'),
            ('Voucher', 'Voucher or coupon payment'),
            ('Installment', 'Installment payment')
        ]
        
        cursor.execute("SELECT COUNT(*) FROM payment_methods")
        payment_count = cursor.fetchone()[0]
        
        if payment_count == 0:
            for name, description in payment_methods_data:
                cursor.execute("INSERT INTO payment_methods (name, description) VALUES (%s, %s)", (name, description))
            print("✅ Payment Methods data inserted successfully")
        else:
            print(f"Payment Methods already exist in database ({payment_count} methods found)")
        
        # Insert Registration Types
        registration_types_data = [
            ('Individual', 'Individual guest registration'),
            ('Group', 'Group registration'),
            ('Corporate', 'Corporate booking registration'),
            ('Event', 'Event-based registration'),
            ('VIP', 'VIP guest registration'),
            ('Complimentary', 'Complimentary stay registration'),
            ('Staff', 'Hotel staff accommodation'),
            ('Emergency', 'Emergency accommodation')
        ]
        
        cursor.execute("SELECT COUNT(*) FROM registration_types")
        reg_types_count = cursor.fetchone()[0]
        
        if reg_types_count == 0:
            for name, description in registration_types_data:
                cursor.execute("INSERT INTO registration_types (name, description) VALUES (%s, %s)", (name, description))
            print("✅ Registration Types data inserted successfully")
        else:
            print(f"Registration Types already exist in database ({reg_types_count} types found)")
        
        # Insert Sample Rooms
        rooms_data = [
            ('101', 'Standard', 'available'),
            ('102', 'Standard', 'available'),
            ('103', 'Standard', 'available'),
            ('201', 'Deluxe', 'available'),
            ('202', 'Deluxe', 'available'),
            ('203', 'Deluxe', 'available'),
            ('301', 'Suite', 'available'),
            ('302', 'Suite', 'available'),
            ('401', 'Presidential', 'available'),
            ('501', 'Penthouse', 'available')
        ]
        
        cursor.execute("SELECT COUNT(*) FROM rooms")
        rooms_count = cursor.fetchone()[0]
        
        if rooms_count == 0:
            for room_number, room_type, status in rooms_data:
                cursor.execute("INSERT INTO rooms (room_number, room_type, status) VALUES (%s, %s, %s)", (room_number, room_type, status))
            print("✅ Sample Rooms data inserted successfully")
        else:
            print(f"Rooms already exist in database ({rooms_count} rooms found)")
        
        connection.commit()
        
    except Exception as e:
        print(f"❌ Error populating dropdown tables: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

def main():
    print("🔧 Initializing Hotel Management System Database...")
    print("=" * 50)
    
    try:
        # Create tables first
        from app.core.database import engine
        from app.models import Base
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created/verified successfully")
        
        # Create default users
        create_default_users()
        
        # Populate dropdown tables
        populate_dropdown_tables()
        
        print("=" * 50)
        print("🎉 Database initialization completed successfully!")
        print("\nDefault Login Credentials:")
        print("  Admin:   admin/admin123")
        print("  Manager: manager/manager123")
        print("  Staff:   staff/staff123")
        print("\nThe system is now ready to use with populated dropdown data.")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()