"""
Quick setup script for role-based access control
This script will update the database schema and create the test users
"""
import pymysql
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database connection settings
DB_CONFIG = {
    'host': 'localhost',
    'user': 'system',
    'password': 'yont29921',
    'database': 'hotel_system',
    'charset': 'utf8mb4'
}

def setup_rbac():
    """Setup role-based access control"""
    
    connection = None
    cursor = None
    
    try:
        # Connect to database
        print("Connecting to database...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print("\n1. Updating users table schema...")
        # Update the role enum to include new roles
        cursor.execute("""
            ALTER TABLE users 
            MODIFY COLUMN role ENUM('admin', 'manager', 'staff', 'frontoffice', 'housekeeping') 
            DEFAULT 'staff'
        """)
        print("   ✓ Schema updated successfully")
        
        print("\n2. Creating user accounts...")
        
        # Hash passwords
        frontoffice_password = pwd_context.hash("frontoffice123")
        housekeeping_password = pwd_context.hash("housekeeping123")
        
        # Create Front Office user
        cursor.execute("""
            INSERT INTO users (username, password, email, role, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
            ON DUPLICATE KEY UPDATE role = %s, password = %s, updated_at = NOW()
        """, ('frontoffice', frontoffice_password, 'frontoffice@hotel.com', 'frontoffice', 'frontoffice', frontoffice_password))
        
        # Create Housekeeping user
        cursor.execute("""
            INSERT INTO users (username, password, email, role, created_at, updated_at)
            VALUES (%s, %s, %s, %s, NOW(), NOW())
            ON DUPLICATE KEY UPDATE role = %s, password = %s, updated_at = NOW()
        """, ('housekeeping', housekeeping_password, 'housekeeping@hotel.com', 'housekeeping', 'housekeeping', housekeeping_password))
        
        connection.commit()
        print("   ✓ User accounts created successfully")
        
        print("\n3. Verifying setup...")
        cursor.execute("""
            SELECT id, username, email, role, created_at 
            FROM users 
            WHERE role IN ('frontoffice', 'housekeeping')
        """)
        
        users = cursor.fetchall()
        print("\n   Created users:")
        for user in users:
            print(f"   - ID: {user[0]}, Username: {user[1]}, Email: {user[2]}, Role: {user[3]}")
        
        print("\n" + "="*60)
        print("✅ RBAC Setup Complete!")
        print("="*60)
        print("\nTest Accounts Created:")
        print("\n1. Front Office Account:")
        print("   Username: frontoffice")
        print("   Password: frontoffice123")
        print("   Access: Front Office menus only")
        print("\n2. Housekeeping Account:")
        print("   Username: housekeeping")
        print("   Password: housekeeping123")
        print("   Access: Housekeeping menus only")
        print("\n" + "="*60)
        print("You can now login with these accounts to test role-based access!")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if connection:
            connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

if __name__ == "__main__":
    print("="*60)
    print("Role-Based Access Control Setup")
    print("="*60)
    setup_rbac()
