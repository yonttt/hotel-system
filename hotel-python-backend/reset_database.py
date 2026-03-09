"""
Database Reset Script
Clears all data from the hotel_system database while preserving table structures.
Re-creates a default admin user so you can log in and start fresh.
"""

import sys
import os

# Add the parent directory to path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal
from app.core.security import get_password_hash
from app.models import Base, User, UserPermission
from sqlalchemy import text
from datetime import datetime


def reset_database():
    print("=" * 60)
    print("  HOTEL SYSTEM - DATABASE RESET")
    print("=" * 60)
    print()
    print("WARNING: This will DELETE ALL DATA from the database!")
    print("Table structures will be preserved.")
    print("A fresh admin user will be created.")
    print()
    
    confirm = input("Type 'YES' to confirm: ")
    if confirm != 'YES':
        print("Cancelled.")
        return
    
    print()
    print("Resetting database...")
    
    db = SessionLocal()
    
    try:
        # Disable foreign key checks to allow truncation
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        # Get all table names from the database
        result = db.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result]
        
        print(f"Found {len(tables)} tables to clear.")
        
        # Truncate all tables
        for table in tables:
            try:
                db.execute(text(f"TRUNCATE TABLE `{table}`"))
                print(f"  Cleared: {table}")
            except Exception as e:
                print(f"  Warning: Could not truncate {table}: {e}")
                # If truncate fails, try DELETE
                try:
                    db.execute(text(f"DELETE FROM `{table}`"))
                    db.execute(text(f"ALTER TABLE `{table}` AUTO_INCREMENT = 1"))
                    print(f"  Cleared (DELETE): {table}")
                except Exception as e2:
                    print(f"  ERROR: Could not clear {table}: {e2}")
        
        # Re-enable foreign key checks
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        
        db.commit()
        print()
        print("All tables cleared successfully!")
        
        # Create default admin user
        print()
        print("Creating default admin user...")
        
        admin_user = User(
            username="admin",
            password=get_password_hash("admin123"),
            email="admin@hotel.com",
            full_name="System Administrator",
            title="Admin Hotel",
            hotel_name=None,
            is_blocked=False,
            account_type="Management",
            role="admin",
            last_login=None
        )
        db.add(admin_user)
        db.commit()
        
        print("  Admin user created successfully!")
        print()
        
        # Create default user permissions
        print("Creating default user permissions...")
        
        permissions = [
            UserPermission(role="admin", can_view=True, can_create=True, can_edit=True, can_delete=True),
            UserPermission(role="manager", can_view=True, can_create=True, can_edit=True, can_delete=True),
            UserPermission(role="frontoffice", can_view=True, can_create=True, can_edit=True, can_delete=False),
            UserPermission(role="housekeeping", can_view=True, can_create=False, can_edit=True, can_delete=False),
            UserPermission(role="staff", can_view=True, can_create=False, can_edit=False, can_delete=False),
        ]
        
        for perm in permissions:
            db.add(perm)
        
        db.commit()
        print("  User permissions created successfully!")
        
        print()
        print("=" * 60)
        print("  DATABASE RESET COMPLETE!")
        print("=" * 60)
        print()
        print("  Login credentials:")
        print("  Username: admin")
        print("  Password: admin123")
        print()
        print("  You can now start adding data from the beginning.")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print(f"ERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    reset_database()
