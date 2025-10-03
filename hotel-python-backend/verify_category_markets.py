"""Verify the category_markets table after update."""

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
    cursor.execute("SELECT id, name, active, created_at FROM category_markets ORDER BY id")
    
    print("=" * 80)
    print("CATEGORY MARKETS - VERIFICATION")
    print("=" * 80)
    print(f"\nTotal Records: {cursor.rowcount}")
    print("\nDetails:")
    print("-" * 80)
    
    for row in cursor.fetchall():
        status = "Active" if row[2] else "Inactive"
        print(f"ID: {row[0]:<3} | Name: {row[1]:<35} | Status: {status:<8} | Created: {row[3]}")
    
    print("-" * 80)
    
    cursor.close()
    connection.close()
    
    print("\n✅ Verification complete!")
    
except Exception as e:
    print(f"Error: {e}")
