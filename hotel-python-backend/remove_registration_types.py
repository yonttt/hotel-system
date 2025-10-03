"""
Remove registration_types and reservation_types from database.
This script will:
1. Drop foreign key constraints
2. Remove registration_type_id and registration_type columns from tables
3. Drop registration_types and reservation_types tables
"""

import mysql.connector
from mysql.connector import Error

def remove_registration_reservation_types():
    """Remove registration and reservation type tables and columns."""
    
    connection = None
    cursor = None
    
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host='localhost',
            user='system',
            password='yont29921',
            database='hotel_system'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            print("✅ Connected to MySQL database")
            
            # Start transaction
            connection.start_transaction()
            
            print("\n" + "=" * 80)
            print("REMOVING REGISTRATION AND RESERVATION TYPES")
            print("=" * 80 + "\n")
            
            # Step 1: Drop foreign key constraints
            print("Step 1: Dropping foreign key constraints...")
            print("-" * 80)
            
            # Get all foreign key constraints related to registration_types and reservation_types
            cursor.execute("""
                SELECT 
                    TABLE_NAME, 
                    CONSTRAINT_NAME
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = 'hotel_system' 
                AND REFERENCED_TABLE_NAME IN ('registration_types', 'reservation_types')
            """)
            
            fk_constraints = cursor.fetchall()
            
            for table_name, constraint_name in fk_constraints:
                try:
                    cursor.execute(f"ALTER TABLE {table_name} DROP FOREIGN KEY {constraint_name}")
                    print(f"✓ Dropped FK constraint: {constraint_name} from {table_name}")
                except Error as e:
                    print(f"  Warning: Could not drop {constraint_name}: {e}")
            
            # Step 2: Drop columns from tables
            print("\nStep 2: Dropping columns from tables...")
            print("-" * 80)
            
            # Drop columns from hotel_reservations
            try:
                cursor.execute("ALTER TABLE hotel_reservations DROP COLUMN registration_type_id")
                print("✓ Dropped column: registration_type_id from hotel_reservations")
            except Error as e:
                print(f"  Note: {e}")
            
            try:
                cursor.execute("ALTER TABLE hotel_reservations DROP COLUMN registration_type")
                print("✓ Dropped column: registration_type from hotel_reservations")
            except Error as e:
                print(f"  Note: {e}")
            
            # Drop columns from hotel_registrations
            try:
                cursor.execute("ALTER TABLE hotel_registrations DROP COLUMN registration_type_id")
                print("✓ Dropped column: registration_type_id from hotel_registrations")
            except Error as e:
                print(f"  Note: {e}")
            
            try:
                cursor.execute("ALTER TABLE hotel_registrations DROP COLUMN registration_type")
                print("✓ Dropped column: registration_type from hotel_registrations")
            except Error as e:
                print(f"  Note: {e}")
            
            # Drop column from guest_registrations
            try:
                cursor.execute("ALTER TABLE guest_registrations DROP COLUMN registration_type_id")
                print("✓ Dropped column: registration_type_id from guest_registrations")
            except Error as e:
                print(f"  Note: {e}")
            
            # Step 3: Drop tables
            print("\nStep 3: Dropping tables...")
            print("-" * 80)
            
            # Check and drop registration_types table
            cursor.execute("SHOW TABLES LIKE 'registration_types'")
            if cursor.fetchone():
                cursor.execute("DROP TABLE registration_types")
                print("✓ Dropped table: registration_types")
            else:
                print("  Table registration_types does not exist")
            
            # Check and drop reservation_types table
            cursor.execute("SHOW TABLES LIKE 'reservation_types'")
            if cursor.fetchone():
                cursor.execute("DROP TABLE reservation_types")
                print("✓ Dropped table: reservation_types")
            else:
                print("  Table reservation_types does not exist")
            
            # Commit the transaction
            connection.commit()
            
            print("\n" + "=" * 80)
            print("✅ SUCCESSFULLY REMOVED REGISTRATION AND RESERVATION TYPES")
            print("=" * 80)
            
            # Verify changes
            print("\nVerifying changes...")
            print("-" * 80)
            
            cursor.execute("SHOW TABLES")
            tables = [row[0] for row in cursor.fetchall()]
            
            if 'registration_types' not in tables:
                print("✓ registration_types table removed")
            else:
                print("✗ registration_types table still exists")
            
            if 'reservation_types' not in tables:
                print("✓ reservation_types table removed")
            else:
                print("✗ reservation_types table still exists")
            
            # Check columns
            cursor.execute("SHOW COLUMNS FROM hotel_reservations")
            hr_columns = [row[0] for row in cursor.fetchall()]
            
            if 'registration_type' not in hr_columns and 'registration_type_id' not in hr_columns:
                print("✓ hotel_reservations columns removed")
            else:
                print("✗ hotel_reservations still has registration_type columns")
            
            cursor.execute("SHOW COLUMNS FROM hotel_registrations")
            hreg_columns = [row[0] for row in cursor.fetchall()]
            
            if 'registration_type' not in hreg_columns and 'registration_type_id' not in hreg_columns:
                print("✓ hotel_registrations columns removed")
            else:
                print("✗ hotel_registrations still has registration_type columns")
            
            cursor.execute("SHOW COLUMNS FROM guest_registrations")
            gr_columns = [row[0] for row in cursor.fetchall()]
            
            if 'registration_type_id' not in gr_columns:
                print("✓ guest_registrations columns removed")
            else:
                print("✗ guest_registrations still has registration_type_id column")
            
    except Error as e:
        if connection:
            connection.rollback()
        print(f"\n❌ Error: {e}")
        raise
    
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    print("=" * 80)
    print("REMOVE REGISTRATION AND RESERVATION TYPES FROM DATABASE")
    print("=" * 80)
    print("\nThis script will:")
    print("1. Drop foreign key constraints")
    print("2. Remove registration_type and registration_type_id columns from:")
    print("   - hotel_reservations")
    print("   - hotel_registrations")
    print("   - guest_registrations")
    print("3. Drop registration_types table")
    print("4. Drop reservation_types table")
    print("\n⚠️  WARNING: This action cannot be undone!")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print("\n🚀 Starting removal process...\n")
        try:
            remove_registration_reservation_types()
            print("\n✅ Database update completed successfully!")
        except Exception as e:
            print(f"\n❌ Update failed: {e}")
    else:
        print("\n❌ Operation cancelled by user")
