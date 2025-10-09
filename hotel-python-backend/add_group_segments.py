import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system'
}

# Group segments data: (name, discount_percentage, description)
group_segments = [
    ('PSB Biak (Cirebon)', 5.00, 'PSB Biak group rate'),
    ('Abe Holiday (Bandung)', 10.00, 'Abe Holiday group rate'),
    ('Bapak Ady Putra Benua', 20.00, 'Bapak Ady Putra Benua group rate'),
    ('Bapak Agus (Silahturami Serang)', 17.00, 'Bapak Agus Silahturami Serang group rate'),
    ('Bapak Ali Imron Bandung', 10.00, 'Bapak Ali Imron Bandung group rate'),
    ('Bapak Andi (Bandung)', 16.00, 'Bapak Andi Bandung group rate'),
    ('Bapak Angga (Bandung)', 0.00, 'Bapak Angga Bandung group rate'),
    ('Bapak Arie (Bandung)', 25.00, 'Bapak Arie Bandung group rate'),
    ('Bapak Bima (Sponsor Event)', 20.00, 'Bapak Bima Sponsor Event group rate'),
    ('Bapak Darmansyah (Bandung)', 11.00, 'Bapak Darmansyah Bandung group rate'),
    ('Bapak Egi Setiawan (Bandung)', 11.00, 'Bapak Egi Setiawan Bandung group rate'),
    ('Bapak Endra Taufik (Bandung)', 10.00, 'Bapak Endra Taufik Bandung group rate'),
    ('Bapak Firman (Bandung)', 10.00, 'Bapak Firman Bandung group rate'),
    ('Bapak Hanif Bandung HG', 15.00, 'Bapak Hanif Bandung HG group rate'),
    ('Bapak Irfan (Bandung)', 15.00, 'Bapak Irfan Bandung group rate'),
    ('Bapak Latansa (Bandung)', 5.00, 'Bapak Latansa Bandung group rate'),
    ('Bapak Rizki (Bandung)', 15.00, 'Bapak Rizki Bandung group rate'),
    ('Bapak Saprim (Bogor)', 40.00, 'Bapak Saprim Bogor group rate'),
    ('Bapak Sarjito (Bandung)', 7.00, 'Bapak Sarjito Bandung group rate'),
    ('Bapak Syamsul Bahri (Bandung)', 10.00, 'Bapak Syamsul Bahri Bandung group rate'),
    ('Bapak Uyeng (Bandung)', 0.00, 'Bapak Uyeng Bandung group rate'),
    ('Basamo Holiday', 10.00, 'Basamo Holiday group rate'),
    ('Dewa United (Cirebon)', 0.00, 'Dewa United Cirebon group rate'),
    ('Dishub Kota Cirebon', 15.00, 'Dishub Kota Cirebon group rate'),
    ('Eliters Elektro ITB 1977', 25.00, 'Eliters Elektro ITB 1977 group rate'),
    ('GBKP Klasis (Jakarta)', 37.00, 'GBKP Klasis Jakarta group rate'),
    ('Group', 0.00, 'Standard group rate'),
    ('Group Barito Putra', 10.00, 'Group Barito Putra group rate'),
    ('Group Persita', 0.00, 'Group Persita group rate'),
    ('HIMASOS Cirebon', 10.00, 'HIMASOS Cirebon group rate'),
    ('Ibu Andin', 23.00, 'Ibu Andin group rate'),
    ('Ibu Dewi Agustina (Bandung)', 10.00, 'Ibu Dewi Agustina Bandung group rate'),
    ('Ibu Elis (Bandung)', 15.00, 'Ibu Elis Bandung group rate'),
    ('Ibu Gusni Eliza (Bandung)', 10.00, 'Ibu Gusni Eliza Bandung group rate'),
    ('Ibu Gusni (Jakarta)', 10.00, 'Ibu Gusni Jakarta group rate'),
    ('Ibu Ika Jayaperbangsa 12%', 12.00, 'Ibu Ika Jayaperbangsa 12% group rate'),
    ('Ibu Ika Jayaperbangsa 15%', 15.00, 'Ibu Ika Jayaperbangsa 15% group rate'),
    ('Ibu Kiki (Bandung)', 12.00, 'Ibu Kiki Bandung group rate'),
    ('Ibu Kokom (Cirebon)', 0.00, 'Ibu Kokom Cirebon group rate'),
    ('Ibu Lani (Bandung)', 15.00, 'Ibu Lani Bandung group rate'),
    ('Ibu Merry', 20.00, 'Ibu Merry group rate'),
    ('Ibu Ranti (Bandung)', 15.00, 'Ibu Ranti Bandung group rate'),
    ('Ibu Ratna Wangsih (Bandung)', 0.00, 'Ibu Ratna Wangsih Bandung group rate'),
    ('Ibu Sri Apri', 22.00, 'Ibu Sri Apri group rate'),
    ('Ibu Susan Yunawati (Bandung)', 10.00, 'Ibu Susan Yunawati Bandung group rate'),
    ('Ibu Winna (Bandung)', 20.00, 'Ibu Winna Bandung group rate'),
    ('Ibu Wulan Group Wedding', 15.00, 'Ibu Wulan Group Wedding group rate'),
    ('Ibu Yuliana (Bandung)', 11.00, 'Ibu Yuliana Bandung group rate'),
    ('Koswara Group', 15.00, 'Koswara Group group rate'),
    ('Madrasah Tsanawiah', 0.00, 'Madrasah Tsanawiah group rate'),
    ('Mamre GBKP (Bogor)', 20.00, 'Mamre GBKP Bogor group rate'),
    ('MD Film Cirebon', 10.00, 'MD Film Cirebon group rate'),
    ('PT Screenplay Sinema Film', 0.00, 'PT Screenplay Sinema Film group rate'),
    ('PT Arina Multikarya', 5.00, 'PT Arina Multikarya group rate'),
    ('PT BP3TKI', 0.00, 'PT BP3TKI group rate'),
    ('PT USSI Institute', 5.00, 'PT USSI Institute group rate'),
    ('Purnawirakawan Marinir Tour', 0.00, 'Purnawirakawan Marinir Tour group rate'),
    ('Rezky Jaya Wisata Bandung', 10.00, 'Rezky Jaya Wisata Bandung group rate'),
    ('Rezky Jaya Wisata Jakarta', 10.00, 'Rezky Jaya Wisata Jakarta group rate'),
    ('RJ WISATA', 20.00, 'RJ WISATA group rate'),
    ('SLB Yayasan Pangkudiluhur', 14.00, 'SLB Yayasan Pangkudiluhur group rate'),
    ('Sri Ayu Bogor', 10.00, 'Sri Ayu Bogor group rate'),
    ('Surabaya City FC (Cirebon)', 10.00, 'Surabaya City FC Cirebon group rate'),
    ('Uji Coba', 15.00, 'Uji Coba group rate'),
    ('Universitas Gorontalo (Jakarta)', 5.00, 'Universitas Gorontalo Jakarta group rate'),
    ('Universitas Padjajaran', 15.00, 'Universitas Padjajaran group rate'),
    ('WKRI 15%', 15.00, 'Wanita Katholik Republik Indonesia 15% group rate'),
    ('WKRI 5%', 5.00, 'Wanita Katholik Republik Indonesia 5% group rate'),
    ('Weekend Rate Mariani & Tian 55%', 55.00, 'Weekend Rate Ibu Mariani dan Nenek Tian 55%'),
    ('Weekend Rate Mariani & Tian 59%', 59.00, 'Weekend Rate Ibu Mariani dan Nenek Tian 59%'),
    ('Weekend Rate Mariani & Tian 65%', 65.00, 'Weekend Rate Ibu Mariani dan Nenek Tian 65%'),
    ('Yayasan Ummatan Wasatho (YUW)', 10.00, 'Yayasan Ummatan Wasatho YUW group rate'),
    ('YONI AQYAS', 5.00, 'YONI AQYAS group rate'),
]

