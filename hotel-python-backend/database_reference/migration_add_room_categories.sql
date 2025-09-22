/*
 * MIGRATION SCRIPT: Add Room Categories Table
 * 
 * This script safely adds the room_categories table to an existing hotel_system database
 * without affecting existing data.
 * 
 * USAGE:
 * 1. Backup your existing database first!
 * 2. Run this script via phpMyAdmin or MySQL command line
 * 3. Verify the new table and data
 */

USE hotel_system;

-- Check if room_categories table exists, create if not
CREATE TABLE IF NOT EXISTS room_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    normal_rate DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    weekend_rate DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    description TEXT,
    amenities TEXT,
    max_occupancy INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Insert room categories only if table is empty
INSERT INTO room_categories (code, type, normal_rate, weekend_rate, description, max_occupancy, created_by) 
SELECT * FROM (SELECT 
    'EXE' as code, 'Executive' as type, 345.000 as normal_rate, 355.000 as weekend_rate, 
    'Executive room category with premium amenities and city view' as description, 2 as max_occupancy, 'migration' as created_by
UNION ALL SELECT 
    'SPR', 'Superior', 325.000, 335.000, 
    'Superior room category with enhanced features and modern decor', 2, 'migration'
UNION ALL SELECT 
    'DLX', 'Deluxe', 295.000, 305.000, 
    'Deluxe room category with comfortable accommodations and garden view', 2, 'migration'
UNION ALL SELECT 
    'STD', 'Standard', 265.000, 275.000, 
    'Standard room category with basic amenities and essential comfort', 2, 'migration'
UNION ALL SELECT 
    'BIS', 'Business', 190.000, 200.000, 
    'Business room category designed for corporate guests with work facilities', 1, 'migration'
UNION ALL SELECT 
    'APT', 'Apartemen', 360.000, 370.000, 
    'Apartment style accommodation with kitchen facilities and living area', 4, 'migration'
UNION ALL SELECT 
    'APT DLX', 'APT DLX', 1000.000, 1000.000, 
    'Deluxe apartment with premium facilities, full kitchen, and premium services', 6, 'migration'
) AS new_categories
WHERE NOT EXISTS (SELECT 1 FROM room_categories LIMIT 1);

-- Add category_id to rooms table if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'hotel_system' 
    AND TABLE_NAME = 'rooms' 
    AND COLUMN_NAME = 'category_id'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE rooms ADD COLUMN category_id INT, ADD COLUMN floor_number INT DEFAULT 1, ADD COLUMN bed_type VARCHAR(50) DEFAULT "Double", ADD COLUMN view_type VARCHAR(50) DEFAULT "City"',
    'SELECT "Columns already exist" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint if it doesn't exist
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'hotel_system' 
    AND TABLE_NAME = 'rooms' 
    AND CONSTRAINT_NAME LIKE '%category%'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE rooms ADD FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL',
    'SELECT "Foreign key already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_categories_code ON room_categories(code);
CREATE INDEX IF NOT EXISTS idx_room_categories_type ON room_categories(type);
CREATE INDEX IF NOT EXISTS idx_room_categories_active ON room_categories(is_active);

-- Create views for easy data access
CREATE OR REPLACE VIEW active_room_categories AS
SELECT 
    id,
    code,
    type,
    normal_rate,
    weekend_rate,
    description,
    amenities,
    max_occupancy,
    created_at,
    updated_at,
    CASE 
        WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN weekend_rate 
        ELSE normal_rate 
    END as current_rate
FROM room_categories 
WHERE is_active = TRUE
ORDER BY normal_rate DESC;

-- Update existing rooms to have category_id if they don't have one
UPDATE rooms r 
SET category_id = (
    SELECT rc.id 
    FROM room_categories rc 
    WHERE rc.type = r.room_type 
    LIMIT 1
) 
WHERE r.category_id IS NULL 
AND EXISTS (SELECT 1 FROM room_categories rc WHERE rc.type = r.room_type);

-- For rooms that don't match existing categories, assign Standard category
UPDATE rooms r 
SET category_id = (
    SELECT rc.id 
    FROM room_categories rc 
    WHERE rc.code = 'STD' 
    LIMIT 1
) 
WHERE r.category_id IS NULL;

SELECT 'Migration completed successfully!' as status,
       (SELECT COUNT(*) FROM room_categories) as categories_created,
       (SELECT COUNT(*) FROM rooms WHERE category_id IS NOT NULL) as rooms_updated;