"""
Display current login credentials for easy reference
"""
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models import User

def show_login_credentials():
    """Display login credentials"""
    db = SessionLocal()
    try:
        # Get all users
        users = db.query(User).all()
        
        print("\n🏨 HOTEL MANAGEMENT SYSTEM - LOGIN CREDENTIALS")
        print("=" * 50)
        print("Backend API: http://localhost:8000")
        print("Frontend: http://localhost:5174")
        print("=" * 50)
        
        # Simple passwords mapping (these are the current ones)
        simple_passwords = {
            'admin': 'admin123',
            'manager': 'manager123', 
            'staff': 'staff123'
        }
        
        for user in users:
            password = simple_passwords.get(user.username, 'Not set')
            print(f"👤 Role: {user.role.upper()}")
            print(f"   Username: {user.username}")
            print(f"   Password: {password}")
            print(f"   Email: {user.email}")
            print("-" * 30)
        
        print("\n📝 How to Login:")
        print("1. Open http://localhost:5174 in your browser")
        print("2. Use any of the credentials above")
        print("3. Admin has full access to all features")
        print("4. Manager has operational access")
        print("5. Staff has limited access")
        
    except Exception as e:
        print(f"❌ Error reading users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    show_login_credentials()