def main():
    print("=" * 80)
    print("ADD GROUP MARKET SEGMENTS")
    print("=" * 80)
    print(f"\nThis script will add {len(group_segments)} Group segments")
    print("\nAll segments will be linked to 'Group' category")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ")
    if response.lower() != 'yes':
        print("Operation cancelled.")
        return
    
    try:
        print("\n🚀 Starting process...")
        
        # Connect to database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        print("\n✅ Connected to MySQL database")
        
        # Check for existing Group segments
        cursor.execute("""
            SELECT COUNT(*) FROM market_segments 
            WHERE category = 'Group'
        """)
        existing_count = cursor.fetchone()[0]
        
        if existing_count > 0:
            print(f"\n⚠️  Warning: Found {existing_count} existing Group segments")
            delete = input("Do you want to delete existing Group segments first? (yes/no): ")
            if delete.lower() == 'yes':
                cursor.execute("DELETE FROM market_segments WHERE category = 'Group'")
                conn.commit()
                print(f"✓ Deleted {existing_count} existing Group segments")
        
        # Insert new segments
        print("\n" + "=" * 80)
        print("ADDING GROUP MARKET SEGMENTS")
        print("=" * 80)
        
        insert_query = """
            INSERT INTO market_segments 
            (name, discount_percentage, category, description, active, created_at)
            VALUES (%s, %s, 'Group', %s, 1, NOW())
        """
        
        success_count = 0
        for name, discount, description in group_segments:
            try:
                # Add "Group - " prefix to the name
                full_name = f"Group - {name}"
                cursor.execute(insert_query, (full_name, discount, description))
                print(f"✓ Added: {full_name} ({discount}% discount)")
                success_count += 1
            except Error as e:
                print(f"❌ Error adding {name}: {e}")
                conn.rollback()
                raise
        
        # Commit all changes
        conn.commit()
        print(f"\n✅ Successfully inserted {success_count} Group market segments")
        
        # Display all Group segments
        print("\n" + "=" * 80)
        print("GROUP MARKET SEGMENTS")
        print("=" * 80)
        
        cursor.execute("""
            SELECT id, name, discount_percentage, description
            FROM market_segments
            WHERE category = 'Group'
            ORDER BY name
        """)
        
        for row in cursor.fetchall():
            print(f"\nID: {row[0]}")
            print(f"  Name: {row[1]}")
            print(f"  Discount: {row[2]:.2f}%")
            print(f"  Description: {row[3]}")
        
        print("\n" + "=" * 80)
        
        cursor.close()
        conn.close()
        print("\n✅ MySQL connection closed")
        print("\n✅ Group market segments added successfully!")
        
    except Error as err:
        print(f"\n❌ Process failed: {err}")
        if conn:
            conn.rollback()
            conn.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    main()
