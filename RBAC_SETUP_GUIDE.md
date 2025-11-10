# Role-Based Access Control (RBAC) Setup Guide

## Overview
This system now supports role-based access control with the following roles:
- **admin**: Full system access
- **manager**: Full system access
- **staff**: Full system access (default)
- **frontoffice**: Access only to Front Office menu
- **housekeeping**: Access only to Housekeeping menu

## Setup Instructions

### Step 1: Update Database Schema

First, update the users table to support the new roles:

```sql
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'staff', 'frontoffice', 'housekeeping') DEFAULT 'staff';
```

Or run the SQL migration file:
```bash
mysql -u root -p eva_group_hotel < hotel-python-backend/database_reference/add_frontoffice_housekeeping_roles.sql
```

### Step 2: Create User Accounts

#### Option A: Using Python Script (Recommended)
Run the Python script to create users with properly hashed passwords:

```bash
cd hotel-python-backend
python create_role_users.py
```

#### Option B: Manual SQL (if you have your own passwords)
Replace the password hashes with your own:

```sql
INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('frontoffice', 'YOUR_HASHED_PASSWORD', 'frontoffice@hotel.com', 'frontoffice', NOW(), NOW());

INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('housekeeping', 'YOUR_HASHED_PASSWORD', 'housekeeping@hotel.com', 'housekeeping', NOW(), NOW());
```

## Default Test Accounts

After running the setup script, you'll have these accounts:

### Front Office Account
- **Username**: `frontoffice`
- **Password**: `frontoffice123`
- **Access**: Only sees Front Office menu (Registrasi, Reservasi, Group Booking, Info Reservasi, Informasi Tamu, Status Kamar FO)

### Housekeeping Account
- **Username**: `housekeeping`
- **Password**: `housekeeping123`
- **Access**: Only sees Housekeeping menu (Status Kamar HP, Master Data)

## How It Works

### Frontend (Sidebar.jsx)
The sidebar now filters menu items based on user role:

```javascript
// Front Office users only see:
- HOME
- OPERATIONAL > Front Office (with all submenus)

// Housekeeping users only see:
- HOME
- OPERATIONAL > Housekeeping (with all submenus)

// Admin/Manager/Staff see everything
```

### Backend (schemas & models)
- Updated `UserRole` enum in schemas to include `frontoffice` and `housekeeping`
- Updated `User` model to support the new roles in database

## Testing the Setup

1. **Start the backend server:**
   ```bash
   cd hotel-python-backend
   python run.py
   ```

2. **Start the frontend:**
   ```bash
   cd hotel-react-frontend
   npm run dev
   ```

3. **Test Front Office Login:**
   - Go to http://localhost:5173/login
   - Login with: `frontoffice` / `frontoffice123`
   - Verify you only see HOME and Front Office menu

4. **Test Housekeeping Login:**
   - Logout
   - Login with: `housekeeping` / `housekeeping123`
   - Verify you only see HOME and Housekeeping menu

## Security Notes

⚠️ **Important**: Change the default passwords in production!

The test passwords provided are for development only. For production:
1. Use strong, unique passwords
2. Enable password complexity requirements
3. Implement password expiration policies
4. Enable two-factor authentication (if needed)

## Troubleshooting

### Issue: "Role mismatch" error on login
**Solution**: Clear browser localStorage and login again:
```javascript
localStorage.clear()
```

### Issue: Users can't see any menu
**Solution**: Check that:
1. User role in database matches one of the supported roles
2. Database migration was applied successfully
3. Frontend is using the latest code with role filtering

### Issue: SQL migration fails
**Solution**: 
- Check if users table already has the roles
- Drop and recreate the enum:
```sql
ALTER TABLE users MODIFY COLUMN role VARCHAR(50);
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'staff', 'frontoffice', 'housekeeping') DEFAULT 'staff';
```

## Customization

To add more roles or modify access:

1. **Add new role to backend:**
   - Update `app/schemas/__init__.py` → `UserRole` enum
   - Update `app/models/__init__.py` → `User.role` column
   - Run database migration

2. **Add role filtering in frontend:**
   - Update `Sidebar.jsx` → `getFilteredSidebarItems()` function
   - Add your custom filtering logic

## Files Modified

### Backend:
- `app/schemas/__init__.py` - Added frontoffice and housekeeping to UserRole enum
- `app/models/__init__.py` - Updated User model role column
- `create_role_users.py` - Script to create test users
- `database_reference/add_frontoffice_housekeeping_roles.sql` - SQL migration

### Frontend:
- `src/components/Sidebar.jsx` - Added role-based menu filtering
- Now imports `useAuth` to get current user role
- Filters sidebar items based on user.role

## Questions or Issues?

If you encounter any problems:
1. Check backend logs for authentication errors
2. Verify database schema was updated correctly
3. Clear browser cache and localStorage
4. Ensure user role in database is correct

---
**Last Updated**: November 2025
**Version**: 1.0
