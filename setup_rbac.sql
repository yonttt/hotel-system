-- Update users table to add new roles
USE eva_group_hotel;

ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'manager', 'staff', 'frontoffice', 'housekeeping') DEFAULT 'staff';

-- Create Front Office user (password: frontoffice123)
-- Password hash generated with bcrypt
INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('frontoffice', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aX4z.fCw9jGu', 'frontoffice@hotel.com', 'frontoffice', NOW(), NOW())
ON DUPLICATE KEY UPDATE role = 'frontoffice';

-- Create Housekeeping user (password: housekeeping123)
-- Password hash generated with bcrypt
INSERT INTO users (username, password, email, role, created_at, updated_at)
VALUES ('housekeeping', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aX4z.fCw9jGu', 'housekeeping@hotel.com', 'housekeeping', NOW(), NOW())
ON DUPLICATE KEY UPDATE role = 'housekeeping';

-- Verify the changes
SELECT id, username, email, role, created_at FROM users WHERE role IN ('frontoffice', 'housekeeping');
