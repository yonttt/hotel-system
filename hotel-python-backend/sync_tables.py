#!/usr/bin/env python3
"""
Synchronize hotel_reservations and hotel_registrations table columns

This script ensures both tables have the same column structure
for consistency and compatibility.
"""

import mysql.connector
from mysql.connector import Error

def sync_table_columns():
    """Synchronize columns between hotel_reservations and hotel_registrations"""
    
    try:
        # Connect to database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='hotel_system'
        )
        
        cursor = connection.cursor()
        
        print("Synchronizing table columns...")
        
        # Update hotel_reservations table to match hotel_registrations structure
        sync_queries = [
            # Ensure similar column structure for hotel_reservations
            """
            ALTER TABLE hotel_reservations 
            MODIFY COLUMN transaction_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Checked-in', 'Checked-out') DEFAULT 'Pending'
            """,
            
            """
            ALTER TABLE hotel_reservations 
            MODIFY COLUMN guest_male INT DEFAULT 1,
            MODIFY COLUMN guest_female INT DEFAULT 0,
            MODIFY COLUMN guest_child INT DEFAULT 0
            """,
            
            """
            ALTER TABLE hotel_reservations 
            MODIFY COLUMN payment_method VARCHAR(100) DEFAULT 'Debit BCA 446'
            """,
            
            """
            ALTER TABLE hotel_reservations 
            MODIFY COLUMN registration_type VARCHAR(100) DEFAULT 'Reservasi'
            """,
            
            """
            ALTER TABLE hotel_reservations 
            ADD COLUMN IF NOT EXISTS created_by INT AFTER hotel_name
            """,
            
            # Ensure hotel_registrations has all necessary columns
            """
            ALTER TABLE hotel_registrations 
            MODIFY COLUMN transaction_status ENUM('Registration', 'Check-in', 'Check-out', 'Cancelled') DEFAULT 'Registration'
            """,
            
            """
            ALTER TABLE hotel_registrations 
            MODIFY COLUMN guest_count_male INT DEFAULT 1,
            MODIFY COLUMN guest_count_female INT DEFAULT 0,
            MODIFY COLUMN guest_count_child INT DEFAULT 0
            """,
            
            """
            ALTER TABLE hotel_registrations 
            MODIFY COLUMN payment_method VARCHAR(100) DEFAULT 'Cash'
            """,
            
            """
            ALTER TABLE hotel_registrations 
            MODIFY COLUMN registration_type VARCHAR(100) DEFAULT 'Individual'
            """,
        ]
        
        success_count = 0
        for query in sync_queries:
            try:
                cursor.execute(query)
                connection.commit()
                success_count += 1
                print(f"✓ Applied: {query.strip()[:50]}...")
            except mysql.connector.Error as e:
                if "Duplicate column name" in str(e) or "check that column/key exists" in str(e):
                    print(f"↻ Skipped: Column already exists or doesn't need changes")
                else:
                    print(f"✗ Error: {e}")
                continue
        
        print(f"\n✅ Synchronization completed! Applied {success_count} changes.")
        
        # Verify both table structures
        print("\nVerifying table structures...")
        
        # Check hotel_reservations columns
        cursor.execute("DESCRIBE hotel_reservations")
        reservations_columns = cursor.fetchall()
        
        # Check hotel_registrations columns  
        cursor.execute("DESCRIBE hotel_registrations")
        registrations_columns = cursor.fetchall()
        
        print(f"\nhotel_reservations has {len(reservations_columns)} columns")
        print(f"hotel_registrations has {len(registrations_columns)} columns")
        
        # Show key differences
        res_col_names = [col[0] for col in reservations_columns]
        reg_col_names = [col[0] for col in registrations_columns]
        
        print("\nColumn differences:")
        only_in_reservations = set(res_col_names) - set(reg_col_names)
        only_in_registrations = set(reg_col_names) - set(res_col_names)
        
        if only_in_reservations:
            print(f"Only in reservations: {list(only_in_reservations)}")
        
        if only_in_registrations:
            print(f"Only in registrations: {list(only_in_registrations)}")
            
        if not only_in_reservations and not only_in_registrations:
            print("✓ Tables have similar column structure!")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sync_table_columns()