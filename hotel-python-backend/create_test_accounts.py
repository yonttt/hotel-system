"""
Create test accounts for each role in the hotel system.
Run this script to populate the database with example users.
"""

import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.core.security import get_password_hash
from app.models import User, Base
from datetime import datetime

def create_test_accounts():
    """Create test accounts for all roles."""
    
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    test_accounts = [
        {
            "username": "john",
            "email": "john@hotel.com",
            "password": "admin123",
            "role": "admin"
        },
        {
            "username": "mike",
            "email": "mike@hotel.com",
            "password": "manager123",
            "role": "manager"
        },
        {
            "username": "sarah",
            "email": "sarah@hotel.com",
            "password": "frontoffice123",
            "role": "frontoffice"
        },
        {
            "username": "anna",
            "email": "anna@hotel.com",
            "password": "housekeeping123",
            "role": "housekeeping"
        },
        {
            "username": "david",
            "email": "david@hotel.com",
            "password": "staff123",
            "role": "staff"
        }
    ]
    
    created_count = 0
    skipped_count = 0
    
    try:
        for account in test_accounts:
            # Check if user already exists
            existing_user = db.query(User).filter(User.username == account["username"]).first()
            
            if existing_user:
                print(f"⚠️  User '{account['username']}' already exists - skipped")
                skipped_count += 1
                continue
            
            # Create new user with hashed password
            hashed_password = get_password_hash(account["password"])
            new_user = User(
                username=account["username"],
                email=account["email"],
                password=hashed_password,
                role=account["role"],
                created_at=datetime.utcnow()
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            
            print(f"✅ Created user: {account['username']} (Role: {account['role']})")
            created_count += 1
        
        print(f"\n{'='*60}")
        print(f"Summary:")
        print(f"  - Created: {created_count} accounts")
        print(f"  - Skipped: {skipped_count} accounts (already exist)")
        print(f"{'='*60}")
        
        if created_count > 0:
            print("\n📋 Test Account Credentials:")
            print(f"{'='*60}")
            for account in test_accounts:
                print(f"\nRole: {account['role'].upper()}")
                print(f"  Username: {account['username']}")
                print(f"  Password: {account['password']}")
                print(f"  Email: {account['email']}")
            print(f"\n{'='*60}")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error creating test accounts: {str(e)}")
        return False
        
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("Creating Test Accounts for Hotel Management System")
    print("="*60)
    print()
    
    success = create_test_accounts()
    
    if success:
        print("\n✅ Test accounts setup completed successfully!")
        print("\nYou can now login with any of these accounts to test different role permissions.")
    else:
        print("\n❌ Failed to create test accounts. Please check the error above.")
        sys.exit(1)
