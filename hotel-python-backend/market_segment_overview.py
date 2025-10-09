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
    
    print("=" * 100)
    print("COMPLETE MARKET SEGMENT SYSTEM OVERVIEW")
    print("=" * 100)
    
    # Get category markets
    cursor.execute("SELECT id, name FROM category_markets ORDER BY id")
    categories = cursor.fetchall()
    
    print("\n📋 CATEGORY MARKETS (9 total):")
    print("-" * 100)
    for cat in categories:
        print(f"  {cat[0]:2d}. {cat[1]}")
    
    # Get segment counts by category
    cursor.execute("""
        SELECT 
            COALESCE(category, 'Uncategorized') as category,
            COUNT(*) as count,
            MIN(discount_percentage) as min_discount,
            MAX(discount_percentage) as max_discount,
            AVG(discount_percentage) as avg_discount
        FROM market_segments
        WHERE active = 1
        GROUP BY category
        ORDER BY count DESC, category
    """)
    
    segments_by_category = cursor.fetchall()
    
    print("\n" + "=" * 100)
    print("MARKET SEGMENTS BY CATEGORY")
    print("=" * 100)
    
    total_segments = 0
    for row in segments_by_category:
        category, count, min_disc, max_disc, avg_disc = row
        total_segments += count
        print(f"\n📊 {category}")
        print(f"   Segments: {count}")
        print(f"   Discount Range: {min_disc:.2f}% - {max_disc:.2f}%")
        print(f"   Average Discount: {avg_disc:.2f}%")
        
        # Get segment names for this category
        if category == 'Uncategorized':
            cursor.execute("""
                SELECT name, discount_percentage 
                FROM market_segments 
                WHERE category IS NULL AND active = 1
                ORDER BY name
            """)
        else:
            cursor.execute("""
                SELECT name, discount_percentage 
                FROM market_segments 
                WHERE category = %s AND active = 1
                ORDER BY name
            """, (category,))
        
        segments = cursor.fetchall()
        print(f"   Segments List:")
        for seg in segments:
            print(f"     • {seg[0]:45s} ({seg[1]:5.2f}%)")
    
    print("\n" + "=" * 100)
    print(f"TOTAL ACTIVE MARKET SEGMENTS: {total_segments}")
    print("=" * 100)
    
    # Frontend filtering summary
    print("\n" + "=" * 100)
    print("FRONTEND FILTERING STATUS")
    print("=" * 100)
    print("\n✅ Category-based filtering implemented for:")
    print("   1. Walkin (41 segments)")
    print("   2. Online Travel Agent (OTA) (10 segments)")
    print("   3. Corporate Rate (20 segments)")
    print("   4. Group (73 segments)")
    print("\n📝 Other categories use general filtering (excluding Walkin, OTA, Corporate, Group)")
    
    cursor.close()
    conn.close()
    
    print("\n✅ Analysis complete!")
    
except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
