import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

# Government Rate segments data: (name, discount_percentage, description)
government_segments = [
    ('Government', 15.00, 'Standard government rate'),
    ('KPU Tasikmalaya', 0.00, 'KPU Tasikmalaya government rate'),
    ('POM Nasional 10%', 10.00, 'POM Nasional 10% government rate'),
    ('POM Nasional 15%', 15.00, 'POM Nasional 15% government rate'),
    ('Universitas Terbuka Kemdikbud', 10.00, 'Universitas Terbuka Kemdikbud Ristek government rate'),
]

def main():
    print("=" * 80)
    print("ADD GOVERNMENT RATE MARKET SEGMENTS")
    print("=" * 80)
    print(f"\nThis script will add {len(government_segments)} Government Rate segments")
    print("\nAll segments will be linked to 'Government Rate' category")
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
        
        # Check for existing Government Rate segments
        cursor.execute("""
            SELECT COUNT(*) FROM market_segments 
            WHERE category = 'Government Rate'
        """)
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"\n⚠️  Warning: Found {existing_count} existing Government Rate segments")
            delete = input("Do you want to delete existing Government Rate segments first? (yes/no): ")
            if delete.lower() == 'yes':
                cursor.execute("DELETE FROM market_segments WHERE category = 'Government Rate'")
                conn.commit()
                print(f"✓ Deleted {existing_count} existing Government Rate segments")
        
        # Insert new segments
        print("\n" + "=" * 80)
        print("ADDING GOVERNMENT RATE MARKET SEGMENTS")
        print("=" * 80)
        
        insert_query = """
            INSERT INTO market_segments 
            (name, discount_percentage, category, description, active, created_at)
            VALUES (%s, %s, 'Government Rate', %s, 1, NOW())
        """
        
        success_count = 0
        for name, discount, description in government_segments:
            try:
                # Add "Government - " prefix to the name
                full_name = f"Government - {name}"
                cursor.execute(insert_query, (full_name, discount, description))
                print(f"✓ Added: {full_name} ({discount}% discount)")
                success_count += 1
            except Error as e:
                print(f"❌ Error adding {name}: {e}")
                conn.rollback()
                raise
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Successfully inserted {success_count} Government Rate market segments")
        
        # Display all Government Rate segments
        print("\n" + "=" * 80)
        print("GOVERNMENT RATE MARKET SEGMENTS")
        print("=" * 80)
        
        cursor.execute("""
            SELECT id, name, discount_percentage, description
            FROM market_segments
            WHERE category = 'Government Rate'
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
        print("\n✅ Government Rate market segments added successfully!")
        
    except Error as err:
        print(f"\n❌ Process failed: {err}")
        if conn:
            conn.rollback()
            conn.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    main()
