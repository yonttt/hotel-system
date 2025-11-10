-- Add Front Office and Housekeeping roles to users table
-- Run this migration to add new user roles

-- Step 1: Modify the users table role enum to include new roles
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'staff', 'frontoffice', 'housekeeping') DEFAULT 'staff';

-- Step 2: Create sample Front Office user (password: frontoffice123)
INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('frontoffice', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aX4z.fCw9jGu', 'frontoffice@hotel.com', 'frontoffice', NOW(), NOW())
ON DUPLICATE KEY UPDATE role = 'frontoffice';

-- Step 3: Create sample Housekeeping user (password: housekeeping123)
INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('housekeeping', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aX4z.fCw9jGu', 'housekeeping@hotel.com', 'housekeeping', NOW(), NOW())
ON DUPLICATE KEY UPDATE role = 'housekeeping';

-- Verify the changes
SELECT id, username, email, role, created_at FROM users WHERE role IN ('frontoffice', 'housekeeping');
