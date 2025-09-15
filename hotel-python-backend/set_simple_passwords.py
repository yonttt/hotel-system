"""
Set simple passwords for easier development testing
"""
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models import User

def set_simple_passwords():
    """Set simple passwords for all users"""
    db = SessionLocal()
    try:
        # Define simple passwords for each user
        simple_passwords = {
            'admin': 'admin123',
            'manager': 'manager123', 
            'staff': 'staff123'
        }
        
        # Get all users
        users = db.query(User).all()
        
        for user in users:
            if user.username in simple_passwords:
                new_password = simple_passwords[user.username]
                print(f"Setting simple password for user: {user.username}")
                
                # Hash the new simple password
                hashed_password = get_password_hash(new_password)
                user.password = hashed_password
                
                print(f"  Password set to: {new_password}")
            else:
                print(f"No simple password defined for user: {user.username}")
        
        # Commit changes
        db.commit()
        print("\n✅ All passwords updated successfully!")
        
        # Print login credentials for reference
        print("\n📋 Login Credentials:")
        print("=" * 30)
        for username, password in simple_passwords.items():
            print(f"Username: {username}")
            print(f"Password: {password}")
            print("-" * 20)
        
    except Exception as e:
        print(f"❌ Error updating passwords: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    set_simple_passwords()