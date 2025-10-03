"""Check foreign key constraints."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    # Get all foreign key constraints related to registration_types
    cursor.execute("""
        SELECT 
            TABLE_NAME, 
            CONSTRAINT_NAME, 
            COLUMN_NAME, 
            REFERENCED_TABLE_NAME,
            REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE 
        WHERE TABLE_SCHEMA = 'hotel_system' 
        AND REFERENCED_TABLE_NAME IN ('registration_types', 'reservation_types')
    """)
    
    print("=" * 80)
    print("FOREIGN KEY CONSTRAINTS")
    print("=" * 80)
    
    fks = cursor.fetchall()
    if fks:
        for fk in fks:
            print(f"\nTable: {fk[0]}")
            print(f"  Constraint: {fk[1]}")
            print(f"  Column: {fk[2]}")
            print(f"  References: {fk[3]}.{fk[4]}")
    else:
        print("No foreign key constraints found")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
