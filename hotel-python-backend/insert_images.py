import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="system",
    password="yont29921",
    database="hotel_system"
)
c = conn.cursor()

queries = [
    ("hero", "hero_image_1", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80", "text"),
    ("hero", "hero_image_2", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80", "text"),
    ("rooms", "room_image_executive", "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", "text"),
    ("rooms", "room_image_deluxe", "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80", "text")
]

for q in queries:
    c.execute("INSERT INTO website_content (section_name, setting_key, setting_value, setting_type) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE setting_value=setting_value", q)

conn.commit()
print("Image fields inserted successfully.")
conn.close()