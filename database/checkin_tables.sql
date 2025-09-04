-- Additional tables for Check-in Guest Registration Form
-- This extends the existing hotel_system database

USE hotel_system;

-- Market Segments table
CREATE TABLE IF NOT EXISTS market_segments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default market segments
INSERT IGNORE INTO market_segments (name, description) VALUES 
('Walkin', 'Walk-in guests without prior reservation'),
('Corporate', 'Corporate bookings and business travelers'),
('Travel Agent', 'Bookings through travel agents'),
('Online', 'Online booking platforms'),
('Group', 'Group bookings and events');

-- Registration Types table
CREATE TABLE IF NOT EXISTS registration_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default registration types
INSERT IGNORE INTO registration_types (name, description) VALUES 
('Registration', 'Standard room registration'),
('Walk-in', 'Walk-in guest registration'),
('Advance', 'Advance booking registration'),
('Group', 'Group registration');

-- Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default payment methods
INSERT IGNORE INTO payment_methods (name, code, description) VALUES 
('Cash', 'CASH', 'Cash payment'),
('Debit BCA 446', 'DEBIT_BCA', 'BCA Debit Card'),
('Credit Card', 'CC', 'Credit Card payment'),
('Bank Transfer', 'TRANSFER', 'Bank transfer payment'),
('Deposit', 'DEPOSIT', 'Deposit payment');

-- Countries table for nationality
CREATE TABLE IF NOT EXISTS countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(3) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default countries
INSERT IGNORE INTO countries (name, code) VALUES 
('INDONESIA', 'ID'),
('Singapore', 'SG'),
('Malaysia', 'MY'),
('Thailand', 'TH'),
('Philippines', 'PH'),
('United States', 'US'),
('United Kingdom', 'GB'),
('Australia', 'AU'),
('Japan', 'JP'),
('South Korea', 'KR');

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL
);

-- Insert some Indonesian cities
INSERT IGNORE INTO cities (name, country_id) VALUES 
('Jakarta', 1),
('Surabaya', 1),
('Bandung', 1),
('Medan', 1),
('Semarang', 1),
('Palembang', 1),
('Makassar', 1),
('Depok', 1),
('Tangerang', 1),
('Bogor', 1);

-- Enhanced guest registrations table
CREATE TABLE IF NOT EXISTS guest_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    category_market_id INT,
    market_segment VARCHAR(100) DEFAULT 'Normal',
    member_id VARCHAR(50),
    transaction_by VARCHAR(100),
    id_card_type VARCHAR(10) DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_name VARCHAR(200) NOT NULL,
    guest_title VARCHAR(10) DEFAULT 'MR',
    mobile_phone VARCHAR(20),
    address TEXT,
    nationality_id INT,
    city_id INT,
    email VARCHAR(100),
    arrival_date DATE NOT NULL,
    arrival_time TIME,
    nights INT DEFAULT 1,
    departure_date DATE,
    guest_type VARCHAR(50) DEFAULT 'Normal',
    guest_count_male INT DEFAULT 0,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    room_number VARCHAR(20),
    transaction_status VARCHAR(50) DEFAULT 'Registration',
    payment_method_id INT,
    registration_type_id INT,
    notes TEXT,
    payment_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    payment_diskon DECIMAL(12, 2) DEFAULT 0,
    deposit DECIMAL(12, 2) DEFAULT 0,
    balance DECIMAL(12, 2) DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_market_id) REFERENCES market_segments(id) ON DELETE SET NULL,
    FOREIGN KEY (nationality_id) REFERENCES countries(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_type_id) REFERENCES registration_types(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
