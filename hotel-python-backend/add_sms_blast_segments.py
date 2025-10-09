import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

# SMS Blast segments data: (name, discount_percentage, description)
sms_blast_segments = [
    ('SMS Blast', 10.00, 'SMS Blast promotion rate'),
]

def main():
    print("=" * 80)
    print("ADD SMS BLAST MARKET SEGMENTS")
    print("=" * 80)
    print(f"\nThis script will add {len(sms_blast_segments)} SMS Blast segment")
    print("\nAll segments will be linked to 'SMS Blast' category")
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
        
        # Check for existing SMS Blast segments
        cursor.execute("""
            SELECT COUNT(*) FROM market_segments 
            WHERE category = 'SMS Blast'
        """)
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"\n⚠️  Warning: Found {existing_count} existing SMS Blast segments")
            delete = input("Do you want to delete existing SMS Blast segments first? (yes/no): ")
            if delete.lower() == 'yes':
                cursor.execute("DELETE FROM market_segments WHERE category = 'SMS Blast'")
                conn.commit()
                print(f"✓ Deleted {existing_count} existing SMS Blast segments")
        
        # Insert new segments
        print("\n" + "=" * 80)
        print("ADDING SMS BLAST MARKET SEGMENTS")
        print("=" * 80)
        
        insert_query = """
            INSERT INTO market_segments 
            (name, discount_percentage, category, description, active, created_at)
            VALUES (%s, %s, 'SMS Blast', %s, 1, NOW())
        """
        
        success_count = 0
        for name, discount, description in sms_blast_segments:
            try:
                # Add "SMS Blast - " prefix to the name
                full_name = f"SMS Blast - {name}"
                cursor.execute(insert_query, (full_name, discount, description))
                print(f"✓ Added: {full_name} ({discount}% discount)")
                success_count += 1
            except Error as e:
                print(f"❌ Error adding {name}: {e}")
                conn.rollback()
                raise
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Successfully inserted {success_count} SMS Blast market segment")
        
        # Display all SMS Blast segments
        print("\n" + "=" * 80)
        print("SMS BLAST MARKET SEGMENTS")
        print("=" * 80)
        
        cursor.execute("""
            SELECT id, name, discount_percentage, description
            FROM market_segments
            WHERE category = 'SMS Blast'
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
        print("\n✅ SMS Blast market segment added successfully!")
        
    except Error as err:
        print(f"\n❌ Process failed: {err}")
        if conn:
            conn.rollback()
            conn.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    main()
