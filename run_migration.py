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
        print("=" * 80)
        print("RUNNING DATABASE MIGRATION")
        print("=" * 80)
        
        # Step 1: Add new columns to users table
        print("\n1. Adding new columns to users table...")
        try:
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN full_name VARCHAR(100) AFTER email,
                ADD COLUMN title VARCHAR(100) AFTER full_name,
                ADD COLUMN hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA' AFTER title,
                ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE AFTER hotel_name,
                ADD COLUMN last_login TIMESTAMP NULL AFTER is_blocked,
                ADD COLUMN account_type ENUM('Management', 'Non Management') AFTER last_login
            """)
            connection.commit()
            print("   ✓ Columns added successfully!")
        except pymysql.err.OperationalError as e:
            if "Duplicate column name" in str(e):
                print("   ! Columns already exist, skipping...")
            else:
                raise
        
        # Step 2: Create user_permissions table
        print("\n2. Creating user_permissions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_permissions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                role ENUM('admin','manager','staff','frontoffice','housekeeping') NOT NULL,
                can_view BOOLEAN DEFAULT TRUE,
                can_create BOOLEAN DEFAULT FALSE,
                can_edit BOOLEAN DEFAULT FALSE,
                can_delete BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_role (role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        """)
        connection.commit()
        print("   ✓ user_permissions table created!")
        
        # Step 3: Update existing users with default values
        print("\n3. Updating existing users with default values...")
        cursor.execute("""
            UPDATE users SET 
                full_name = UPPER(username),
                title = CASE 
                    WHEN role = 'admin' THEN 'Admin Hotel'
                    WHEN role = 'manager' THEN 'Finance Hotel'
                    WHEN role = 'frontoffice' THEN 'Operational Front Office'
                    WHEN role = 'housekeeping' THEN 'Leader Housekeeping'
                    WHEN role = 'staff' THEN 'Staff'
                    ELSE role
                END,
                hotel_name = 'HOTEL NEW IDOLA',
                is_blocked = FALSE,
                account_type = CASE 
                    WHEN role IN ('admin', 'manager') THEN 'Management'
                    ELSE 'Non Management'
                END
            WHERE full_name IS NULL
        """)
        connection.commit()
        print(f"   ✓ Updated {cursor.rowcount} users!")
        
        # Step 4: Insert default permissions for all roles
        print("\n4. Inserting default permissions for all roles...")
        cursor.execute("""
            INSERT INTO user_permissions (role, can_view, can_create, can_edit, can_delete) VALUES
            ('admin', TRUE, TRUE, TRUE, TRUE),
            ('manager', TRUE, TRUE, TRUE, FALSE),
            ('frontoffice', TRUE, FALSE, FALSE, FALSE),
            ('housekeeping', TRUE, FALSE, FALSE, FALSE),
            ('staff', TRUE, FALSE, FALSE, FALSE)
            ON DUPLICATE KEY UPDATE 
                can_view = VALUES(can_view),
                can_create = VALUES(can_create),
                can_edit = VALUES(can_edit),
                can_delete = VALUES(can_delete)
        """)
        connection.commit()
        print("   ✓ Permissions inserted/updated!")
        
        # Verification
        print("\n" + "=" * 80)
        print("VERIFICATION")
        print("=" * 80)
        
        print("\nUsers table (first 5):")
        cursor.execute("SELECT id, username, full_name, title, hotel_name, is_blocked, account_type, role FROM users LIMIT 5")
        users = cursor.fetchall()
        for user in users:
            print(f"  ID: {user['id']}, Username: {user['username']}, Name: {user['full_name']}, "
                  f"Title: {user['title']}, Role: {user['role']}, Type: {user['account_type']}")
        
        print("\nUser permissions:")
        cursor.execute("SELECT * FROM user_permissions ORDER BY role")
        permissions = cursor.fetchall()
        for perm in permissions:
            print(f"  Role: {perm['role']:15} | View: {perm['can_view']} | Create: {perm['can_create']} | "
                  f"Edit: {perm['can_edit']} | Delete: {perm['can_delete']}")
        
        print("\n" + "=" * 80)
        print("MIGRATION COMPLETED SUCCESSFULLY!")
        print("=" * 80)

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    connection.rollback()
    raise
finally:
    connection.close()
