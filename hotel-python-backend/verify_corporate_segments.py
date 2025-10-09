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
    
    # Get all corporate segments
    cursor.execute("""
        SELECT id, name, discount_percentage, category
        FROM market_segments
        WHERE category = 'Corporate Rate'
        ORDER BY name
    """)
    
    segments = cursor.fetchall()
    
    print("=" * 80)
    print("CORPORATE RATE MARKET SEGMENTS VERIFICATION")
    print("=" * 80)
    print(f"\nTotal Corporate Rate segments: {len(segments)}\n")
    
    for seg in segments:
        print(f"ID {seg[0]:3d}: {seg[1]:45s} | {seg[2]:5.2f}% | Category: {seg[3]}")
    
    # Get summary by discount
    cursor.execute("""
        SELECT discount_percentage, COUNT(*) as count
        FROM market_segments
        WHERE category = 'Corporate Rate'
        GROUP BY discount_percentage
        ORDER BY discount_percentage DESC
    """)
    
    print("\n" + "=" * 80)
    print("DISCOUNT DISTRIBUTION")
    print("=" * 80)
    
    for row in cursor.fetchall():
        print(f"  {row[0]:5.2f}% discount: {row[1]} segment(s)")
    
    cursor.close()
    conn.close()
    
    print("\n✅ Verification complete!")
    
except mysql.connector.Error as err:
    print(f"❌ Error: {err}")
