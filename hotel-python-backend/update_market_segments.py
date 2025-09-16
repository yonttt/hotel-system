import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pymysql
import re
from app.core.config import settings

def parse_database_url(url):
    """Parse database URL to extract connection components"""
    pattern = r'mysql\+pymysql://([^:]+):([^@]+)@([^/]+)/(.+)'
    match = re.match(pattern, url)
    if match:
        return {
            'user': match.group(1),
            'password': match.group(2),
            'host': match.group(3),
            'database': match.group(4)
        }
    return None

def update_market_segments():
    """
    1. Drop guest_registrations table if it exists
    2. Update market_segment values to new categories
    """
    
    connection = None
    try:
        # Parse database URL
        db_config = parse_database_url(settings.DATABASE_URL)
        if not db_config:
            raise ValueError("Could not parse DATABASE_URL")
        
        # Connect to database
        connection = pymysql.connect(
            host=db_config['host'],
            user=db_config['user'],
            password=db_config['password'],
            database=db_config['database'],
            charset='utf8mb4'
        )
        
        cursor = connection.cursor()
        
        print("=== Database Market Segment Update ===\n")
        
        # 1. Check and drop guest_registrations table
        print("1. Checking guest_registrations table...")
        cursor.execute("SHOW TABLES LIKE 'guest_registrations'")
        if cursor.fetchone():
            print("   Found guest_registrations table - dropping it...")
            cursor.execute("DROP TABLE guest_registrations")
            print("   ✓ guest_registrations table dropped successfully")
        else:
            print("   ✓ guest_registrations table doesn't exist (already removed)")
        
        print()
        
        # 2. Check current market_segment values
        print("2. Checking current market_segment values...")
        
        # Check hotel_registrations
        cursor.execute("DESCRIBE hotel_registrations")
        reg_columns = [row[0] for row in cursor.fetchall()]
        
        if 'market_segment' in reg_columns:
            cursor.execute("SELECT DISTINCT market_segment FROM hotel_registrations WHERE market_segment IS NOT NULL")
            reg_segments = [row[0] for row in cursor.fetchall()]
            print(f"   hotel_registrations market_segment values: {reg_segments}")
        else:
            print("   ✓ hotel_registrations doesn't have market_segment column")
        
        # Check hotel_reservations
        cursor.execute("DESCRIBE hotel_reservations")
        res_columns = [row[0] for row in cursor.fetchall()]
        
        if 'market_segment' in res_columns:
            cursor.execute("SELECT DISTINCT market_segment FROM hotel_reservations WHERE market_segment IS NOT NULL")
            res_segments = [row[0] for row in cursor.fetchall()]
            print(f"   hotel_reservations market_segment values: {res_segments}")
        else:
            print("   ✓ hotel_reservations doesn't have market_segment column")
        
        print()
        
        # 3. Define new market segment categories based on the image
        new_categories = [
            'Normal',
            '10 Room Free 1',
            'Family',
            'Staff Rate',
            'Out Of Order Room',
            'Keamanan / Polisi',
            'Dinas Management',
            'Owner',
            'Special Case'
        ]
        
        print("3. New market segment categories:")
        for i, category in enumerate(new_categories, 1):
            print(f"   {i}. {category}")
        
        print()
        
        # 4. Update existing records to use new categories
        if 'market_segment' in reg_columns and reg_segments:
            print("4. Updating hotel_registrations market_segment values...")
            # Update all existing records to use 'Normal' as default
            cursor.execute("UPDATE hotel_registrations SET market_segment = 'Normal' WHERE market_segment IS NOT NULL")
            updated_reg = cursor.rowcount
            print(f"   ✓ Updated {updated_reg} registration records to 'Normal'")
        
        if 'market_segment' in res_columns and res_segments:
            print("5. Updating hotel_reservations market_segment values...")
            # Update all existing records to use 'Normal' as default
            cursor.execute("UPDATE hotel_reservations SET market_segment = 'Normal' WHERE market_segment IS NOT NULL")
            updated_res = cursor.rowcount
            print(f"   ✓ Updated {updated_res} reservation records to 'Normal'")
        
        print()
        
        # 5. Show final database state
        print("6. Final database state:")
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        
        print("   Current tables:")
        for table in tables:
            if table in ['hotel_registrations', 'hotel_reservations', 'users', 'rooms']:
                print(f"     ✓ {table}")
        
        if 'guest_registrations' not in tables:
            print("   ✓ guest_registrations table confirmed removed")
        
        print()
        print("=== Summary ===")
        print("✓ guest_registrations table removed")
        print("✓ Market segment categories updated")
        print("✓ Ready to use new categories in forms")
        print("\nNew categories available:")
        for category in new_categories:
            print(f"  - {category}")
        
        connection.commit()
        
    except Exception as e:
        print(f"Error updating market segments: {e}")
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()

if __name__ == "__main__":
    update_market_segments()