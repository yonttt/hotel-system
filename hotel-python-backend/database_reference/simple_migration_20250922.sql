-- =============================================
-- Simple Hotel System Update for Existing Database
-- Add Room Categories and Complete Room Inventory
-- September 22, 2025
-- =============================================

USE hotel_system;

-- Create room categories table
CREATE TABLE IF NOT EXISTS room_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_code VARCHAR(10) NOT NULL UNIQUE,
    category_name VARCHAR(50) NOT NULL,
    description TEXT,
    normal_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    weekend_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category_code (category_code),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert room categories
INSERT INTO room_categories (category_code, category_name, description, normal_rate, weekend_rate) VALUES
('STD', 'Standard', 'Standard room with basic amenities', 350000, 400000),
('SPR', 'Superior', 'Superior room with enhanced comfort', 450000, 500000),
('DLX', 'Deluxe', 'Deluxe room with premium amenities', 550000, 600000),
('EXE', 'Executive', 'Executive room with luxury features', 650000, 750000),
('BIS', 'Business', 'Business room with work facilities', 500000, 550000),
('APT', 'Apartemen', 'Apartment-style room with kitchenette', 750000, 850000)
ON DUPLICATE KEY UPDATE
    category_name = VALUES(category_name),
    description = VALUES(description),
    normal_rate = VALUES(normal_rate),
    weekend_rate = VALUES(weekend_rate),
    updated_at = CURRENT_TIMESTAMP;

-- Create hotel_rooms table with Hit column
CREATE TABLE IF NOT EXISTS hotel_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type ENUM('STD', 'SPR', 'DLX', 'EXE', 'BIS', 'APT') NOT NULL,
    floor_number INT NOT NULL,
    vip_status ENUM('YES', 'NO') DEFAULT 'NO',
    smoking_allowed ENUM('Yes', 'No') NOT NULL,
    tax_status ENUM('YA', 'TIDAK') NOT NULL,
    hit_count INT DEFAULT 0 COMMENT 'Number of times room has been used/booked',
    room_size VARCHAR(20) DEFAULT NULL COMMENT 'Room size in square meters',
    bed_type VARCHAR(50) DEFAULT 'Double',
    max_occupancy INT DEFAULT 2,
    status ENUM('available', 'occupied', 'maintenance', 'out_of_order') DEFAULT 'available',
    category_id INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'migration_system',
    
    INDEX idx_room_number (room_number),
    INDEX idx_room_type (room_type),
    INDEX idx_floor (floor_number),
    INDEX idx_status (status),
    INDEX idx_hit_count (hit_count DESC),
    
    FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clear existing data if any
DELETE FROM hotel_rooms;

