"""Check current market segments and their linkage to category markets."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    # Get all category markets
    print("=" * 80)
    print("CATEGORY MARKETS")
    print("=" * 80)
    cursor.execute("SELECT id, name FROM category_markets ORDER BY id")
    category_markets = cursor.fetchall()
    for cm in category_markets:
        print(f"ID: {cm[0]:<3} | Name: {cm[1]}")
    
    # Get all market segments
    print("\n" + "=" * 80)
    print("MARKET SEGMENTS")
    print("=" * 80)
    cursor.execute("""
        SELECT ms.id, ms.name, ms.category_market_id, cm.name as category_name
        FROM market_segments ms
        LEFT JOIN category_markets cm ON ms.category_market_id = cm.id
        ORDER BY ms.category_market_id, ms.id
    """)
    
    segments = cursor.fetchall()
    current_category = None
    
    for seg in segments:
        if seg[2] != current_category:
            current_category = seg[2]
            cat_name = seg[3] if seg[3] else "Not Linked"
            print(f"\n--- Category: {cat_name} (ID: {seg[2]}) ---")
        print(f"  ID: {seg[0]:<3} | Name: {seg[1]}")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
