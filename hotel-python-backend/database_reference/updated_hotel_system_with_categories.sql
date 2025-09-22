/*
 * HOTEL MANAGEMENT SYSTEM - UPDATED DATABASE SCHEMA WITH ROOM CATEGORIES
 * 
 * This file contains the complete database structure including the new room categories table
 * 
 * USAGE:
 * 1. Import this file via phpMyAdmin after backing up existing data
 * 2. Or run: mysql -u root -p < updated_hotel_system.sql
 * 
 * UPDATES:
 * - Added room_categories table with pricing structure
 * - Modified rooms table to reference room_categories
 * - Added proper foreign key relationships
 */

-- Use existing database
USE hotel_system;

-- Room Categories table (NEW)
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

-- Insert the room categories from the interface
INSERT INTO room_categories (code, type, normal_rate, weekend_rate, description, max_occupancy, created_by) VALUES
('EXE', 'Executive', 345.000, 355.000, 'Executive room category with premium amenities and city view', 2, 'system'),
('SPR', 'Superior', 325.000, 335.000, 'Superior room category with enhanced features and modern decor', 2, 'system'),
('DLX', 'Deluxe', 295.000, 305.000, 'Deluxe room category with comfortable accommodations and garden view', 2, 'system'),
('STD', 'Standard', 265.000, 275.000, 'Standard room category with basic amenities and essential comfort', 2, 'system'),
('BIS', 'Business', 190.000, 200.000, 'Business room category designed for corporate guests with work facilities', 1, 'system'),
('APT', 'Apartemen', 360.000, 370.000, 'Apartment style accommodation with kitchen facilities and living area', 4, 'system'),
('APT DLX', 'APT DLX', 1000.000, 1000.000, 'Deluxe apartment with premium facilities, full kitchen, and premium services', 6, 'system');

-- Update existing rooms table to add category_id (if not exists)
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS category_id INT,
ADD COLUMN IF NOT EXISTS floor_number INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS bed_type VARCHAR(50) DEFAULT 'Double',
ADD COLUMN IF NOT EXISTS view_type VARCHAR(50) DEFAULT 'City',
ADD FOREIGN KEY (category_id) REFERENCES room_categories(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_categories_code ON room_categories(code);
CREATE INDEX IF NOT EXISTS idx_room_categories_type ON room_categories(type);
CREATE INDEX IF NOT EXISTS idx_room_categories_active ON room_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_category ON rooms(category_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

-- Create a view for active room categories with current rates
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

-- Create a view for room inventory with category details
CREATE OR REPLACE VIEW room_inventory AS
SELECT 
    r.id,
    r.room_number,
    r.status,
    r.floor_number,
    r.bed_type,
    r.view_type,
    rc.code as category_code,
    rc.type as category_type,
    rc.normal_rate,
    rc.weekend_rate,
    rc.max_occupancy,
    rc.amenities,
    CASE 
        WHEN DAYOFWEEK(CURDATE()) IN (1, 7) THEN rc.weekend_rate 
        ELSE rc.normal_rate 
    END as current_rate
FROM rooms r
LEFT JOIN room_categories rc ON r.category_id = rc.id
WHERE rc.is_active = TRUE OR rc.is_active IS NULL
ORDER BY r.room_number;

-- Sample rooms data to match categories (if rooms table is empty)
INSERT IGNORE INTO rooms (room_number, category_id, status, floor_number, bed_type, view_type) 
SELECT 
    CONCAT(LPAD(seq.n, 3, '0')), 
    rc.id,
    'available',
    CASE WHEN seq.n <= 50 THEN 1 WHEN seq.n <= 100 THEN 2 ELSE 3 END,
    CASE rc.code 
        WHEN 'BIS' THEN 'Single'
        WHEN 'APT' THEN 'King'
        WHEN 'APT DLX' THEN 'King'
        ELSE 'Double'
    END,
    CASE 
        WHEN seq.n % 4 = 0 THEN 'Ocean View'
        WHEN seq.n % 3 = 0 THEN 'Garden View'
        ELSE 'City View'
    END
FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t2,
     (SELECT @row:=0) r WHERE @row < 30) seq
CROSS JOIN room_categories rc
WHERE rc.is_active = TRUE
ORDER BY RAND()
LIMIT 50;