-- Insert all 134 rooms with Hit data
INSERT INTO hotel_rooms (room_number, room_type, floor_number, vip_status, smoking_allowed, tax_status, hit_count) VALUES
('115', 'STD', 1, 'NO', 'No', 'TIDAK', 0),
('113', 'STD', 1, 'NO', 'No', 'TIDAK', 0),
('1013', 'APT', 1, 'NO', 'No', 'TIDAK', 0),
('1012', 'APT', 1, 'NO', 'No', 'TIDAK', 0),
('1009', 'DLX', 1, 'NO', 'No', 'TIDAK', 0),
('1008', 'APT', 1, 'NO', 'No', 'TIDAK', 0),
('1007', 'APT', 1, 'NO', 'No', 'TIDAK', 0),
('1006', 'APT', 1, 'NO', 'No', 'TIDAK', 0),
('102', 'STD', 1, 'NO', 'Yes', 'YA', 0),
('101', 'STD', 1, 'NO', 'Yes', 'YA', 0),
('1005', 'APT', 1, 'NO', 'Yes', 'TIDAK', 0),
('1004', 'APT', 1, 'NO', 'Yes', 'TIDAK', 0),
('1003', 'APT', 1, 'NO', 'Yes', 'TIDAK', 1),
('110', 'BIS', 1, 'NO', 'No', 'YA', 8),
('109', 'STD', 1, 'NO', 'Yes', 'YA', 45),
('106', 'STD', 1, 'NO', 'Yes', 'YA', 45),
('105', 'STD', 1, 'NO', 'Yes', 'YA', 39),
('104', 'STD', 1, 'NO', 'Yes', 'YA', 40),
('103', 'STD', 1, 'NO', 'Yes', 'YA', 40),
('111', 'BIS', 1, 'NO', 'No', 'YA', 56),
('114', 'STD', 1, 'NO', 'No', 'TIDAK', 29),
('112', 'STD', 1, 'NO', 'Yes', 'YA', 27),
('108', 'DLX', 1, 'NO', 'Yes', 'YA', 23),
('107', 'STD', 1, 'NO', 'No', 'YA', 33),
('219', 'DLX', 2, 'NO', 'Yes', 'TIDAK', 21),
('217', 'STD', 2, 'NO', 'Yes', 'TIDAK', 7),
('202', 'DLX', 2, 'NO', 'Yes', 'YA', 18),
('201', 'DLX', 2, 'NO', 'Yes', 'YA', 24),
('214', 'STD', 2, 'NO', 'Yes', 'YA', 48),
('213', 'STD', 2, 'NO', 'Yes', 'YA', 40),
('212', 'STD', 2, 'NO', 'Yes', 'YA', 33),
('211', 'DLX', 2, 'NO', 'Yes', 'YA', 49),
('210', 'DLX', 2, 'NO', 'Yes', 'YA', 44),
('209', 'STD', 2, 'NO', 'Yes', 'YA', 44),
('208', 'BIS', 2, 'NO', 'Yes', 'YA', 50),
('207', 'BIS', 2, 'NO', 'Yes', 'YA', 50),
('206', 'DLX', 2, 'NO', 'Yes', 'YA', 35),
('205', 'STD', 2, 'NO', 'Yes', 'YA', 39),
('204', 'STD', 2, 'NO', 'Yes', 'YA', 36),
('203', 'STD', 2, 'NO', 'Yes', 'YA', 41),
('220', 'STD', 2, 'NO', 'Yes', 'TIDAK', 35),
('218', 'DLX', 2, 'NO', 'Yes', 'TIDAK', 42),
('216', 'STD', 2, 'NO', 'Yes', 'TIDAK', 38),
('215', 'STD', 2, 'NO', 'Yes', 'TIDAK', 31),
('308', 'STD', 3, 'NO', 'Yes', 'YA', 28),
('307', 'BIS', 3, 'NO', 'Yes', 'YA', 27),
('302', 'BIS', 3, 'NO', 'Yes', 'YA', 30),
('301', 'BIS', 3, 'NO', 'Yes', 'YA', 31),
('329', 'SPR', 3, 'NO', 'Yes', 'TIDAK', 40),
('322', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 50),
('321', 'SPR', 3, 'NO', 'Yes', 'TIDAK', 46),
('320', 'SPR', 3, 'NO', 'Yes', 'TIDAK', 46),
('319', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 51),
('318', 'STD', 3, 'NO', 'Yes', 'TIDAK', 49),
('317', 'STD', 3, 'NO', 'Yes', 'TIDAK', 50),
('316', 'STD', 3, 'NO', 'Yes', 'TIDAK', 49),
('315', 'DLX', 3, 'NO', 'No', 'YA', 43),
('314', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 35),
('313', 'STD', 3, 'NO', 'Yes', 'TIDAK', 37),
('312', 'STD', 3, 'NO', 'Yes', 'YA', 44),
('311', 'STD', 3, 'NO', 'Yes', 'YA', 42),
('310', 'STD', 3, 'NO', 'Yes', 'YA', 17),
('309', 'STD', 3, 'NO', 'Yes', 'YA', 20),
('306', 'BIS', 3, 'NO', 'Yes', 'YA', 21),
('305', 'BIS', 3, 'NO', 'Yes', 'YA', 37),
('304', 'DLX', 3, 'NO', 'Yes', 'YA', 30),
('303', 'BIS', 3, 'NO', 'Yes', 'YA', 40),
('328', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 49),
('327', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 55),
('326', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 36),
('325', 'EXE', 3, 'NO', 'Yes', 'TIDAK', 34),
('324', 'EXE', 3, 'NO', 'Yes', 'TIDAK', 37),
('323', 'DLX', 3, 'NO', 'Yes', 'TIDAK', 31),
('422', 'DLX', 4, 'NO', 'No', 'TIDAK', 19),
('419', 'STD', 4, 'NO', 'Yes', 'TIDAK', 16),
('404', 'DLX', 4, 'NO', 'Yes', 'YA', 27),
('403', 'SPR', 4, 'NO', 'Yes', 'YA', 30),
('401', 'SPR', 4, 'NO', 'Yes', 'YA', 26),
('415', 'STD', 4, 'NO', 'Yes', 'TIDAK', 45),
('414', 'STD', 4, 'NO', 'Yes', 'TIDAK', 48),
('413', 'DLX', 4, 'NO', 'Yes', 'TIDAK', 55),
('412', 'BIS', 4, 'NO', 'Yes', 'TIDAK', 47),
('411', 'BIS', 4, 'NO', 'Yes', 'TIDAK', 43),
('421', 'DLX', 4, 'NO', 'Yes', 'TIDAK', 34),
('418', 'STD', 4, 'NO', 'Yes', 'TIDAK', 30),
('417', 'STD', 4, 'NO', 'Yes', 'TIDAK', 26),
('409', 'DLX', 4, 'NO', 'Yes', 'YA', 37),
('408', 'STD', 4, 'NO', 'Yes', 'YA', 33),
('407', 'STD', 4, 'NO', 'Yes', 'YA', 41),
('420', 'DLX', 4, 'NO', 'Yes', 'TIDAK', 53),
('416', 'STD', 4, 'NO', 'Yes', 'TIDAK', 46),
('410', 'BIS', 4, 'NO', 'Yes', 'YA', 45),
('406', 'EXE', 4, 'NO', 'Yes', 'YA', 25),
('405', 'EXE', 4, 'NO', 'Yes', 'YA', 16),
('402', 'EXE', 4, 'NO', 'Yes', 'YA', 17),
('509', 'DLX', 5, 'NO', 'Yes', 'YA', 26),
('508', 'SPR', 5, 'NO', 'Yes', 'YA', 18),
('507', 'DLX', 5, 'NO', 'Yes', 'YA', 28),
('504', 'SPR', 5, 'NO', 'Yes', 'YA', 16),
('503', 'SPR', 5, 'NO', 'Yes', 'YA', 26),
('501', 'SPR', 5, 'NO', 'Yes', 'YA', 33),
('513', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 24),
('512', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 17),
('511', 'EXE', 5, 'NO', 'Yes', 'TIDAK', 19),
('510', 'EXE', 5, 'NO', 'Yes', 'YA', 16),
('506', 'EXE', 5, 'NO', 'Yes', 'YA', 26),
('505', 'EXE', 5, 'NO', 'Yes', 'YA', 16),
('502', 'EXE', 5, 'NO', 'Yes', 'YA', 22),
('609', 'SPR', 6, 'NO', 'Yes', 'TIDAK', 35),
('608', 'SPR', 6, 'NO', 'Yes', 'TIDAK', 27),
('607', 'EXE', 6, 'NO', 'Yes', 'TIDAK', 25),
('604', 'DLX', 6, 'NO', 'Yes', 'YA', 28),
('603', 'SPR', 6, 'NO', 'Yes', 'YA', 33),
('601', 'SPR', 6, 'NO', 'Yes', 'YA', 31),
('606', 'EXE', 6, 'NO', 'Yes', 'YA', 18),
('605', 'SPR', 6, 'NO', 'Yes', 'YA', 18),
('602', 'EXE', 6, 'NO', 'Yes', 'YA', 16),
('707', 'SPR', 7, 'NO', 'Yes', 'YA', 23),
('706', 'EXE', 7, 'NO', 'Yes', 'TIDAK', 26),
('705', 'SPR', 7, 'NO', 'Yes', 'TIDAK', 21),
('704', 'DLX', 7, 'NO', 'Yes', 'YA', 23),
('703', 'SPR', 7, 'NO', 'Yes', 'YA', 31),
('701', 'SPR', 7, 'NO', 'Yes', 'YA', 28),
('709', 'EXE', 7, 'NO', 'Yes', 'TIDAK', 17),
('708', 'EXE', 7, 'NO', 'Yes', 'TIDAK', 19),
('702', 'EXE', 7, 'NO', 'Yes', 'YA', 22),
('808', 'SPR', 8, 'NO', 'Yes', 'TIDAK', 12),
('807', 'SPR', 8, 'NO', 'Yes', 'TIDAK', 10),
('805', 'SPR', 8, 'NO', 'Yes', 'YA', 18),
('804', 'EXE', 8, 'NO', 'Yes', 'YA', 16),
('803', 'SPR', 8, 'NO', 'Yes', 'YA', 17),
('801', 'SPR', 8, 'NO', 'Yes', 'YA', 9),
('806', 'EXE', 8, 'NO', 'Yes', 'TIDAK', 13),
('802', 'EXE', 8, 'NO', 'No', 'YA', 17);

