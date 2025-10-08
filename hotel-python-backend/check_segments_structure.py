"""Check market segments table structure."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    print("=" * 80)
    print("MARKET SEGMENTS TABLE STRUCTURE")
    print("=" * 80)
    cursor.execute("DESCRIBE market_segments")
    for row in cursor.fetchall():
        print(row)
    
    print("\n" + "=" * 80)
    print("CURRENT MARKET SEGMENTS")
    print("=" * 80)
    cursor.execute("SELECT * FROM market_segments")
    for row in cursor.fetchall():
        print(row)
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
