"""Quick script to check category_markets table structure."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    cursor.execute("DESCRIBE category_markets")
    
    print("Category Markets Table Structure:")
    print("-" * 80)
    for row in cursor.fetchall():
        print(row)
    print("-" * 80)
    
    cursor.execute("SELECT * FROM category_markets LIMIT 5")
    print("\nSample Data:")
    print("-" * 80)
    for row in cursor.fetchall():
        print(row)
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
