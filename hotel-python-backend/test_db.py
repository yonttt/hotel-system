"""
Simple test to check if we can connect to database and check users
"""
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User

def test_database():
    """Test database connection and user existence"""
    db = SessionLocal()
    try:
        # Test database connection
        users = db.query(User).all()
        print(f"Found {len(users)} users in database:")
        for user in users:
            print(f"  - {user.username} ({user.role})")
        
        # Test admin user specifically
        admin = db.query(User).filter(User.username == "admin").first()
        if admin:
            print(f"\nAdmin user found:")
            print(f"  Username: {admin.username}")
            print(f"  Email: {admin.email}")
            print(f"  Role: {admin.role}")
            print(f"  Password hash: {admin.password[:20]}...")
        else:
            print("❌ Admin user not found!")
            
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_database()