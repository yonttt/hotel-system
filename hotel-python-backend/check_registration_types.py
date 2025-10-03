"""Check current database structure for registration and reservation types."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    # Check all tables
    cursor.execute("SHOW TABLES")
    tables = [row[0] for row in cursor.fetchall()]
    
    print("=" * 80)
    print("DATABASE TABLES")
    print("=" * 80)
    for table in tables:
        print(f"- {table}")
    print()
    
    # Check if registration_types or reservation_types table exists
    if 'registration_types' in tables:
        print("=" * 80)
        print("REGISTRATION_TYPES TABLE STRUCTURE")
        print("=" * 80)
        cursor.execute("DESCRIBE registration_types")
        for row in cursor.fetchall():
            print(row)
        
        cursor.execute("SELECT COUNT(*) FROM registration_types")
        count = cursor.fetchone()[0]
        print(f"\nTotal records: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM registration_types LIMIT 10")
            print("\nSample data:")
            for row in cursor.fetchall():
                print(row)
        print()
    
    if 'reservation_types' in tables:
        print("=" * 80)
        print("RESERVATION_TYPES TABLE STRUCTURE")
        print("=" * 80)
        cursor.execute("DESCRIBE reservation_types")
        for row in cursor.fetchall():
            print(row)
        
        cursor.execute("SELECT COUNT(*) FROM reservation_types")
        count = cursor.fetchone()[0]
        print(f"\nTotal records: {count}")
        
        if count > 0:
            cursor.execute("SELECT * FROM reservation_types LIMIT 10")
            print("\nSample data:")
            for row in cursor.fetchall():
                print(row)
        print()
    
    # Check columns in hotel_reservations
    if 'hotel_reservations' in tables:
        print("=" * 80)
        print("HOTEL_RESERVATIONS - registration_type column")
        print("=" * 80)
        cursor.execute("SHOW COLUMNS FROM hotel_reservations LIKE '%registration_type%'")
        for row in cursor.fetchall():
            print(row)
        
        cursor.execute("SHOW COLUMNS FROM hotel_reservations LIKE '%reservation_type%'")
        for row in cursor.fetchall():
            print(row)
        print()
    
    # Check columns in hotel_registrations
    if 'hotel_registrations' in tables:
        print("=" * 80)
        print("HOTEL_REGISTRATIONS - registration_type column")
        print("=" * 80)
        cursor.execute("SHOW COLUMNS FROM hotel_registrations LIKE '%registration_type%'")
        for row in cursor.fetchall():
            print(row)
        print()
    
    # Check columns in guest_registrations
    if 'guest_registrations' in tables:
        print("=" * 80)
        print("GUEST_REGISTRATIONS - registration_type_id column")
        print("=" * 80)
        cursor.execute("SHOW COLUMNS FROM guest_registrations LIKE '%registration_type%'")
        for row in cursor.fetchall():
            print(row)
        print()
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
