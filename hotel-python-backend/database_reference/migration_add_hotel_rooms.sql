/*
 * MIGRATION SCRIPT: Add Hotel Rooms Table
 * 
 * This script safely adds the hotel_rooms table with all room data from Hotel New Idola
 * without affecting existing data.
 * 
 * USAGE:
 * 1. Backup your existing database first!
 * 2. Run this script via phpMyAdmin or MySQL command line
 * 3. Verify the new table and data
 */

USE hotel_system;

-- Create hotel_rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS hotel_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL DEFAULT 'HOTEL NEW IDOLA',
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type VARCHAR(10) NOT NULL,
    floor_number INT NOT NULL,
    vip_status ENUM('YES', 'NO') DEFAULT 'NO',
    smoking_allowed ENUM('Yes', 'No') DEFAULT 'No',
    tax_status ENUM('YA', 'TIDAK') DEFAULT 'TIDAK',
    room_size INT NULL COMMENT 'Room size in square meters',
    bed_type VARCHAR(50) DEFAULT 'Double',
    max_occupancy INT DEFAULT 2,
    status ENUM('available', 'occupied', 'maintenance', 'out_of_order') DEFAULT 'available',
    category_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system'
);

-- Only insert data if table is empty
SET @room_count = (SELECT COUNT(*) FROM hotel_rooms);

-- Insert all room data if table is empty
INSERT INTO hotel_rooms (hotel_name, room_number, room_type, floor_number, vip_status, smoking_allowed, tax_status, room_size, created_by) 
SELECT * FROM (
    -- Floor 1
    SELECT 'HOTEL NEW IDOLA', '115', 'STD', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '113', 'STD', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1013', 'APT', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1012', 'APT', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1009', 'DLX', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1008', 'APT', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1007', 'APT', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1006', 'APT', 1, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '102', 'STD', 1, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '101', 'STD', 1, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1005', 'APT', 1, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1004', 'APT', 1, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '1003', 'APT', 1, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '110', 'BIS', 1, 'NO', 'No', 'YA', 56, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '108', 'STD', 1, 'NO', 'Yes', 'YA', 45, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '106', 'STD', 1, 'NO', 'Yes', 'YA', 45, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '105', 'STD', 1, 'NO', 'Yes', 'YA', 39, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '104', 'STD', 1, 'NO', 'Yes', 'YA', 40, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '103', 'STD', 1, 'NO', 'Yes', 'YA', 40, 'migration'
    
    -- Floor 2
    UNION ALL SELECT 'HOTEL NEW IDOLA', '219', 'DLX', 2, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '217', 'STD', 2, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '202', 'DLX', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '201', 'DLX', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '214', 'STD', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '213', 'STD', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '212', 'STD', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '211', 'DLX', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '210', 'DLX', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '209', 'STD', 2, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '208', 'BIS', 2, 'NO', 'Yes', 'YA', 50, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '207', 'BIS', 2, 'NO', 'Yes', 'YA', 50, 'migration'
    
    -- Floor 3
    UNION ALL SELECT 'HOTEL NEW IDOLA', '308', 'STD', 3, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '307', 'BIS', 3, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '302', 'BIS', 3, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '301', 'BIS', 3, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '329', 'SPR', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '322', 'DLX', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '321', 'SPR', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '320', 'SPR', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '319', 'DLX', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '318', 'STD', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '317', 'STD', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '316', 'STD', 3, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '315', 'DLX', 3, 'NO', 'No', 'YA', NULL, 'migration'
    
    -- Floor 4
    UNION ALL SELECT 'HOTEL NEW IDOLA', '422', 'DLX', 4, 'NO', 'No', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '419', 'STD', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '404', 'DLX', 4, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '403', 'SPR', 4, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '401', 'SPR', 4, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '415', 'STD', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '414', 'STD', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '413', 'DLX', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '412', 'BIS', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '411', 'BIS', 4, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '406', 'EXE', 4, 'NO', 'Yes', 'YA', 25, 'migration'
    
    -- Floor 5
    UNION ALL SELECT 'HOTEL NEW IDOLA', '509', 'DLX', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '508', 'SPR', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '507', 'DLX', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '504', 'SPR', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '503', 'SPR', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '501', 'SPR', 5, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '513', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 24, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '512', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 17, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '511', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 19, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '510', 'EXE', 5, 'NO', 'Yes', 'YA', 16, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '506', 'EXE', 5, 'NO', 'Yes', 'YA', 26, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '505', 'EXE', 5, 'NO', 'Yes', 'YA', 16, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '502', 'EXE', 5, 'NO', 'Yes', 'YA', 22, 'migration'
    
    -- Floor 6
    UNION ALL SELECT 'HOTEL NEW IDOLA', '609', 'SPR', 6, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '608', 'SPR', 6, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '607', 'EXE', 6, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '604', 'DLX', 6, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '603', 'SPR', 6, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '601', 'SPR', 6, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '606', 'EXE', 6, 'NO', 'Yes', 'YA', 18, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '605', 'SPR', 6, 'NO', 'Yes', 'YA', 18, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '602', 'EXE', 6, 'NO', 'Yes', 'YA', 16, 'migration'
    
    -- Floor 7
    UNION ALL SELECT 'HOTEL NEW IDOLA', '707', 'SPR', 7, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '706', 'EXE', 7, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '705', 'SPR', 7, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '704', 'DLX', 7, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '703', 'SPR', 7, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '701', 'SPR', 7, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '709', 'EXE', 7, 'NO', 'Yes', 'TIDAK', 17, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '708', 'EXE', 7, 'NO', 'Yes', 'TIDAK', 19, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '702', 'EXE', 7, 'NO', 'Yes', 'YA', 22, 'migration'
    
    -- Floor 8
    UNION ALL SELECT 'HOTEL NEW IDOLA', '808', 'SPR', 8, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '807', 'SPR', 8, 'NO', 'Yes', 'TIDAK', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '805', 'SPR', 8, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '804', 'EXE', 8, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '803', 'SPR', 8, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '801', 'SPR', 8, 'NO', 'Yes', 'YA', NULL, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '806', 'EXE', 8, 'NO', 'Yes', 'TIDAK', 13, 'migration'
    UNION ALL SELECT 'HOTEL NEW IDOLA', '802', 'EXE', 8, 'NO', 'No', 'YA', 17, 'migration'
) AS room_data
WHERE @room_count = 0;

