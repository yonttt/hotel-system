"""
Database initialization script
Creates default admin user for the hotel management system
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models import User, Base

def init_database():
    """Initialize database with default admin user"""
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    
    # Create session
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin").first()
        
        if not admin_user:
            # Create default admin user
            hashed_password = get_password_hash("admin123")
            admin_user = User(
                username="admin",
                email="admin@hotelmanagement.com",
                password=hashed_password,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("✅ Default admin user created:")
            print("   Username: admin")
            print("   Password: admin123")
            print("   Email: admin@hotelmanagement.com")
        else:
            print("ℹ️  Admin user already exists")
            
        # Create a manager user for testing
        manager_user = db.query(User).filter(User.username == "manager").first()
        if not manager_user:
            hashed_password = get_password_hash("manager123")
            manager_user = User(
                username="manager",
                email="manager@hotelmanagement.com",
                password=hashed_password,
                role="manager"
            )
            db.add(manager_user)
            db.commit()
            print("✅ Default manager user created:")
            print("   Username: manager")
            print("   Password: manager123")
            print("   Email: manager@hotelmanagement.com")
        else:
            print("ℹ️  Manager user already exists")
            
        # Create a staff user for testing
        staff_user = db.query(User).filter(User.username == "staff").first()
        if not staff_user:
            hashed_password = get_password_hash("staff123")
            staff_user = User(
                username="staff",
                email="staff@hotelmanagement.com",
                password=hashed_password,
                role="staff"
            )
            db.add(staff_user)
            db.commit()
            print("✅ Default staff user created:")
            print("   Username: staff")
            print("   Password: staff123")
            print("   Email: staff@hotelmanagement.com")
        else:
            print("ℹ️  Staff user already exists")
            
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing Hotel Management Database...")
    print("=" * 50)
    init_database()
    print("=" * 50)
    print("✅ Database initialization complete!")
    print()
    print("You can now login with:")
    print("• Admin: admin / admin123")
    print("• Manager: manager / manager123") 
    print("• Staff: staff / staff123")