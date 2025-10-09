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
    
    # Get column info
    cursor.execute("""
        SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = 'hotel_system'
        AND TABLE_NAME = 'market_segments'
        AND COLUMN_NAME = 'name'
    """)
    
    result = cursor.fetchone()
    print(f"Column: {result[0]}")
    print(f"Type: {result[1]}")
    print(f"Max Length: {result[2]}")
    
    # Check current longest names
    cursor.execute("""
        SELECT name, LENGTH(name) as len
        FROM market_segments
        ORDER BY len DESC
        LIMIT 5
    """)
    
    print("\nCurrent longest segment names:")
    for row in cursor.fetchall():
        print(f"  {row[1]} chars: {row[0]}")
    
    cursor.close()
    conn.close()
    
except mysql.connector.Error as err:
    print(f"Error: {err}")
