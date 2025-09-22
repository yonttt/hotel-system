-- Room Categories Table for Hotel System
-- Based on the room types and rates from the user interface

CREATE TABLE room_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    normal_rate DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    weekend_rate DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Insert the room categories from the image
INSERT INTO room_categories (code, type, normal_rate, weekend_rate, description, created_by) VALUES
('EXE', 'Executive', 345.000, 355.000, 'Executive room category with premium amenities', 'system'),
('SPR', 'Superior', 325.000, 335.000, 'Superior room category with enhanced features', 'system'),
('DLX', 'Deluxe', 295.000, 305.000, 'Deluxe room category with comfortable accommodations', 'system'),
('STD', 'Standard', 265.000, 275.000, 'Standard room category with basic amenities', 'system'),
('BIS', 'Business', 190.000, 200.000, 'Business room category for corporate guests', 'system'),
('APT', 'Apartemen', 360.000, 370.000, 'Apartment style accommodation with kitchen facilities', 'system'),
('APT DLX', 'APT DLX', 1000.000, 1000.000, 'Deluxe apartment with premium facilities and services', 'system');

-- Add indexes for better performance
CREATE INDEX idx_room_categories_code ON room_categories(code);
CREATE INDEX idx_room_categories_type ON room_categories(type);
CREATE INDEX idx_room_categories_active ON room_categories(is_active);

-- Create a view for active room categories
CREATE VIEW active_room_categories AS
SELECT 
    id,
    code,
    type,
    normal_rate,
    weekend_rate,
    description,
    created_at,
    updated_at
FROM room_categories 
WHERE is_active = TRUE
ORDER BY normal_rate DESC;