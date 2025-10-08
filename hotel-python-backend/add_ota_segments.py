"""
Add Online Travel Agent (OTA) market segments to the database.
Based on the provided list of OTA platforms.
"""

import mysql.connector
from mysql.connector import Error

def add_ota_market_segments():
    """Add OTA market segments."""
    
    # OTA market segments with descriptions and discount percentages
    ota_segments = [
        ('OTA - AgodaCom', 15.00, 'Agoda.com booking platform'),
        ('OTA - AirBnB', 15.00, 'AirBnB booking platform'),
        ('OTA - BookingCom', 15.00, 'Booking.com platform'),
        ('OTA - BookingLokal', 12.00, 'Local booking platform'),
        ('OTA - MisterAladin', 12.00, 'Mister Aladin booking platform'),
        ('OTA - PegiPegiCom', 12.00, 'PegiPegi.com booking platform'),
        ('OTA - TIKET COM', 12.00, 'Tiket.com booking platform'),
        ('OTA - Traveloka', 15.00, 'Traveloka booking platform'),
        ('OTA - Travelsinu', 12.00, 'Travelsinu booking platform'),
        ('OTA - Travelsinu Pay At Hotel', 12.00, 'Travelsinu pay at hotel option'),
    ]
    
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
            print("ADDING OTA MARKET SEGMENTS")
            print("=" * 80 + "\n")
            
            # Check if any OTA segments already exist
            cursor.execute("SELECT COUNT(*) FROM market_segments WHERE category = 'Online Travel Agent (OTA)'")
            existing_count = cursor.fetchone()[0]
            
            if existing_count > 0:
                print(f"⚠️  Warning: {existing_count} OTA segments already exist.")
                response = input("Do you want to delete existing OTA segments and recreate them? (yes/no): ").strip().lower()
                
                if response in ['yes', 'y']:
                    cursor.execute("DELETE FROM market_segments WHERE category = 'Online Travel Agent (OTA)'")
                    print(f"🗑️  Deleted {cursor.rowcount} existing OTA segments\n")
                else:
                    print("❌ Operation cancelled. Keeping existing segments.")
                    return
            
            # Insert new OTA segments
            insert_count = 0
            for name, discount, description in ota_segments:
                cursor.execute(
                    """INSERT INTO market_segments 
                    (name, discount_percentage, category, description, active) 
                    VALUES (%s, %s, %s, %s, TRUE)""",
                    (name, discount, 'Online Travel Agent (OTA)', description)
                )
                insert_count += 1
                print(f"✓ Added: {name} ({discount}% discount)")
            
            # Commit the transaction
            connection.commit()
            print(f"\n✅ Successfully inserted {insert_count} OTA market segments")
            
            # Display the new data
            cursor.execute("""
                SELECT id, name, discount_percentage, description 
                FROM market_segments 
                WHERE category = 'Online Travel Agent (OTA)'
                ORDER BY name
            """)
            
            print("\n" + "=" * 80)
            print("OTA MARKET SEGMENTS")
            print("=" * 80)
            
            for row in cursor.fetchall():
                print(f"\nID: {row[0]}")
                print(f"  Name: {row[1]}")
                print(f"  Discount: {row[2]}%")
                print(f"  Description: {row[3]}")
            
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
    print("ADD OTA (ONLINE TRAVEL AGENT) MARKET SEGMENTS")
    print("=" * 80)
    print("\nThis script will add the following OTA platform segments:")
    print("1. AgodaCom (15% discount)")
    print("2. AirBnB (15% discount)")
    print("3. BookingCom (15% discount)")
    print("4. BookingLokal (12% discount)")
    print("5. MisterAladin (12% discount)")
    print("6. PegiPegiCom (12% discount)")
    print("7. TIKET COM (12% discount)")
    print("8. Traveloka (15% discount)")
    print("9. Travelsinu (12% discount)")
    print("10. Travelsinu Pay At Hotel (12% discount)")
    print("\nAll segments will be linked to 'Online Travel Agent (OTA)' category")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print("\n🚀 Starting process...\n")
        try:
            add_ota_market_segments()
            print("\n✅ OTA market segments added successfully!")
        except Exception as e:
            print(f"\n❌ Process failed: {e}")
    else:
        print("\n❌ Operation cancelled by user")