-- Add foreign key to room_categories if both tables exist
SET @fk_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'hotel_system' 
    AND TABLE_NAME = 'hotel_rooms' 
    AND CONSTRAINT_NAME LIKE '%category%'
);

SET @categories_exist = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = 'hotel_system' 
    AND TABLE_NAME = 'room_categories'
);

SET @sql = IF(@fk_exists = 0 AND @categories_exist > 0, 
    'ALTER TABLE hotel_rooms ADD FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL',
    'SELECT "Foreign key not needed or already exists" as message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Link rooms to categories if room_categories table exists
UPDATE hotel_rooms hr 
SET category_id = (
    SELECT rc.id 
    FROM room_categories rc 
    WHERE rc.code = hr.room_type 
    LIMIT 1
) 
WHERE hr.category_id IS NULL 
AND EXISTS (SELECT 1 FROM room_categories rc WHERE rc.code = hr.room_type);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_number ON hotel_rooms(room_number);
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_type ON hotel_rooms(room_type);
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_floor ON hotel_rooms(floor_number);
CREATE INDEX IF NOT EXISTS idx_hotel_rooms_status ON hotel_rooms(status);

-- Create view for room availability with pricing
CREATE OR REPLACE VIEW room_availability AS
SELECT 
    hr.id,
    hr.hotel_name,
    hr.room_number,
    hr.room_type,
    hr.floor_number,
    hr.vip_status,
    hr.smoking_allowed,
    hr.tax_status,
    hr.room_size,
    hr.status,
    COALESCE(rc.type, hr.room_type) as category_name,
    COALESCE(rc.normal_rate, 0) as normal_rate,
    COALESCE(rc.weekend_rate, 0) as weekend_rate,
    COALESCE(rc.max_occupancy, hr.max_occupancy) as max_occupancy,
    rc.amenities,
    CASE 
        WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN COALESCE(rc.weekend_rate, 0)
        ELSE COALESCE(rc.normal_rate, 0)
    END as current_rate,
    CASE 
        WHEN hr.status = 'available' THEN 'Available'
        WHEN hr.status = 'occupied' THEN 'Occupied'
        WHEN hr.status = 'maintenance' THEN 'Under Maintenance'
        ELSE 'Out of Service'
    END as status_display
FROM hotel_rooms hr
LEFT JOIN room_categories rc ON hr.category_id = rc.id
WHERE hr.is_active = TRUE
ORDER BY hr.floor_number, hr.room_number;

SELECT 'Hotel rooms migration completed successfully!' as status,
       (SELECT COUNT(*) FROM hotel_rooms) as total_rooms,
       (SELECT COUNT(DISTINCT room_type) FROM hotel_rooms) as room_types,
       (SELECT COUNT(DISTINCT floor_number) FROM hotel_rooms) as floors;