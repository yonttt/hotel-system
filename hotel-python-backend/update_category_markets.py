"""
Script to update category_markets table with specific data.
This script will:
1. Remove all existing category markets
2. Insert only the specified category markets
"""

import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def update_category_markets():
    """Update category markets table with the specified data."""
    
    # New category markets data
    category_markets_data = [
        'Walkin',
        'Online Travel Agent (OTA)',
        'Corporate Rate',
        'Government Rate',
        'Group',
        'Travel Agent',
        'Social Media',
        'WAWCARD',
        'SMS Blast'
    ]
    
    connection = None
    cursor = None
    
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'system'),
            password=os.getenv('DB_PASSWORD', 'yont29921'),
            database=os.getenv('DB_NAME', 'hotel_system')
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            print("✅ Connected to MySQL database")
            
            # Start transaction
            connection.start_transaction()
            
            # First, check if there are any existing records
            cursor.execute("SELECT COUNT(*) FROM category_markets")
            existing_count = cursor.fetchone()[0]
            print(f"📊 Current category markets count: {existing_count}")
            
            # Delete all existing category markets
            cursor.execute("DELETE FROM category_markets")
            print(f"🗑️  Deleted {cursor.rowcount} existing category markets")
            
            # Reset auto increment
            cursor.execute("ALTER TABLE category_markets AUTO_INCREMENT = 1")
            
            # Insert new category markets
            insert_count = 0
            for name in category_markets_data:
                cursor.execute(
                    "INSERT INTO category_markets (name, active) VALUES (%s, TRUE)",
                    (name,)
                )
                insert_count += 1
            
            # Commit the transaction
            connection.commit()
            print(f"✅ Successfully inserted {insert_count} new category markets")
            
            # Display the new data
            cursor.execute("SELECT id, name, active FROM category_markets ORDER BY id")
            print("\n📋 New Category Markets:")
            print("-" * 80)
            for row in cursor.fetchall():
                status = "✓ Active" if row[2] else "✗ Inactive"
                print(f"ID: {row[0]:<3} | Name: {row[1]:<35} | Status: {status}")
            print("-" * 80)
            
    except Error as e:
        if connection:
            connection.rollback()
        print(f"❌ Error: {e}")
        raise
    
    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("\n✅ MySQL connection closed")

if __name__ == "__main__":
    print("=" * 80)
    print("UPDATE CATEGORY MARKETS")
    print("=" * 80)
    print("\nThis script will update the category_markets table with the following data:")
    print("1. Walkin")
    print("2. Online Travel Agent (OTA)")
    print("3. Corporate Rate")
    print("4. Government Rate")
    print("5. Group")
    print("6. Travel Agent")
    print("7. Social Media")
    print("8. WAWCARD")
    print("9. SMS Blast")
    print("\nAll other category markets will be removed.")
    print("=" * 80)
    
    response = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    
    if response in ['yes', 'y']:
        print("\n🚀 Starting update process...\n")
        try:
            update_category_markets()
            print("\n✅ Category markets update completed successfully!")
        except Exception as e:
            print(f"\n❌ Update failed: {e}")
    else:
        print("\n❌ Update cancelled by user")
