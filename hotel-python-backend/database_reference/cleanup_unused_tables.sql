/*
 * CLEANUP UNUSED TABLES - Hotel Management System
 * 
 * This script removes tables that are no longer used in the system.
 * 
 * TABLES TO BE REMOVED:
 * 1. guest_registrations - DUPLICATE (use hotel_registrations instead)
 * 2. rooms - LEGACY (replaced by hotel_rooms with more fields)
 * 3. registration_types - NOT USED (no API endpoints)
 * 4. services - NOT USED (no API endpoints, can add later if needed)
 * 5. settings - NOT USED (no API endpoints)
 * 6. master_meja - NOT USED (F&B feature not implemented)
 * 
 * IMPORTANT: Run this ONLY after backing up your database!
 * 
 * DATE: December 2025
 */

USE hotel_system;

-- ============================================================================
-- STEP 1: Check which tables exist before dropping
-- ============================================================================
SELECT 'Tables to be dropped:' AS info;
SHOW TABLES LIKE 'guest_registrations';
SHOW TABLES LIKE 'rooms';
SHOW TABLES LIKE 'registration_types';
SHOW TABLES LIKE 'services';
SHOW TABLES LIKE 'settings';
SHOW TABLES LIKE 'master_meja';

-- ============================================================================
-- STEP 2: Drop foreign key constraints first (if any)
-- ============================================================================

-- Drop constraints referencing registration_types
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = 'hotel_system' 
     AND REFERENCED_TABLE_NAME = 'registration_types') > 0,
    (SELECT GROUP_CONCAT(CONCAT('ALTER TABLE ', TABLE_NAME, ' DROP FOREIGN KEY ', CONSTRAINT_NAME) SEPARATOR '; ')
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = 'hotel_system' 
     AND REFERENCED_TABLE_NAME = 'registration_types'),
    'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop constraints referencing rooms (legacy)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = 'hotel_system' 
     AND REFERENCED_TABLE_NAME = 'rooms') > 0,
    (SELECT GROUP_CONCAT(CONCAT('ALTER TABLE ', TABLE_NAME, ' DROP FOREIGN KEY ', CONSTRAINT_NAME) SEPARATOR '; ')
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE TABLE_SCHEMA = 'hotel_system' 
     AND REFERENCED_TABLE_NAME = 'rooms'),
    'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- STEP 3: Drop the unused tables
-- ============================================================================

-- Drop guest_registrations (DUPLICATE - use hotel_registrations)
DROP TABLE IF EXISTS guest_registrations;
SELECT 'Dropped: guest_registrations' AS status;

-- Drop rooms (LEGACY - replaced by hotel_rooms)
DROP TABLE IF EXISTS rooms;
SELECT 'Dropped: rooms' AS status;

-- Drop registration_types (NOT USED)
DROP TABLE IF EXISTS registration_types;
SELECT 'Dropped: registration_types' AS status;

-- Drop services (NOT USED - can recreate later if needed)
DROP TABLE IF EXISTS services;
SELECT 'Dropped: services' AS status;

-- Drop settings (NOT USED - can recreate later if needed)
DROP TABLE IF EXISTS settings;
SELECT 'Dropped: settings' AS status;

-- Drop master_meja (F&B not implemented)
DROP TABLE IF EXISTS master_meja;
SELECT 'Dropped: master_meja' AS status;

-- ============================================================================
-- STEP 4: Verify cleanup
-- ============================================================================
SELECT 'Remaining tables in hotel_system:' AS info;
SHOW TABLES;

-- ============================================================================
-- SUMMARY OF TABLES THAT SHOULD REMAIN:
-- ============================================================================
/*
ACTIVE TABLES (DO NOT DELETE):
1. users                    - User authentication
2. user_permissions         - Role-based permissions
3. hotel_registrations      - Guest check-in/registration
4. hotel_reservations       - Future bookings
5. group_bookings           - Group booking headers
6. group_booking_rooms      - Group booking room details
7. hotel_rooms              - Room management
8. room_categories          - Room types with pricing
9. hotel_revenue_summary    - Revenue reports
10. non_hotel_revenue_summary - Non-hotel revenue
11. nationalities           - Country lookup
12. cities                  - City lookup
13. category_markets        - Market category lookup
14. market_segments         - Market segment with discounts
15. payment_methods         - Payment method lookup
16. guests                  - Guest records
*/
