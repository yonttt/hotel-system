import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

# WAWCARD segments data: (name, discount_percentage, description)
wawcard_segments = [
    ('WAWCARD', 12.00, 'WAWCARD member rate'),
]

def main():
    print("=" * 80)
    print("ADD WAWCARD MARKET SEGMENTS")
    print("=" * 80)
    print(f"\nThis script will add {len(wawcard_segments)} WAWCARD segment")
    print("\nAll segments will be linked to 'WAWCARD' category")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ")
    if response.lower() != 'yes':
        print("Operation cancelled.")
        return
    
    try:
        print("\n🚀 Starting process...")
        
        # Connect to database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("\n✅ Connected to MySQL database")
        
        # Check for existing WAWCARD segments
        cursor.execute("""
            SELECT COUNT(*) FROM market_segments 
            WHERE category = 'WAWCARD'
        """)
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"\n⚠️  Warning: Found {existing_count} existing WAWCARD segments")
            delete = input("Do you want to delete existing WAWCARD segments first? (yes/no): ")
            if delete.lower() == 'yes':
                cursor.execute("DELETE FROM market_segments WHERE category = 'WAWCARD'")
                conn.commit()
                print(f"✓ Deleted {existing_count} existing WAWCARD segments")
        
        # Insert new segments
        print("\n" + "=" * 80)
        print("ADDING WAWCARD MARKET SEGMENTS")
        print("=" * 80)
        
        insert_query = """
            INSERT INTO market_segments 
            (name, discount_percentage, category, description, active, created_at)
            VALUES (%s, %s, 'WAWCARD', %s, 1, NOW())
        """
        
        success_count = 0
        for name, discount, description in wawcard_segments:
            try:
                # Add "WAWCARD - " prefix to the name
                full_name = f"WAWCARD - {name}"
                cursor.execute(insert_query, (full_name, discount, description))
                print(f"✓ Added: {full_name} ({discount}% discount)")
                success_count += 1
            except Error as e:
                print(f"❌ Error adding {name}: {e}")
                conn.rollback()
                raise
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Successfully inserted {success_count} WAWCARD market segment")
        
        # Display all WAWCARD segments
        print("\n" + "=" * 80)
        print("WAWCARD MARKET SEGMENTS")
        print("=" * 80)
        
        cursor.execute("""
            SELECT id, name, discount_percentage, description
            FROM market_segments
            WHERE category = 'WAWCARD'
            ORDER BY name
        """)
        
        for row in cursor.fetchall():
            print(f"\nID: {row[0]}")
            print(f"  Name: {row[1]}")
            print(f"  Discount: {row[2]:.2f}%")
            print(f"  Description: {row[3]}")
        
        print("\n" + "=" * 80)
        
        cursor.close()
        conn.close()
        print("\n✅ MySQL connection closed")
        print("\n✅ WAWCARD market segment added successfully!")
        
    except Error as err:
        print(f"\n❌ Process failed: {err}")
        if conn:
            conn.rollback()
            conn.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    main()
