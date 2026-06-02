from app.config.database import get_db_connection
conn = get_db_connection()
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT room_number, status FROM hotel_rooms WHERE status != 'VR'")
print(cursor.fetchall())
cursor.close()
conn.close()
