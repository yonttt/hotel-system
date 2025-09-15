# Backend Documentation & Usage Guide

Complete documentation for the Hotel Management System Backend.

---

## 📁 Backend Architecture

```
Backend/
├── 📂 api/                    # REST API endpoints (ready for future expansion)
├── 📂 config/                 # Configuration files
│   └── 📄 database.php       # Database connection and configuration
├── 📂 database/              # SQL schema files
│   ├── 📄 hotel_system.sql   # Main database structure
│   ├── 📄 create_hotel_reservations.sql  # Reservations table
│   └── 📄 update_hotel_name_column.sql   # Schema updates
└── 📂 includes/              # Core backend classes and functions
    └── 📄 auth.php          # Authentication system
```

---

## 🔧 Backend Components

### 1. Database Configuration (`config/database.php`)
**Purpose**: Centralizes database connection and configuration

**Used By**:
- `Frontend/modules/frontoffice/form/refresh_room_status.php`
- `Frontend/modules/frontoffice/form/reservation.php` 
- `Frontend/modules/frontoffice/form/registration.php`
- `Frontend/modules/frontoffice/status/status_kamar.php`
- `Frontend/modules/frontoffice/informasi_reservasi/*.php` (all files)
- `Frontend/modules/frontoffice/informasi_tamu/*.php` (all files)
- `Backend/includes/auth.php`

**Usage Pattern**:
```php
require_once __DIR__ . '/../../../../Backend/config/database.php';
$db = new Database();
$connection = $db->getConnection();
```

### 2. Authentication System (`includes/auth.php`)
**Purpose**: Handles user authentication and session management

**Used By**:
- `Frontend/pages/index.php` (login page)
- `Frontend/pages/home.php` (protected dashboard)
- All protected frontend modules (via requireLogin())

**Functions**:
- `login($username, $password)` - Authenticates user credentials
- `logout()` - Destroys user session
- `requireLogin()` - Protects pages from unauthorized access
- `isLoggedIn()` - Checks if user is authenticated

**Usage Pattern**:
```php
require_once '../../Backend/includes/auth.php';
$auth = new Auth();
$auth->requireLogin(); // For protected pages
```

### 3. Database Schema (`database/*.sql`)
**Purpose**: Database structure and initialization

**Files**:
- `hotel_system.sql` - Main database structure (11 tables)
- `create_hotel_reservations.sql` - Reservations table creation
- `update_hotel_name_column.sql` - Schema updates and migrations

**Usage**: Import via phpMyAdmin or MySQL command line

---

## 🗺️ Frontend-Backend Usage Mapping

### Database Connection Usage
```
📄 database.php → Used by 11+ Frontend modules
├── Frontend/modules/frontoffice/form/
│   ├── refresh_room_status.php (Line 13)
│   ├── reservation.php (Line 13)
│   └── registration.php (Line 13)
├── Frontend/modules/frontoffice/status/
│   └── status_kamar.php (Line 13)
├── Frontend/modules/frontoffice/informasi_reservasi/
│   ├── all_reservation.php (Line 5)
│   ├── reservation_by_deposit.php (Line 5)
│   └── reservation_today.php (Line 5)
├── Frontend/modules/frontoffice/informasi_tamu/
│   ├── guest_history.php (Line 13)
│   ├── guest_research.php (Line 11)
│   ├── inhouse_guest_info.php (Line 13)
│   ├── room_status_realtime.php (Line 13)
│   └── today_checkin.php (Line 13)
└── Backend/includes/auth.php (Line 3)
```

### Authentication Usage
```
📄 auth.php → Used by All Protected Pages
├── Frontend/pages/
│   ├── index.php (Line 2) - Login page
│   └── home.php (Line 14) - Main dashboard
└── All protected frontend modules (via requireLogin())
```

---

## 🔄 Data Flow Architecture

```
User Request
     ↓
Frontend Page (index.php, home.php)
     ↓
Includes Backend/includes/auth.php (authentication)
     ↓
Frontend Module (reservation.php, guest_history.php, etc.)
     ↓
Includes Backend/config/database.php (data access)
     ↓
Database Operations using Backend/database/*.sql schemas
     ↓
Results displayed in Frontend
```

---

## 🎯 Quick Reference Guide

### Need database connection?
```php
require_once __DIR__ . '/../../../../Backend/config/database.php';
$db = new Database();
$connection = $db->getConnection();
```

### Need authentication?
```php
require_once '../../Backend/includes/auth.php';
$auth = new Auth();
$auth->requireLogin(); // For protected pages
```

### Need to check login status?
```php
if ($auth->isLoggedIn()) {
    // User is logged in
} else {
    // Redirect to login
}
```

---

## 📊 Backend Statistics

| Component | Used By | Frequency |
|-----------|---------|-----------|
| database.php | 11+ modules | Every data operation |
| auth.php | All protected pages | Every page load |
| SQL files | Database setup | Initial deployment |

---

## 🔍 Impact Analysis Guide

**If you modify Backend/config/database.php:**
- **Affected Files**: 11+ frontend modules + auth.php
- **Test Required**: All database operations, login system

**If you modify Backend/includes/auth.php:**
- **Affected Files**: index.php, home.php, all protected modules
- **Test Required**: Login/logout, session management, page protection

**If you modify Backend/database/*.sql:**
- **Affected**: Database structure, all modules using those tables
- **Test Required**: Database operations, data integrity

---

## 🚀 Development Commands

### Find all files using database.php:
```bash
grep -r "Backend/config/database.php" Frontend/
```

### Find all files using auth.php:
```bash
grep -r "Backend/includes/auth.php" Frontend/
```

### See database connection usage:
```bash
grep -r "new Database()" Frontend/
```

### See authentication usage:
```bash
grep -r "new Auth()" Frontend/
```

---

## ✅ Backend Organization Complete

- **✅ All backend logic** organized in Backend/ folder
- **✅ Clear separation** between frontend and backend
- **✅ Comprehensive documentation** with usage locations
- **✅ Scalable architecture** ready for expansion
- **✅ Professional structure** for team development

Your backend is fully organized, documented, and ready for production use! 🎉