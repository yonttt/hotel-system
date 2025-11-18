# Test Accounts Documentation

This document contains information about test accounts for the Hotel Management System.

## Quick Setup

To create all test accounts in the database, run:

```bash
cd hotel-python-backend
python create_test_accounts.py
```

## Test Account Credentials

### 1. Admin Account
**Full system access - can manage everything**

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@hotel.com`
- **Role:** `admin`

**Permissions:**
- ✅ View all data
- ✅ Create new entries
- ✅ Edit all data
- ✅ Delete data
- ✅ Manage users (create, edit, delete)
- ✅ Manage user authorities/permissions
- ✅ Access all HRD functions
- ✅ Access all operational functions
- ✅ View all reports

---

### 2. Manager Account
**Supervisory access - can view and manage operations**

- **Username:** `manager`
- **Password:** `manager123`
- **Email:** `manager@hotel.com`
- **Role:** `manager`

**Permissions:**
- ✅ View all data
- ✅ Create new entries
- ✅ Edit operational data
- ✅ Manage user authorities/permissions (but cannot add/delete users)
- ✅ Access most HRD functions (except user creation/deletion)
- ✅ Access all operational functions
- ✅ View reports
- ❌ Cannot delete users

---

### 3. Front Office Account
**Front desk operations**

- **Username:** `frontoffice`
- **Password:** `frontoffice123`
- **Email:** `frontoffice@hotel.com`
- **Role:** `frontoffice`

**Permissions (Default - configurable by Admin/Manager):**
- ✅ View guest data
- ✅ Create reservations and registrations
- ✅ Edit reservations and registrations
- ✅ Check-in/Check-out guests
- ✅ View room status
- ✅ Process payments
- ❌ Delete reservations (configurable)
- ❌ Access HRD functions
- ❌ Manage users

---

### 4. Housekeeping Account
**Room and housekeeping management**

- **Username:** `housekeeping`
- **Password:** `housekeeping123`
- **Email:** `housekeeping@hotel.com`
- **Role:** `housekeeping`

**Permissions (Default - configurable by Admin/Manager):**
- ✅ View room status
- ✅ Update room cleanliness status
- ✅ Create maintenance requests
- ✅ Edit room status
- ✅ View master data (room types, rooms)
- ❌ Delete rooms (configurable)
- ❌ Access front office transactions
- ❌ Access HRD functions
- ❌ Manage users

---

### 5. Staff Account
**Basic read-only access**

- **Username:** `staff`
- **Password:** `staff123`
- **Email:** `staff@hotel.com`
- **Role:** `staff`

**Permissions (Default - configurable by Admin/Manager):**
- ✅ View data only (read-only access)
- ❌ Cannot create new entries
- ❌ Cannot edit data
- ❌ Cannot delete data
- ❌ Limited access to system functions
- ❌ Cannot access HRD functions
- ❌ Cannot manage users

---

## Permission Management

Admin and Manager users can customize permissions for each role through the **User Authority** page:

**Configurable Permissions:**
- **Lihat Data (View Data):** Can view/read data
- **Buat Data Baru (Create Data):** Can create new entries
- **Edit Data (Edit Data):** Can modify existing data
- **Hapus Data (Delete Data):** Can delete data

**To Access Permission Management:**
1. Login as `admin` or `manager`
2. Navigate to: **HRD → User Management → Otoritas Pengguna**
3. Toggle permissions for each role (Front Office, Housekeeping, Staff)
4. Click **Save Changes**

---

## Creating New Users

### Via Web Interface (Recommended)
1. Login as `admin`
2. Navigate to: **HRD → User Management → User List**
3. Click **+ Add User**
4. Fill in the form:
   - Username (required)
   - Email (optional)
   - Password (required)
   - Role (required): Select from admin, manager, frontoffice, housekeeping, staff
5. Click **Add User**

### Via API
```bash
# Login first to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"

# Create new user (use token from login response)
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "username": "newuser",
    "email": "newuser@hotel.com",
    "password": "password123",
    "role": "frontoffice"
  }'
```

---

## Testing Role-Based Access

### Test Scenarios

#### 1. Test Admin Access
- Login as `admin` / `admin123`
- ✅ Should see all menu items (Operational, HRD)
- ✅ Should access User List and create/delete users
- ✅ Should access User Authority and modify permissions

#### 2. Test Manager Access
- Login as `manager` / `manager123`
- ✅ Should see all menu items
- ✅ Should access User Authority and modify permissions
- ❌ Should NOT see User List page (admin only)

#### 3. Test Front Office Access
- Login as `frontoffice` / `frontoffice123`
- ✅ Should see Operational menu
- ✅ Should access reservations, registrations, guest info
- ❌ Should NOT see HRD menu
- ❌ Should NOT access user management

#### 4. Test Housekeeping Access
- Login as `housekeeping` / `housekeeping123`
- ✅ Should see Operational → Housekeeping menu
- ✅ Should access room status and master data
- ❌ Should NOT see Front Office menu
- ❌ Should NOT see HRD menu

#### 5. Test Staff Access
- Login as `staff` / `staff123`
- ✅ Should have limited view-only access
- ❌ Should NOT see action buttons (edit, delete, create)
- ❌ Should NOT see HRD menu

---

## Security Notes

⚠️ **IMPORTANT FOR PRODUCTION:**

1. **Change Default Passwords:** All test accounts use simple passwords. Change them immediately in production!

2. **Delete Test Accounts:** Remove or disable test accounts before going live.

3. **Use Strong Passwords:** Enforce strong password policies:
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Regular password changes

4. **Audit Logs:** Monitor user activities, especially admin actions.

5. **Backup Strategy:** Regular backups of user database.

---

## Troubleshooting

### Cannot Login
- Verify database connection in `hotel-python-backend/app/core/config.py`
- Check if backend server is running: `python run.py`
- Ensure test accounts were created: Run `create_test_accounts.py`

### User Already Exists Error
- The user is already in database
- Try different username or delete existing user first

### Permission Denied
- Check user role matches expected permissions
- Verify permissions in User Authority page
- Logout and login again to refresh session

---

## Database Table

Users are stored in the `users` table:

| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Auto-increment user ID |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | User email (nullable) |
| password | VARCHAR(255) | Bcrypt hashed password |
| role | ENUM | 'admin', 'manager', 'frontoffice', 'housekeeping', 'staff' |
| created_at | TIMESTAMP | Account creation date |

---

## Additional Resources

- **Backend API Docs:** http://localhost:8000/docs (when server is running)
- **Main README:** See `README.md` in project root
- **Database Setup:** See `hotel-python-backend/DATABASE_UPDATE_GUIDE.md`

---

**Last Updated:** November 18, 2025
