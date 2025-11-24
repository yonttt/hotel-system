import pymysql
from datetime import datetime

# Database connection
connection = pymysql.connect(
    host='localhost',
    user='system',
    password='yont29921',
    database='hotel_system',
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with connection.cursor() as cursor:
        # Check users table structure
        cursor.execute("DESCRIBE users")
        print("=" * 80)
        print("USERS TABLE STRUCTURE:")
        print("=" * 80)
        columns = cursor.fetchall()
        for col in columns:
            print(f"{col['Field']:20} {col['Type']:30} {col['Null']:10} {col['Key']:10} {col['Default']}")
        
        print("\n" + "=" * 80)
        print("ALL USERS IN DATABASE:")
        print("=" * 80)
        
        # Get all users
        cursor.execute("SELECT * FROM users ORDER BY id")
        users = cursor.fetchall()
        
        if users:
            for user in users:
                print(f"\nID: {user['id']}")
                print(f"Username: {user['username']}")
                print(f"Email: {user['email']}")
                print(f"Role: {user['role']}")
                print(f"Created: {user['created_at']}")
                print(f"Updated: {user['updated_at']}")
                print("-" * 80)
            
            print(f"\nTotal Users: {len(users)}")
        else:
            print("No users found in database!")
        
        # Get unique roles
        cursor.execute("SELECT DISTINCT role FROM users ORDER BY role")
        roles = cursor.fetchall()
        print("\n" + "=" * 80)
        print("UNIQUE ROLES IN DATABASE:")
        print("=" * 80)
        for role in roles:
            cursor.execute("SELECT COUNT(*) as count FROM users WHERE role = %s", (role['role'],))
            count = cursor.fetchone()
            print(f"{role['role']:20} - {count['count']} user(s)")

finally:
    connection.close()
