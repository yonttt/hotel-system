"""
Create Front Office and Housekeeping user accounts
Run this script to create sample users for testing role-based access control
"""
import sys
import os
from passlib.context import CryptContext
from sqlalchemy import text

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_role_users():
    """Create frontoffice and housekeeping users"""
    
    # Get database session
    db = next(get_db())
    
    try:
        # Hash passwords
        frontoffice_password = pwd_context.hash("frontoffice123")
        housekeeping_password = pwd_context.hash("housekeeping123")
        
        # Create Front Office user
        db.execute(text("""
            INSERT INTO users (username, password, email, role, created_at, updated_at)
            VALUES (:username, :password, :email, :role, NOW(), NOW())
            ON DUPLICATE KEY UPDATE role = :role, password = :password
        """), {
            "username": "frontoffice",
            "password": frontoffice_password,
            "email": "frontoffice@hotel.com",
            "role": "frontoffice"
        })
        
        # Create Housekeeping user
        db.execute(text("""
            INSERT INTO users (username, password, email, role, created_at, updated_at)
            VALUES (:username, :password, :email, :role, NOW(), NOW())
            ON DUPLICATE KEY UPDATE role = :role, password = :password
        """), {
            "username": "housekeeping",
            "password": housekeeping_password,
            "email": "housekeeping@hotel.com",
            "role": "housekeeping"
        })
        
        db.commit()
        
        print("✅ User accounts created successfully!")
        print("\nFront Office Account:")
        print("  Username: frontoffice")
        print("  Password: frontoffice123")
        print("  Role: frontoffice")
        print("\nHousekeeping Account:")
        print("  Username: housekeeping")
        print("  Password: housekeeping123")
        print("  Role: housekeeping")
        
        # Verify
        result = db.execute(text("""
            SELECT id, username, email, role, created_at 
            FROM users 
            WHERE role IN ('frontoffice', 'housekeeping')
        """))
        
        print("\n✓ Verified users in database:")
        for row in result:
            print(f"  - {row.username} ({row.role}) - {row.email}")
            
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating users: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating Front Office and Housekeeping user accounts...")
    print("=" * 60)
    create_role_users()
