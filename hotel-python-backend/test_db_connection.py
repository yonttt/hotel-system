import sys
import os
sys.path.append('.')

try:
    from app.core.database import get_db_connection
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT 1')
    result = cursor.fetchone()  # Consume the result
    print('✓ Database connection successful')
    
    # Check tables
    cursor.execute('SHOW TABLES LIKE %s', ('hotel_registrations',))
    result = cursor.fetchone()
    print(f'hotel_registrations table: {"exists" if result else "not found"}')
    
    cursor.execute('SHOW TABLES LIKE %s', ('hotel_reservations',))
    result = cursor.fetchone()
    print(f'hotel_reservations table: {"exists" if result else "not found"}')
    
    # List all tables
    cursor.execute('SHOW TABLES')
    tables = cursor.fetchall()
    print('\nAll tables in database:')
    for table in tables:
        print(f'  - {table[0]}')
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f'✗ Error: {str(e)}')
    import traceback
    traceback.print_exc()