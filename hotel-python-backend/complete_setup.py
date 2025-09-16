#!/usr/bin/env python3
"""
Complete the database setup by adding missing tables
"""

import mysql.connector
from mysql.connector import Error

def complete_database_setup():
    """Add missing tables to complete the setup"""
    
    try:
        # Connect to database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='hotel_system'
        )
        
        cursor = connection.cursor()
        
        print("Adding missing tables...")
        
        # Create category_markets table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS category_markets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create hotel_registrations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS hotel_registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                registration_no VARCHAR(20) UNIQUE NOT NULL,
                category_market VARCHAR(50) DEFAULT 'Walkin',
                market_segment VARCHAR(50) DEFAULT 'Normal',
                member_id VARCHAR(50),
                transaction_by VARCHAR(100) NOT NULL,
                transaction_status ENUM('Registration', 'Check-in', 'Check-out', 'Cancelled') DEFAULT 'Registration',
                id_card_type ENUM('KTP', 'SIM', 'PASSPORT', 'OTHERS') DEFAULT 'KTP',
                id_card_number VARCHAR(50),
                guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
                guest_name VARCHAR(100) NOT NULL,
                mobile_phone VARCHAR(20) NOT NULL,
                address TEXT,
                nationality VARCHAR(50) DEFAULT 'INDONESIA',
                city VARCHAR(100),
                email VARCHAR(100),
                arrival_date DATE NOT NULL,
                departure_date DATE NOT NULL,
                nights INT DEFAULT 1,
                guest_type ENUM('Normal', 'VIP', 'Corporate') DEFAULT 'Normal',
                guest_count_male INT DEFAULT 1,
                guest_count_female INT DEFAULT 0,
                guest_count_child INT DEFAULT 0,
                extra_bed_nights INT DEFAULT 0,
                extra_bed_qty INT DEFAULT 0,
                room_number VARCHAR(20),
                payment_method VARCHAR(100) DEFAULT 'Cash',
                registration_type VARCHAR(100) DEFAULT 'Individual',
                payment_amount DECIMAL(10, 2) DEFAULT 0,
                discount DECIMAL(10, 2) DEFAULT 0,
                payment_diskon DECIMAL(10, 2) DEFAULT 0,
                deposit DECIMAL(10, 2) DEFAULT 0,
                balance DECIMAL(10, 2) DEFAULT 0,
                notes TEXT,
                hotel_name VARCHAR(100) DEFAULT 'New Idola Hotel',
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Insert category markets data
        cursor.execute("""
            INSERT IGNORE INTO category_markets (name) VALUES 
            ('Walkin'),
            ('Online'),
            ('Corporate'),
            ('Travel Agent')
        """)
        
        # Update hotel_reservations table if needed
        cursor.execute("""
            ALTER TABLE hotel_reservations 
            ADD COLUMN IF NOT EXISTS category_market VARCHAR(50) DEFAULT 'Walkin' AFTER reservation_no,
            ADD COLUMN IF NOT EXISTS member_id VARCHAR(50) AFTER market_segment,
            ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER nationality,
            ADD COLUMN IF NOT EXISTS payment_diskon DECIMAL(10, 2) DEFAULT 0 AFTER discount
        """)
        
        connection.commit()
        print("✅ Database setup completed successfully!")
        
        # Verify tables
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"\nTotal tables: {len(tables)}")
        
        expected_tables = ['hotel_reservations', 'hotel_registrations', 'category_markets', 'payment_methods']
        existing_table_names = [table[0] for table in tables]
        
        print("\nFinal verification:")
        for expected in expected_tables:
            if expected in existing_table_names:
                print(f"✅ {expected}")
            else:
                print(f"❌ {expected}")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    complete_database_setup()