"""Final verification of registration and reservation types removal."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    print("=" * 80)
    print("FINAL VERIFICATION - REGISTRATION AND RESERVATION TYPES REMOVAL")
    print("=" * 80 + "\n")
    
    # Check tables
    cursor.execute("SHOW TABLES")
    tables = [row[0] for row in cursor.fetchall()]
    
    print("1. TABLES VERIFICATION")
    print("-" * 80)
    if 'registration_types' in tables:
        print("❌ registration_types table still exists")
    else:
        print("✅ registration_types table successfully removed")
    
    if 'reservation_types' in tables:
        print("❌ reservation_types table still exists")
    else:
        print("✅ reservation_types table successfully removed")
    
    # Check columns in hotel_reservations
    print("\n2. HOTEL_RESERVATIONS TABLE")
    print("-" * 80)
    cursor.execute("SHOW COLUMNS FROM hotel_reservations")
    hr_columns = [row[0] for row in cursor.fetchall()]
    
    if 'registration_type' in hr_columns:
        print("❌ registration_type column still exists")
    else:
        print("✅ registration_type column removed")
    
    if 'registration_type_id' in hr_columns:
        print("❌ registration_type_id column still exists")
    else:
        print("✅ registration_type_id column removed")
    
    # Check columns in hotel_registrations
    print("\n3. HOTEL_REGISTRATIONS TABLE")
    print("-" * 80)
    cursor.execute("SHOW COLUMNS FROM hotel_registrations")
    hreg_columns = [row[0] for row in cursor.fetchall()]
    
    if 'registration_type' in hreg_columns:
        print("❌ registration_type column still exists")
    else:
        print("✅ registration_type column removed")
    
    if 'registration_type_id' in hreg_columns:
        print("❌ registration_type_id column still exists")
    else:
        print("✅ registration_type_id column removed")
    
    # Check columns in guest_registrations
    print("\n4. GUEST_REGISTRATIONS TABLE")
    print("-" * 80)
    cursor.execute("SHOW COLUMNS FROM guest_registrations")
    gr_columns = [row[0] for row in cursor.fetchall()]
    
    if 'registration_type_id' in gr_columns:
        print("❌ registration_type_id column still exists")
    else:
        print("✅ registration_type_id column removed")
    
    # Check for any foreign key constraints
    print("\n5. FOREIGN KEY CONSTRAINTS")
    print("-" * 80)
    cursor.execute("""
        SELECT 
            TABLE_NAME, 
            CONSTRAINT_NAME 
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'hotel_system' 
        AND REFERENCED_TABLE_NAME IN ('registration_types', 'reservation_types')
    """)
    
    fk_constraints = cursor.fetchall()
    if fk_constraints:
        print("❌ Foreign key constraints still exist:")
        for table, constraint in fk_constraints:
            print(f"   - {table}: {constraint}")
    else:
        print("✅ All foreign key constraints removed")
    
    print("\n" + "=" * 80)
    print("VERIFICATION COMPLETE!")
    print("=" * 80)
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
