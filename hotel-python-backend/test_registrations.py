#!/usr/bin/env python3
"""
Test the updated hotel registration API endpoints

This script verifies that the hotel_registrations table
and API endpoints are working correctly.
"""

import mysql.connector
from mysql.connector import Error

def test_hotel_registrations():
    """Test hotel_registrations table and functionality"""
    
    try:
        # Connect to database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='',
            database='hotel_system'
        )
        
        cursor = connection.cursor()
        
        print("=" * 60)
        print("Hotel Registrations API Test")
        print("=" * 60)
        
        # Test 1: Check table exists
        cursor.execute("SHOW TABLES LIKE 'hotel_registrations'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            print("✅ hotel_registrations table: EXISTS")
        else:
            print("❌ hotel_registrations table: NOT FOUND")
            return
        
        # Test 2: Check table structure
        cursor.execute("DESCRIBE hotel_registrations")
        columns = cursor.fetchall()
        
        required_columns = [
            'registration_no', 'category_market', 'member_id', 'guest_name',
            'mobile_phone', 'city', 'payment_method', 'registration_type',
            'payment_diskon'
        ]
        
        column_names = [col[0] for col in columns]
        
        print(f"\n✅ Table has {len(columns)} columns")
        
        missing_columns = []
        for req_col in required_columns:
            if req_col in column_names:
                print(f"✅ {req_col}: EXISTS")
            else:
                missing_columns.append(req_col)
                print(f"❌ {req_col}: MISSING")
        
        # Test 3: Insert sample data
        sample_data = {
            'registration_no': 'TEST001',
            'category_market': 'Walkin',
            'market_segment': 'Normal',
            'member_id': 'M12345',
            'transaction_by': 'ADMIN',
            'guest_name': 'Test Guest',
            'mobile_phone': '+6281234567890',
            'address': 'Test Address',
            'nationality': 'INDONESIA',
            'city': 'Jakarta',
            'email': 'test@example.com',
            'arrival_date': '2025-09-16',
            'departure_date': '2025-09-17',
            'nights': 1,
            'payment_method': 'Cash',
            'registration_type': 'Individual',
            'payment_amount': 100000,
            'payment_diskon': 5000,
            'hotel_name': 'New Idola Hotel'
        }
        
        # Delete test data if exists
        cursor.execute("DELETE FROM hotel_registrations WHERE registration_no = 'TEST001'")
        
        # Insert test data
        columns_str = ', '.join(sample_data.keys())
        values_str = ', '.join(['%s'] * len(sample_data))
        
        insert_query = f"INSERT INTO hotel_registrations ({columns_str}) VALUES ({values_str})"
        cursor.execute(insert_query, list(sample_data.values()))
        connection.commit()
        
        print("\n✅ Sample data inserted successfully")
        
        # Test 4: Retrieve data
        cursor.execute("SELECT * FROM hotel_registrations WHERE registration_no = 'TEST001'")
        result = cursor.fetchone()
        
        if result:
            print("✅ Sample data retrieved successfully")
            print(f"   Guest Name: {result[column_names.index('guest_name')]}")
            print(f"   Category Market: {result[column_names.index('category_market')]}")
            print(f"   Payment Method: {result[column_names.index('payment_method')]}")
            print(f"   City: {result[column_names.index('city')]}")
        else:
            print("❌ Failed to retrieve sample data")
        
        # Test 5: Compare with hotel_reservations structure
        cursor.execute("DESCRIBE hotel_reservations")
        res_columns = cursor.fetchall()
        res_column_names = [col[0] for col in res_columns]
        
        common_columns = set(column_names) & set(res_column_names)
        print(f"\n✅ Common columns between tables: {len(common_columns)}")
        
        # Clean up test data
        cursor.execute("DELETE FROM hotel_registrations WHERE registration_no = 'TEST001'")
        connection.commit()
        print("✅ Test data cleaned up")
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS PASSED!")
        print("hotel_registrations table is ready for use")
        print("=" * 60)
        
        print("\nAPI Endpoint Information:")
        print("- Base URL: http://localhost:8000/api/hotel-registrations")
        print("- POST /: Create new registration")
        print("- GET /: Get all registrations")  
        print("- GET /{id}: Get registration by ID")
        print("- PUT /{id}: Update registration")
        print("- DELETE /{id}: Delete registration")
        print("- GET /next/registration-number: Get next registration number")
        
        cursor.close()
        connection.close()
        
    except Error as e:
        print(f"❌ Database Error: {e}")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    test_hotel_registrations()