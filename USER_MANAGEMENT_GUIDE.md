# User Management System - Quick Guide

## What Was Done

### 1. Staff Account Deleted ✅
The "staff" account has been removed from the system.

### 2. User Management Interface Created ✅
A new User Management page has been created for administrators to add/delete users.

**Location:** HRD > User Management

### 3. Backend API Added ✅
- `/users/` - GET endpoint to list all users (admin only)
- `/users/{user_id}` - DELETE endpoint to remove a user (admin only)
- `/auth/register` - POST endpoint to create new users (admin only)

---

## Current User Accounts

| ID | Username | Email | Role | Created Date |
|---|---|---|---|---|
| 1 | admin | admin@evagrouphotel.com | admin | 2025-09-16 |
| 2 | manager | manager@evagrouphotel.com | manager | 2025-09-16 |
| 5 | frontoffice | frontoffice@hotel.com | frontoffice | 2025-11-10 |
| 6 | housekeeping | housekeeping@hotel.com | housekeeping | 2025-11-10 |

**Total: 4 active accounts**

---

## How to Add a New User (Example: Miyamura)

### Method 1: Using the Web Interface (Recommended)

1. **Login as Admin**
   - Username: `admin`
   - Password: (your admin password)

2. **Navigate to User Management**
   - Go to **HRD** menu in the sidebar
   - Click **User Management**

3. **Add New User**
   - Click the green **"+ Add New User"** button
   - Fill in the form:
     - **Username:** `Miyamura`
     - **Email:** `miyamura@hotel.com` (optional)
     - **Password:** `miyamura123` (or your choice)
     - **Role:** Select `Front Office`
   - Click **"Add User"**

4. **Done!** 
   - Miyamura can now login with username `Miyamura` and the password you set
   - He will only see Front Office menus

### Method 2: Using Database Command

```python
python -c "
import pymysql
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
conn = pymysql.connect(host='localhost', user='system', password='yont29921', database='hotel_system', charset='utf8mb4')
cursor = conn.cursor()

# Create new user
username = 'Miyamura'
email = 'miyamura@hotel.com'
password = 'miyamura123'
role = 'frontoffice'

hashed_password = pwd_context.hash(password)
cursor.execute(
    'INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)',
    (username, email, hashed_password, role)
)
conn.commit()
print(f'✓ User {username} created successfully!')
cursor.close()
conn.close()
"
```

---

## Available Roles

When adding a new user, you can assign one of these roles:

### 1. **Admin**
- Full system access
- Can add/delete users
- Can edit all master data

### 2. **Manager**
- Full operational access
- Can edit all master data
- Cannot manage users

### 3. **Front Office**
- Access to Front Office menus only
- Can view but NOT edit housekeeping data
- Can perform registrations, reservations, check-ins

### 4. **Housekeeping**
- Access to Housekeeping menus only
- Can edit housekeeping master data (Room Types, Management Room)
- Can view but NOT edit front office data

---

## Security Features

✅ **Role-Based Access Control (RBAC)**
- Users only see menus relevant to their role
- Edit buttons only visible to authorized roles

✅ **Admin Protection**
- Admins cannot delete their own account
- User management requires admin role

✅ **Password Security**
- Passwords are hashed using bcrypt
- Never stored in plain text

---

## Testing the New System

1. **Login as admin** and go to User Management
2. **Add a new user** named "Miyamura" with Front Office role
3. **Logout** and login as Miyamura
4. **Verify** that only Front Office menus are visible
5. **Navigate** to housekeeping pages and verify Edit buttons are NOT visible

---

## Troubleshooting

### "Access Denied" error
- Only admin accounts can access User Management
- Login with admin credentials

### Cannot delete a user
- You cannot delete your own account
- Login with a different admin account

### New user cannot login
- Verify the username and password are correct
- Check that the user was created successfully in User Management

---

## Example: Adding Miyamura with Front Office Access

```
Username: Miyamura
Email: miyamura@hotel.com
Password: miyamura123
Role: Front Office

Access Rights:
✅ Front Office (Full access)
✅ Housekeeping (Read-only, no Edit buttons)
✅ HRD (Read-only if needed)
❌ User Management (No access)
```

After creation, Miyamura logs in and only sees:
- Dashboard
- Front Office menu with all submenus
- Status Kamar FO
- All Front Office operations

He will NOT see Edit buttons in:
- Master Room Type
- Management Room
- Other housekeeping master data
