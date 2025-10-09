import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

# Travel Agent segments data: (name, discount_percentage, description)
travel_agent_segments = [
    ('PT Surga Tamasya Wisata', 10.00, 'PT Surga Tamasya Wisata travel agent rate'),
    ('Travel Agent', 0.00, 'Standard travel agent rate'),
]

def main():
    print("=" * 80)
    print("ADD TRAVEL AGENT MARKET SEGMENTS")
    print("=" * 80)
    print(f"\nThis script will add {len(travel_agent_segments)} Travel Agent segments")
    print("\nAll segments will be linked to 'Travel Agent' category")
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
        
        # Check for existing Travel Agent segments
        cursor.execute("""
            SELECT COUNT(*) FROM market_segments 
            WHERE category = 'Travel Agent'
        """)
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"\n⚠️  Warning: Found {existing_count} existing Travel Agent segments")
            delete = input("Do you want to delete existing Travel Agent segments first? (yes/no): ")
            if delete.lower() == 'yes':
                cursor.execute("DELETE FROM market_segments WHERE category = 'Travel Agent'")
                conn.commit()
                print(f"✓ Deleted {existing_count} existing Travel Agent segments")
        
        # Insert new segments
        print("\n" + "=" * 80)
        print("ADDING TRAVEL AGENT MARKET SEGMENTS")
        print("=" * 80)
        
        insert_query = """
            INSERT INTO market_segments 
            (name, discount_percentage, category, description, active, created_at)
            VALUES (%s, %s, 'Travel Agent', %s, 1, NOW())
        """
        
        success_count = 0
        for name, discount, description in travel_agent_segments:
            try:
                # Add "Travel Agent - " prefix to the name
                full_name = f"Travel Agent - {name}"
                cursor.execute(insert_query, (full_name, discount, description))
                print(f"✓ Added: {full_name} ({discount}% discount)")
                success_count += 1
            except Error as e:
                print(f"❌ Error adding {name}: {e}")
                conn.rollback()
                raise
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Successfully inserted {success_count} Travel Agent market segments")
        
        # Display all Travel Agent segments
        print("\n" + "=" * 80)
        print("TRAVEL AGENT MARKET SEGMENTS")
        print("=" * 80)
        
        cursor.execute("""
            SELECT id, name, discount_percentage, description
            FROM market_segments
            WHERE category = 'Travel Agent'
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
        print("\n✅ Travel Agent market segments added successfully!")
        
    except Error as err:
        print(f"\n❌ Process failed: {err}")
        if conn:
            conn.rollback()
            conn.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    main()
