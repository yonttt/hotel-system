import sys
import os
sys.path.append('.')

try:
    from app.core.database import get_db_connection
    
    # Test specific API endpoints data
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Test guests data
    cursor.execute('SELECT COUNT(*) FROM guests')
    guest_count = cursor.fetchone()[0]
    print(f'Guests table: {guest_count} records')
    
    # Test rooms data  
    cursor.execute('SELECT COUNT(*) FROM rooms')
    room_count = cursor.fetchone()[0]
    print(f'Rooms table: {room_count} records')
    
    # Test cities data
    cursor.execute('SELECT COUNT(*) FROM cities')
    city_count = cursor.fetchone()[0]
    print(f'Cities table: {city_count} records')
    
    # Test hotel_registrations structure
    cursor.execute('DESCRIBE hotel_registrations')
    reg_columns = cursor.fetchall()
    print('\nhotel_registrations columns:')
    for col in reg_columns[:5]:  # Show first 5 columns
        print(f'  - {col[0]} ({col[1]})')
    
    # Test hotel_reservations structure
    cursor.execute('DESCRIBE hotel_reservations') 
    res_columns = cursor.fetchall()
    print('\nhotel_reservations columns:')
    for col in res_columns[:5]:  # Show first 5 columns
        print(f'  - {col[0]} ({col[1]})')
    
    cursor.close()
    conn.close()
    print('\n✓ All database checks passed!')
    
except Exception as e:
    print(f'✗ Error: {str(e)}')
    import traceback
    traceback.print_exc()