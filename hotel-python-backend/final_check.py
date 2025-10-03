"""
Comprehensive final check for registration and reservation types removal
"""

import mysql.connector
import os
import glob

def check_database():
    """Check database for any remaining traces."""
    print("=" * 80)
    print("DATABASE VERIFICATION")
    print("=" * 80)
    
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='system',
            password='yont29921',
            database='hotel_system'
        )
        
        cursor = connection.cursor()
        
        # Check tables
        cursor.execute("SHOW TABLES")
        tables = [row[0] for row in cursor.fetchall()]
        
        issues = []
        
        if 'registration_types' in tables:
            issues.append("❌ registration_types table still exists")
        if 'reservation_types' in tables:
            issues.append("❌ reservation_types table still exists")
        
        # Check columns
        for table in ['hotel_reservations', 'hotel_registrations', 'guest_registrations']:
            cursor.execute(f"SHOW COLUMNS FROM {table}")
            columns = [row[0] for row in cursor.fetchall()]
            
            if 'registration_type' in columns:
                issues.append(f"❌ {table} still has registration_type column")
            if 'registration_type_id' in columns:
                issues.append(f"❌ {table} still has registration_type_id column")
            if 'reservation_type' in columns:
                issues.append(f"❌ {table} still has reservation_type column")
        
        # Check foreign keys
        cursor.execute("""
            SELECT TABLE_NAME, CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = 'hotel_system' 
            AND REFERENCED_TABLE_NAME IN ('registration_types', 'reservation_types')
        """)
        
        fks = cursor.fetchall()
        if fks:
            for table, constraint in fks:
                issues.append(f"❌ Foreign key {constraint} still exists in {table}")
        
        cursor.close()
        connection.close()
        
        if issues:
            print("\n".join(issues))
            return False
        else:
            print("✅ Database is clean - no traces of registration/reservation types")
            return True
            
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False

def check_code_files():
    """Check code files for any remaining references."""
    print("\n" + "=" * 80)
    print("CODE FILES VERIFICATION")
    print("=" * 80)
    
    search_terms = [
        'registration_type',
        'reservation_type',
        'registrationType',
        'reservationType',
        'RegistrationType',
        'registration_types',
        'reservation_types'
    ]
    
    # Directories to check
    dirs_to_check = [
        r'c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-python-backend\app',
        r'c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src'
    ]
    
    issues = []
    
    for directory in dirs_to_check:
        # Check Python files
        for py_file in glob.glob(os.path.join(directory, '**', '*.py'), recursive=True):
            # Skip our utility scripts
            if any(script in py_file for script in [
                'check_registration_types.py',
                'remove_registration_types.py',
                'verify_removal.py',
                'fix_frontend_files.py',
                'update_frontend_files.py',
                'check_fk.py',
                'final_check.py'
            ]):
                continue
            
            with open(py_file, 'r', encoding='utf-8') as f:
                content = f.read()
                for term in search_terms:
                    if term in content:
                        issues.append(f"❌ Found '{term}' in {py_file}")
        
        # Check JSX files
        for jsx_file in glob.glob(os.path.join(directory, '**', '*.jsx'), recursive=True):
            with open(jsx_file, 'r', encoding='utf-8') as f:
                content = f.read()
                for term in search_terms:
                    if term in content:
                        issues.append(f"❌ Found '{term}' in {jsx_file}")
    
    if issues:
        print("\n".join(issues))
        return False
    else:
        print("✅ Code files are clean - no references to registration/reservation types")
        return True

if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("FINAL COMPREHENSIVE VERIFICATION")
    print("Registration and Reservation Types Removal")
    print("=" * 80 + "\n")
    
    db_clean = check_database()
    code_clean = check_code_files()
    
    print("\n" + "=" * 80)
    print("FINAL RESULTS")
    print("=" * 80)
    
    if db_clean and code_clean:
        print("\n✅✅✅ ALL CHECKS PASSED ✅✅✅")
        print("\nRegistration and reservation types have been completely removed from:")
        print("  ✅ Database (tables, columns, foreign keys)")
        print("  ✅ Backend Python code (models, schemas)")
        print("  ✅ Frontend React code (components, forms)")
        print("\nThe system is clean and ready to use!")
    else:
        print("\n❌ SOME ISSUES FOUND")
        print("Please review the issues above and fix them.")
    
    print("\n" + "=" * 80)
