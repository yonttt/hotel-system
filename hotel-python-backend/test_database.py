#!/usr/bin/env python3
"""
Database Connection Test for Hotel Management System

This script tests the connection to your MySQL database through phpMyAdmin/XAMPP
"""

import mysql.connector
from mysql.connector import Error
import sys

def test_database_connection():
    """Test connection to MySQL database"""
    
    # Common XAMPP/phpMyAdmin configurations
    configs = [
        {
            'name': 'XAMPP Default (no password)',
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'port': 3306
        },
        {
            'name': 'XAMPP with password',
            'host': 'localhost',
            'user': 'root', 
            'password': 'root',
            'port': 3306
        },
        {
            'name': 'XAMPP Alternative Port',
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'port': 3307
        }
    ]
    
    print("=" * 60)
    print("Hotel Management System - Database Connection Test")
    print("=" * 60)
    
    for config in configs:
        print(f"\nTesting: {config['name']}")
        print(f"Host: {config['host']}:{config['port']}")
        print(f"User: {config['user']}")
        
        try:
            # Test basic connection
            connection = mysql.connector.connect(
                host=config['host'],
                user=config['user'],
                password=config['password'],
                port=config['port']
            )
            
            if connection.is_connected():
                print("✓ Basic MySQL connection: SUCCESS")
                
                # Get MySQL version
                cursor = connection.cursor()
                cursor.execute("SELECT VERSION()")
                version = cursor.fetchone()
                print(f"✓ MySQL Version: {version[0]}")
                
                # Check if hotel_system database exists
                cursor.execute("SHOW DATABASES LIKE 'hotel_system'")
                db_exists = cursor.fetchone()
                
                if db_exists:
                    print("✓ hotel_system database: EXISTS")
                    
                    # Connect to hotel_system database
                    connection.database = 'hotel_system'
                    
                    # Check tables
                    cursor.execute("SHOW TABLES")
                    tables = cursor.fetchall()
                    
                    print(f"✓ Tables found: {len(tables)}")
                    for table in tables:
                        print(f"  - {table[0]}")
                        
                    # Check if our new tables exist
                    expected_tables = [
                        'hotel_reservations',
                        'hotel_registrations', 
                        'category_markets',
                        'payment_methods'
                    ]
                    
                    existing_table_names = [table[0] for table in tables]
                    
                    print("\nTable Status Check:")
                    for expected in expected_tables:
                        if expected in existing_table_names:
                            print(f"✓ {expected}: EXISTS")
                        else:
                            print(f"✗ {expected}: MISSING")
                            
                else:
                    print("✗ hotel_system database: NOT FOUND")
                    print("  Need to create database first")
                
                cursor.close()
                connection.close()
                
                print(f"\n🎉 SUCCESS: Database is working with {config['name']}")
                return True
                
        except Error as e:
            print(f"✗ Connection failed: {e}")
            continue
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
            continue
    
    print("\n❌ FAILED: Could not connect to any MySQL configuration")
    print("\nPossible solutions:")
    print("1. Make sure XAMPP is running")
    print("2. Start MySQL service in XAMPP Control Panel")
    print("3. Check phpMyAdmin at http://localhost/phpmyadmin")
    print("4. Verify MySQL password (if set)")
    return False

def check_xampp_status():
    """Check if XAMPP services might be running"""
    print("\n" + "=" * 60)
    print("XAMPP Status Check")
    print("=" * 60)
    
    try:
        import subprocess
        
        # Check if MySQL process is running
        result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq mysqld.exe'], 
                              capture_output=True, text=True)
        
        if 'mysqld.exe' in result.stdout:
            print("✓ MySQL process is running")
        else:
            print("✗ MySQL process not found")
            print("  Please start MySQL in XAMPP Control Panel")
            
        # Check if Apache is running (for phpMyAdmin)
        result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq httpd.exe'], 
                              capture_output=True, text=True)
        
        if 'httpd.exe' in result.stdout:
            print("✓ Apache process is running")
            print("✓ phpMyAdmin should be available at: http://localhost/phpmyadmin")
        else:
            print("✗ Apache process not found")
            print("  Please start Apache in XAMPP Control Panel")
            
    except Exception as e:
        print(f"Could not check XAMPP status: {e}")

if __name__ == "__main__":
    check_xampp_status()
    test_database_connection()