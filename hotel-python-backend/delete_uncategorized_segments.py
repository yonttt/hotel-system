import mysql.connector

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

try:
    # Connect to database
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    print("=" * 80)
    print("UNCATEGORIZED MARKET SEGMENTS")
    print("=" * 80)
    
    # Get all segments without category or with NULL category
    cursor.execute("""
        SELECT id, name, discount_percentage, category, description
        FROM market_segments
        WHERE category IS NULL OR category = ''
        ORDER BY name
    """)
    
    segments = cursor.fetchall()
    
    print(f"\nFound {len(segments)} uncategorized segments:\n")
    
    for seg in segments:
        category_display = seg[3] if seg[3] else "NULL"
        print(f"ID {seg[0]:3d}: {seg[1]:30s} | {seg[2]:5.2f}% | Category: {category_display}")
    
    if len(segments) > 0:
        print("\n" + "=" * 80)
        print("DELETE CONFIRMATION")
        print("=" * 80)
        print(f"\nThis will DELETE {len(segments)} uncategorized segments.")
        print("These are legacy segments not linked to any category market.")
        print("\nSegments with proper categories (Walkin, OTA, Corporate, Group, etc.) will be kept.")
        
        response = input("\nDo you want to DELETE these uncategorized segments? (yes/no): ")
        
        if response.lower() == 'yes':
            # Delete uncategorized segments
            cursor.execute("""
                DELETE FROM market_segments
                WHERE category IS NULL OR category = ''
            """)
            conn.commit()
            
            print(f"\n✅ Successfully deleted {len(segments)} uncategorized segments!")
            
            # Show updated count
            cursor.execute("SELECT COUNT(*) FROM market_segments")
            total = cursor.fetchone()[0]
            print(f"\n📊 Total remaining market segments: {total}")
            
        else:
            print("\n❌ Operation cancelled. No segments were deleted.")
    else:
        print("✅ No uncategorized segments found. All segments have proper categories!")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
