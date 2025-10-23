"""
Run Group Booking Migration
This script creates the group_bookings and group_booking_rooms tables in the database.
"""
import pymysql
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Update with your password if needed
    'database': 'hotel_system',
    'charset': 'utf8mb4'
}

def run_migration():
    """Execute the SQL migration for group bookings"""
    try:
        # Read SQL file
        sql_file = os.path.join(os.path.dirname(__file__), 'database_reference', 'create_group_bookings.sql')
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Connect to database
        connection = pymysql.connect(**DB_CONFIG)
        
        try:
            with connection.cursor() as cursor:
                # Split SQL statements (handle multiple statements)
                statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
                
                for statement in statements:
                    if statement:
                        print(f"Executing: {statement[:80]}...")
                        cursor.execute(statement)
                
                connection.commit()
                print("\n✅ Migration completed successfully!")
                print("   - group_bookings table created")
                print("   - group_booking_rooms table created")
                
        finally:
            connection.close()
            
    except FileNotFoundError:
        print("❌ Error: SQL file not found!")
    except pymysql.Error as e:
        print(f"❌ Database error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("Group Booking Database Migration")
    print("=" * 60)
    run_migration()
