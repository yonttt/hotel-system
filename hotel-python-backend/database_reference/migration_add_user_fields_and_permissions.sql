-- Migration: Add User Fields and Permissions
-- Date: 2025-11-24
-- Description: Add missing fields to users table and create user_permissions table

-- Step 1: Add new columns to users table
ALTER TABLE users 
ADD COLUMN full_name VARCHAR(100) AFTER email,
ADD COLUMN title VARCHAR(100) AFTER full_name,
ADD COLUMN hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA' AFTER title,
ADD COLUMN is_blocked BOOLEAN DEFAULT FALSE AFTER hotel_name,
ADD COLUMN last_login TIMESTAMP NULL AFTER is_blocked,
ADD COLUMN account_type ENUM('Management', 'Non Management') AFTER last_login;

-- Step 2: Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role ENUM('admin','manager','staff','frontoffice','housekeeping') NOT NULL,
    can_view BOOLEAN DEFAULT TRUE,
    can_create BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Step 3: Update existing users with default values
UPDATE users SET 
    full_name = UPPER(username),
    title = CASE 
        WHEN role = 'admin' THEN 'Admin Hotel'
        WHEN role = 'manager' THEN 'Finance Hotel'
        WHEN role = 'frontoffice' THEN 'Operational Front Office'
        WHEN role = 'housekeeping' THEN 'Leader Housekeeping'
        WHEN role = 'staff' THEN 'Staff'
        ELSE role
    END,
    hotel_name = 'HOTEL NEW IDOLA',
    is_blocked = FALSE,
    account_type = CASE 
        WHEN role IN ('admin', 'manager') THEN 'Management'
        ELSE 'Non Management'
    END
WHERE full_name IS NULL;

-- Step 4: Insert default permissions for all roles
INSERT INTO user_permissions (role, can_view, can_create, can_edit, can_delete) VALUES
('admin', TRUE, TRUE, TRUE, TRUE),
('manager', TRUE, TRUE, TRUE, FALSE),
('frontoffice', TRUE, FALSE, FALSE, FALSE),
('housekeeping', TRUE, FALSE, FALSE, FALSE),
('staff', TRUE, FALSE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE 
    can_view = VALUES(can_view),
    can_create = VALUES(can_create),
    can_edit = VALUES(can_edit),
    can_delete = VALUES(can_delete);

-- Verification queries
SELECT 'Users table updated:' as Status;
SELECT id, username, full_name, title, hotel_name, is_blocked, account_type, role FROM users LIMIT 5;

SELECT 'User permissions created:' as Status;
SELECT * FROM user_permissions ORDER BY role;