-- Update category_id relationships
UPDATE hotel_rooms hr 
JOIN room_categories rc ON hr.room_type = rc.category_code 
SET hr.category_id = rc.id;

-- Create room availability view
DROP VIEW IF EXISTS room_availability;
CREATE VIEW room_availability AS
SELECT 
    hr.id,
    hr.hotel_name,
    hr.room_number,
    hr.room_type,
    rc.category_name,
    hr.floor_number,
    hr.vip_status,
    hr.smoking_allowed,
    hr.tax_status,
    hr.hit_count,
    hr.room_size,
    hr.bed_type,
    hr.max_occupancy,
    hr.status,
    hr.is_active,
    rc.weekend_rate,
    rc.normal_rate,
    CASE 
        WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN rc.weekend_rate
        ELSE rc.normal_rate
    END as current_rate,
    CASE hr.status
        WHEN 'available' THEN 'Available'
        WHEN 'occupied' THEN 'Occupied'
        WHEN 'maintenance' THEN 'Under Maintenance'
        WHEN 'out_of_order' THEN 'Out of Order'
        ELSE 'Unknown'
    END as status_display,
    hr.created_at,
    hr.updated_at
FROM hotel_rooms hr
LEFT JOIN room_categories rc ON hr.category_id = rc.id
WHERE hr.is_active = TRUE
ORDER BY hr.floor_number, hr.room_number;

-- Show results
SELECT 'MIGRATION COMPLETED!' as status, COUNT(*) as total_rooms FROM hotel_rooms;
SELECT 'ROOM CATEGORIES ADDED!' as status, COUNT(*) as total_categories FROM room_categories;
SELECT 'ROOM AVAILABILITY VIEW CREATED!' as status, COUNT(*) as total_available_rooms FROM room_availability;