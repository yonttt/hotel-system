import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="system",
    password="yont29921",
    database="hotel_system"
)
c = conn.cursor()

queries = [
    ("offers", "offer_title_1", "Diskon Spesial Akhir Pekan", "text"),
    ("offers", "offer_desc_1", "Nikmati diskon 20% untuk menginap di akhir pekan", "text"),
    ("gallery", "gallery_img_1", "https://images.unsplash.com/photo-1542314831-c53cd4185ca2", "text"),
    ("gallery", "gallery_img_2", "https://images.unsplash.com/photo-1571896349842-33c89424de2d", "text"),
    ("contact", "contact_email", "info@evagrouphotel.com", "text"),
    ("contact", "contact_address", "Jl. Sudirman No 123, Jakarta", "text")
]

for q in queries:
    c.execute("INSERT INTO website_content (section_name, setting_key, setting_value, setting_type) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE setting_value=setting_value", q)

conn.commit()
print("More fields inserted successfully.")
conn.close()