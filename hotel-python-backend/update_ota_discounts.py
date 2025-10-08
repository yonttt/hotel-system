"""
Update OTA market segments to have 0% discount
"""

import mysql.connector
from mysql.connector import Error

def update_ota_discounts():
    """Update all OTA market segments to 0% discount."""
    
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
            print("UPDATING OTA MARKET SEGMENTS DISCOUNTS")
            print("=" * 80 + "\n")
            
            # Get current OTA segments
            cursor.execute("""
                SELECT id, name, discount_percentage 
                FROM market_segments 
                WHERE category = 'Online Travel Agent (OTA)'
                ORDER BY name
            """)
            
            ota_segments = cursor.fetchall()
            
            if not ota_segments:
                print("❌ No OTA segments found!")
                return
            
            print(f"Found {len(ota_segments)} OTA segments\n")
            print("Current discounts:")
            print("-" * 80)
            for seg in ota_segments:
                print(f"  {seg[1]}: {seg[2]}%")
            
            # Update all OTA segments to 0% discount
            cursor.execute("""
                UPDATE market_segments 
                SET discount_percentage = 0.00 
                WHERE category = 'Online Travel Agent (OTA)'
            """)
            
            updated_count = cursor.rowcount
            
            # Commit the transaction
            connection.commit()
            
            print(f"\n✅ Successfully updated {updated_count} OTA segments to 0% discount")
            
            # Display the updated data
            cursor.execute("""
                SELECT id, name, discount_percentage 
                FROM market_segments 
                WHERE category = 'Online Travel Agent (OTA)'
                ORDER BY name
            """)
            
            print("\n" + "=" * 80)
            print("UPDATED OTA MARKET SEGMENTS")
            print("=" * 80)
            
            for row in cursor.fetchall():
                print(f"\n  {row[1]}")
                print(f"    Discount: {row[2]}%")
            
            print("\n" + "=" * 80)
            
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
    print("UPDATE OTA DISCOUNTS TO 0%")
    print("=" * 80)
    print("\nThis script will update all OTA market segments to have 0% discount")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print("\n🚀 Starting process...\n")
        try:
            update_ota_discounts()
            print("\n✅ OTA discounts updated successfully!")
        except Exception as e:
            print(f"\n❌ Process failed: {e}")
    else:
        print("\n❌ Operation cancelled by user")
