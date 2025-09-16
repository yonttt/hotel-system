#!/usr/bin/env python3
"""
Database Update Script for Hotel Management System

This script updates the database schema to support all fields
from the registration and reservation forms.

Usage:
    python update_database.py

Requirements:
    - MySQL/MariaDB running
    - Proper database credentials in config
    - hotel_system database should exist
"""

import mysql.connector
import os
import sys
from pathlib import Path

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Update with your MySQL password
    'database': 'hotel_system',
    'charset': 'utf8mb4'
}

def read_sql_file(file_path):
    """Read SQL file and return content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: SQL file not found: {file_path}")
        return None
    except Exception as e:
        print(f"Error reading SQL file: {e}")
        return None

def execute_sql_commands(connection, sql_content):
    """Execute SQL commands from content"""
    cursor = connection.cursor()
    
    # Split SQL content by statements
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]
    
    success_count = 0
    error_count = 0
    
    for statement in statements:
        if statement:
            try:
                cursor.execute(statement)
                connection.commit()
                success_count += 1
                print(f"✓ Executed: {statement[:50]}...")
            except mysql.connector.Error as e:
                error_count += 1
                print(f"✗ Error executing statement: {e}")
                print(f"  Statement: {statement[:100]}...")
                # Continue with next statement
                continue
    
    cursor.close()
    return success_count, error_count

def main():
    """Main function to update database"""
    print("=" * 60)
    print("Hotel Management System - Database Update")
    print("=" * 60)
    
    # Get script directory
    script_dir = Path(__file__).parent
    sql_file = script_dir / 'database_reference' / 'updated_hotel_system.sql'
    
    # Check if SQL file exists
    if not sql_file.exists():
        print(f"Error: SQL file not found at {sql_file}")
        print("Make sure updated_hotel_system.sql is in the database_reference folder")
        sys.exit(1)
    
    # Read SQL file
    print(f"Reading SQL file: {sql_file}")
    sql_content = read_sql_file(sql_file)
    
    if not sql_content:
        print("Failed to read SQL file")
        sys.exit(1)
    
    # Connect to database
    try:
        print(f"Connecting to database: {DB_CONFIG['host']}/{DB_CONFIG['database']}")
        connection = mysql.connector.connect(**DB_CONFIG)
        print("✓ Database connection successful")
        
    except mysql.connector.Error as e:
        print(f"✗ Database connection failed: {e}")
        print("\nPlease check:")
        print("1. MySQL/MariaDB is running")
        print("2. Database credentials are correct")
        print("3. hotel_system database exists")
        sys.exit(1)
    
    # Execute SQL commands
    try:
        print("\nExecuting SQL updates...")
        success_count, error_count = execute_sql_commands(connection, sql_content)
        
        print(f"\nUpdate Summary:")
        print(f"✓ Successful statements: {success_count}")
        print(f"✗ Failed statements: {error_count}")
        
        if error_count == 0:
            print("\n🎉 Database update completed successfully!")
            print("\nUpdated features:")
            print("• Enhanced hotel_reservations table with all form fields")
            print("• New hotel_registrations table for guest registrations")
            print("• Lookup tables for better data management")
            print("• Foreign key relationships for data integrity")
            print("• Indexes for improved performance")
        else:
            print(f"\n⚠️  Database update completed with {error_count} errors")
            print("Please check the error messages above")
            
    except Exception as e:
        print(f"Unexpected error during update: {e}")
        sys.exit(1)
    
    finally:
        # Close connection
        if connection.is_connected():
            connection.close()
            print("Database connection closed")

if __name__ == "__main__":
    main()