"""
Create default admin user for the hotel management system
"""
import sys
import os

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal
from app.core.security import get_password_hash
from app.models import User, Base

def create_default_users():
    """Create default users if they don't exist"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin user exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            # Create admin user
            hashed_password = get_password_hash("admin123")
            admin_user = User(
                username="admin",
                email="admin@evagroup.com",
                role="admin",
                password=hashed_password
            )
            db.add(admin_user)
            print("✅ Created admin user: admin/admin123")
        else:
            print("ℹ️ Admin user already exists")
        
        # Check if manager user exists
        manager_user = db.query(User).filter(User.username == "manager").first()
        if not manager_user:
            # Create manager user
            hashed_password = get_password_hash("manager123")
            manager_user = User(
                username="manager",
                email="manager@evagroup.com",
                role="manager",
                password=hashed_password
            )
            db.add(manager_user)
            print("✅ Created manager user: manager/manager123")
        else:
            print("ℹ️ Manager user already exists")
        
        # Check if staff user exists
        staff_user = db.query(User).filter(User.username == "staff").first()
        if not staff_user:
            # Create staff user
            hashed_password = get_password_hash("staff123")
            staff_user = User(
                username="staff",
                email="staff@evagroup.com",
                role="staff",
                password=hashed_password
            )
            db.add(staff_user)
            print("✅ Created staff user: staff/staff123")
        else:
            print("ℹ️ Staff user already exists")
        
        db.commit()
        print("\n🎉 Default users setup complete!")
        print("You can now login with:")
        print("  Admin: admin/admin123")
        print("  Manager: manager/manager123")
        print("  Staff: staff/staff123")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_default_users()