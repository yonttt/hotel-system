"""
Add Corporate Rate market segments to the database.
All corporate clients with their specific discount percentages.
"""

import mysql.connector
from mysql.connector import Error

def add_corporate_segments():
    """Add Corporate Rate market segments."""
    
    # Corporate Rate segments with company names and discount percentages
    corporate_segments = [
        ('Corporate - Anata tour and Travel', 14.00, 'Anata tour and Travel corporate rate'),
        ('Corporate - Avatar Sejagad Bandung', 10.00, 'Avatar Sejagad Bandung corporate rate'),
        ('Corporate - Corporate', 0.00, 'Standard corporate rate'),
        ('Corporate - Gatra tour and Travel', 15.00, 'Gatra tour and Travel corporate rate'),
        ('Corporate - Golkar - Hotel benua', 0.00, 'Golkar - Hotel benua corporate rate'),
        ('Corporate - INDO CIPTA WISESA', 15.00, 'INDO CIPTA WISESA corporate rate'),
        ('Corporate - KPCDI', 20.00, 'Komunitas Pasien Cuci Darah Indonesia (KPCDI) corporate rate'),
        ('Corporate - Natura World', 15.00, 'Natura World corporate rate'),
        ('Corporate - Pandawa Event Organizer', 15.00, 'Pandawa Event Organizer corporate rate'),
        ('Corporate - PT Alfa Star Indonesia', 10.00, 'PT Alfa Star Indonesia corporate rate'),
        ('Corporate - PT Fajar Futura Fortuna', 15.00, 'PT Fajar Futura Fortuna corporate rate'),
        ('Corporate - PT Garuda Food', 15.00, 'PT Garuda Food corporate rate'),
        ('Corporate - PT Mandiri Utama Finance', 15.00, 'PT Mandiri Utama Finance corporate rate'),
        ('Corporate - PT Stars Internasional', 0.00, 'PT Stars Internasional corporate rate'),
        ('Corporate - PT Xirka Dama Persada', 15.00, 'PT Xirka Dama Persada corporate rate'),
        ('Corporate - Queen Travelling', 15.00, 'Queen Travelling corporate rate'),
        ('Corporate - Saluyu EO', 15.00, 'Saluyu EO corporate rate'),
        ('Corporate - Syahril - Sini and Associates (20%)', 20.00, 'Syahril - Sini and Associates 20% discount'),
        ('Corporate - Syahril - Sini and Associates (24%)', 24.00, 'Syahril - Sini and Associates 24% discount'),
        ('Corporate - Tiens and Vision', 15.00, 'Tiens and Vision corporate rate'),
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
            print("ADDING CORPORATE RATE MARKET SEGMENTS")
            print("=" * 80 + "\n")
            
            # Check if any Corporate segments already exist
            cursor.execute("SELECT COUNT(*) FROM market_segments WHERE category = 'Corporate Rate'")
            existing_count = cursor.fetchone()[0]
            
            if existing_count > 0:
                print(f"⚠️  Warning: {existing_count} Corporate Rate segments already exist.")
                response = input("Do you want to delete existing Corporate Rate segments and recreate them? (yes/no): ").strip().lower()
                
                if response in ['yes', 'y']:
                    cursor.execute("DELETE FROM market_segments WHERE category = 'Corporate Rate'")
                    print(f"🗑️  Deleted {cursor.rowcount} existing Corporate Rate segments\n")
                else:
                    print("❌ Operation cancelled. Keeping existing segments.")
                    return
            
            # Insert new Corporate segments
            insert_count = 0
            for name, discount, description in corporate_segments:
                cursor.execute(
                    """INSERT INTO market_segments 
                    (name, discount_percentage, category, description, active) 
                    VALUES (%s, %s, %s, %s, TRUE)""",
                    (name, discount, 'Corporate Rate', description)
                )
                insert_count += 1
                print(f"✓ Added: {name} ({discount}% discount)")
            
            # Commit the transaction
            connection.commit()
            print(f"\n✅ Successfully inserted {insert_count} Corporate Rate market segments")
            
            # Display the new data
            cursor.execute("""
                SELECT id, name, discount_percentage, description 
                FROM market_segments 
                WHERE category = 'Corporate Rate'
                ORDER BY name
            """)
            
            print("\n" + "=" * 80)
            print("CORPORATE RATE MARKET SEGMENTS")
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
    print("ADD CORPORATE RATE MARKET SEGMENTS")
    print("=" * 80)
    print("\nThis script will add the following Corporate Rate segments:")
    print("1. Anata tour and Travel (14% discount)")
    print("2. Avatar Sejagad Bandung (10% discount)")
    print("3. Corporate (0% discount)")
    print("4. Gatra tour and Travel (15% discount)")
    print("5. Golkar - Hotel benua (0% discount)")
    print("6. INDO CIPTA WISESA (15% discount)")
    print("7. Komunitas Pasien Cuci Darah Indonesia (KPCDI) (20% discount)")
    print("8. Natura World (15% discount)")
    print("9. Pandawa Event Organizer (15% discount)")
    print("10. PT Alfa Star Indonesia (10% discount)")
    print("11. PT Fajar Futura Fortuna (15% discount)")
    print("12. PT Garuda Food (15% discount)")
    print("13. PT Mandiri Utama Finance (15% discount)")
    print("14. PT Stars Internasional (0% discount)")
    print("15. PT Xirka Dama Persada (15% discount)")
    print("16. Queen Travelling (15% discount)")
    print("17. Saluyu EO (15% discount)")
    print("18. Syahril - Sini and Associates (20% discount)")
    print("19. Syahril - Sini and Associates (24% discount)")
    print("20. Tiens and Vision (15% discount)")
    print("\nAll segments will be linked to 'Corporate Rate' category")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print("\n🚀 Starting process...\n")
        try:
            add_corporate_segments()
            print("\n✅ Corporate Rate market segments added successfully!")
        except Exception as e:
            print(f"\n❌ Process failed: {e}")
    else:
        print("\n❌ Operation cancelled by user")
