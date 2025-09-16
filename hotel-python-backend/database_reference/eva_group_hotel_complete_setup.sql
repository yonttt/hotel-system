/*
 * EVA GROUP HOTEL MANAGEMENT SYSTEM - COMPLETE DATABASE SETUP
 * 
 * This is the complete, unified database structure for the hotel management system
 * 
 * FEATURES:
 * - All tables with proper relationships
 * - Foreign key constraints
 * - Sample data for all lookup tables
 * - Clean 10-digit numbering system
 * - Modern hotel management requirements
 * 
 * USAGE:
 * 1. Open phpMyAdmin
 * 2. Create/Select database 'hotel_system'
 * 3. Import this entire file
 * 4. All tables and data will be created automatically
 * 
 * CREATED: September 2025
 * VERSION: 3.0 - Unified Complete Setup
 */

-- Create database
CREATE DATABASE IF NOT EXISTS hotel_system;
USE hotel_system;

-- Drop existing tables in correct order (foreign keys first)
DROP TABLE IF EXISTS hotel_reservations;
DROP TABLE IF EXISTS hotel_registrations;
DROP TABLE IF EXISTS guest_registrations;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS master_meja;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS registration_types;
DROP TABLE IF EXISTS market_segments;
DROP TABLE IF EXISTS category_markets;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS nationalities;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) UNIQUE NOT NULL,
    room_type ENUM('Standard', 'Deluxe', 'Suite', 'Presidential') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
    description TEXT,
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nationalities lookup table
CREATE TABLE nationalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities lookup table
CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Indonesia',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category Market lookup table
CREATE TABLE category_markets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Segment lookup table
CREATE TABLE market_segments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods lookup table
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('cash', 'card', 'transfer', 'digital', 'other') DEFAULT 'other',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registration Types lookup table
CREATE TABLE registration_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guests table
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_name VARCHAR(100) NOT NULL,
    id_card_type ENUM('KTP', 'Passport', 'SIM', 'Other') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    mobile_phone VARCHAR(20),
    address TEXT,
    nationality_id INT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city_id INT,
    city VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nationality_id) REFERENCES nationalities(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

-- Hotel Registrations table (Main registration system)
CREATE TABLE hotel_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    category_market_id INT,
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment_id INT,
    market_segment VARCHAR(50) DEFAULT 'Normal',
    member_id VARCHAR(50),
    transaction_by VARCHAR(100),
    id_card_type ENUM('KTP', 'Passport', 'SIM', 'Other') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_name VARCHAR(100) NOT NULL,
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    mobile_phone VARCHAR(20),
    address TEXT,
    nationality_id INT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city_id INT,
    city VARCHAR(100),
    email VARCHAR(100),
    arrival_date DATETIME,
    departure_date DATETIME,
    nights INT DEFAULT 1,
    guest_type ENUM('Normal', 'VIP', 'Corporate', 'Group') DEFAULT 'Normal',
    guest_count_male INT DEFAULT 1,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    room_number VARCHAR(20),
    transaction_status ENUM('Registration', 'Check-in', 'Check-out', 'Cancelled') DEFAULT 'Registration',
    payment_method_id INT,
    payment_method VARCHAR(100),
    registration_type_id INT,
    registration_type VARCHAR(100),
    notes TEXT,
    payment_amount DECIMAL(15, 2) DEFAULT 0.00,
    discount DECIMAL(15, 2) DEFAULT 0.00,
    payment_diskon DECIMAL(15, 2) DEFAULT 0.00,
    deposit DECIMAL(15, 2) DEFAULT 0.00,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_market_id) REFERENCES category_markets(id) ON DELETE SET NULL,
    FOREIGN KEY (market_segment_id) REFERENCES market_segments(id) ON DELETE SET NULL,
    FOREIGN KEY (nationality_id) REFERENCES nationalities(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_type_id) REFERENCES registration_types(id) ON DELETE SET NULL
);

-- Hotel Reservations table (Future bookings)
CREATE TABLE hotel_reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_no VARCHAR(20) UNIQUE NOT NULL,
    category_market_id INT,
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment_id INT,
    market_segment VARCHAR(50) DEFAULT 'Normal',
    member_id VARCHAR(50),
    transaction_by VARCHAR(100),
    id_card_type ENUM('KTP', 'Passport', 'SIM', 'Other') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_name VARCHAR(100) NOT NULL,
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    mobile_phone VARCHAR(20),
    address TEXT,
    nationality_id INT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city_id INT,
    city VARCHAR(100),
    email VARCHAR(100),
    arrival_date DATETIME,
    departure_date DATETIME,
    nights INT DEFAULT 1,
    guest_type ENUM('Normal', 'VIP', 'Corporate', 'Group') DEFAULT 'Normal',
    guest_count_male INT DEFAULT 1,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    room_number VARCHAR(20),
    transaction_status ENUM('Reservation', 'Confirmed', 'Check-in', 'Check-out', 'Cancelled') DEFAULT 'Reservation',
    payment_method_id INT,
    payment_method VARCHAR(100),
    registration_type_id INT,
    registration_type VARCHAR(100),
    notes TEXT,
    payment_amount DECIMAL(15, 2) DEFAULT 0.00,
    discount DECIMAL(15, 2) DEFAULT 0.00,
    payment_diskon DECIMAL(15, 2) DEFAULT 0.00,
    deposit DECIMAL(15, 2) DEFAULT 0.00,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_market_id) REFERENCES category_markets(id) ON DELETE SET NULL,
    FOREIGN KEY (market_segment_id) REFERENCES market_segments(id) ON DELETE SET NULL,
    FOREIGN KEY (nationality_id) REFERENCES nationalities(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_type_id) REFERENCES registration_types(id) ON DELETE SET NULL
);

-- Services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('food', 'laundry', 'spa', 'transport', 'other') DEFAULT 'other',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings table
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Master Meja table for Food & Beverage
CREATE TABLE master_meja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_cabang VARCHAR(100) NOT NULL DEFAULT 'HOTEL NEW IDOLA',
    no_meja VARCHAR(10) UNIQUE NOT NULL,
    lantai INT NOT NULL DEFAULT 1,
    kursi INT NOT NULL DEFAULT 4,
    status ENUM('Kosong', 'Terisi', 'Maintenance') DEFAULT 'Kosong',
    hit INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert default admin users
INSERT INTO users (username, password, email, role) VALUES 
('admin', 'admin123', 'admin@evagrouphotel.com', 'admin'),
('manager', 'manager123', 'manager@evagrouphotel.com', 'manager'),
('staff', 'staff123', 'staff@evagrouphotel.com', 'staff'),
('system', 'yont29921', 'system@evagrouphotel.com', 'admin');

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type, price, status, description) VALUES 
('101', 'Standard', 500000.00, 'available', 'Standard room with city view'),
('102', 'Standard', 500000.00, 'available', 'Standard room with city view'),
('103', 'Standard', 500000.00, 'available', 'Standard room with city view'),
('201', 'Deluxe', 750000.00, 'available', 'Deluxe room with garden view'),
('202', 'Deluxe', 750000.00, 'available', 'Deluxe room with garden view'),
('203', 'Deluxe', 750000.00, 'available', 'Deluxe room with garden view'),
('301', 'Suite', 1200000.00, 'available', 'Junior suite with living area'),
('302', 'Suite', 1200000.00, 'available', 'Junior suite with living area'),
('401', 'Presidential', 2500000.00, 'available', 'Presidential suite with panoramic view');

-- Insert nationalities/countries
INSERT INTO nationalities (name, code) VALUES 
('INDONESIA', 'ID'),
('SINGAPORE', 'SG'),
('MALAYSIA', 'MY'),
('THAILAND', 'TH'),
('PHILIPPINES', 'PH'),
('VIETNAM', 'VN'),
('CAMBODIA', 'KH'),
('LAOS', 'LA'),
('MYANMAR', 'MM'),
('BRUNEI', 'BN'),
('UNITED STATES', 'US'),
('UNITED KINGDOM', 'GB'),
('AUSTRALIA', 'AU'),
('CANADA', 'CA'),
('GERMANY', 'DE'),
('FRANCE', 'FR'),
('JAPAN', 'JP'),
('SOUTH KOREA', 'KR'),
('CHINA', 'CN'),
('INDIA', 'IN'),
('NETHERLANDS', 'NL'),
('ITALY', 'IT'),
('SPAIN', 'ES'),
('BRAZIL', 'BR'),
('MEXICO', 'MX'),
('ARGENTINA', 'AR'),
('CHILE', 'CL'),
('PERU', 'PE'),
('COLOMBIA', 'CO'),
('VENEZUELA', 'VE'),
('OTHERS', 'XX');

-- Insert Indonesian cities
INSERT INTO cities (name, country) VALUES 
('Jakarta', 'Indonesia'),
('Surabaya', 'Indonesia'),
('Bandung', 'Indonesia'),
('Medan', 'Indonesia'),
('Semarang', 'Indonesia'),
('Makassar', 'Indonesia'),
('Palembang', 'Indonesia'),
('Tangerang', 'Indonesia'),
('Bekasi', 'Indonesia'),
('Depok', 'Indonesia'),
('Padang', 'Indonesia'),
('Denpasar', 'Indonesia'),
('Malang', 'Indonesia'),
('Samarinda', 'Indonesia'),
('Banjarmasin', 'Indonesia'),
('Tasikmalaya', 'Indonesia'),
('Pontianak', 'Indonesia'),
('Cimahi', 'Indonesia'),
('Balikpapan', 'Indonesia'),
('Jambi', 'Indonesia'),
('Surakarta', 'Indonesia'),
('Manado', 'Indonesia'),
('Yogyakarta', 'Indonesia'),
('Pekanbaru', 'Indonesia'),
('Bengkulu', 'Indonesia'),
('Dumai', 'Indonesia'),
('Sukabumi', 'Indonesia'),
('Cirebon', 'Indonesia'),
('Mataram', 'Indonesia'),
('Jayapura', 'Indonesia'),
('Others', 'Indonesia');

-- Insert category markets
INSERT INTO category_markets (name) VALUES 
('Walkin'),
('Online Booking'),
('Travel Agent'),
('Corporate'),
('Government'),
('Family Package'),
('Group Booking'),
('Staff Rate'),
('Owner'),
('VIP Guest'),
('Loyalty Member'),
('Wedding Package'),
('Conference Package'),
('Long Stay'),
('Emergency Rate'),
('Special Case'),
('Promotional Rate'),
('Seasonal Package'),
('Weekend Package'),
('Weekday Package');

-- Insert market segments
INSERT INTO market_segments (name) VALUES 
('Normal'),
('VIP'),
('Corporate'),
('Government'),
('Tourism'),
('Business'),
('Family'),
('Group'),
('Individual'),
('Couple'),
('Honeymoon'),
('Conference'),
('Meeting'),
('Event'),
('Wedding'),
('Birthday'),
('Anniversary'),
('Holiday'),
('Weekend'),
('Extended Stay');

-- Insert payment methods
INSERT INTO payment_methods (name, type) VALUES 
('Cash', 'cash'),
('Credit Card', 'card'),
('Debit Card', 'card'),
('Bank Transfer', 'transfer'),
('Mobile Banking', 'digital'),
('E-Wallet', 'digital'),
('QRIS', 'digital'),
('OVO', 'digital'),
('GoPay', 'digital'),
('DANA', 'digital'),
('LinkAja', 'digital'),
('ShopeePay', 'digital'),
('PayPal', 'digital'),
('Crypto', 'digital'),
('Check', 'other'),
('Voucher', 'other'),
('Complimentary', 'other'),
('Credit', 'other');

-- Insert registration types
INSERT INTO registration_types (name) VALUES 
('Walk-in'),
('Online Reservation'),
('Phone Booking'),
('Email Booking'),
('Travel Agent'),
('Corporate Booking'),
('Group Reservation'),
('Event Booking'),
('Conference Booking'),
('Wedding Booking'),
('Emergency Booking'),
('Staff Booking'),
('VIP Booking'),
('Loyalty Program'),
('Promotional Booking'),
('Package Deal'),
('Extended Stay'),
('Transit Stay'),
('Government Booking'),
('Diplomatic Booking');

-- Insert system settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('hotel_name', 'Eva Group Hotel Management', 'Hotel name displayed in system'),
('check_in_time', '15:00', 'Default check-in time'),
('check_out_time', '11:00', 'Default check-out time'),
('currency', 'IDR', 'System currency'),
('tax_rate', '10.00', 'Tax percentage applied to bookings'),
('service_charge', '5.00', 'Service charge percentage'),
('cancellation_policy', '24 hours before arrival', 'Hotel cancellation policy'),
('max_occupancy', '4', 'Maximum guests per room'),
('advance_booking_days', '365', 'Maximum days for advance booking'),
('minimum_stay', '1', 'Minimum nights stay requirement');

-- Insert sample services
INSERT INTO services (name, description, price, category) VALUES 
('Room Service', 'In-room dining service', 50000.00, 'food'),
('Laundry Service', 'Same day laundry service', 25000.00, 'laundry'),
('Spa Treatment', 'Relaxing spa treatment', 200000.00, 'spa'),
('Airport Transfer', 'Airport pickup/drop service', 150000.00, 'transport'),
('Extra Bed', 'Additional bed in room', 100000.00, 'other'),
('Breakfast', 'Continental breakfast', 75000.00, 'food'),
('Parking', 'Secure parking space', 25000.00, 'other'),
('WiFi Premium', 'High-speed internet access', 30000.00, 'other'),
('Minibar', 'In-room minibar service', 40000.00, 'food'),
('Late Checkout', 'Extended checkout service', 100000.00, 'other');

-- Insert sample master meja (Food & Beverage tables)
INSERT INTO master_meja (nama_cabang, no_meja, lantai, kursi, status) VALUES
('EVA GROUP HOTEL', '001', 1, 4, 'Kosong'),
('EVA GROUP HOTEL', '002', 1, 4, 'Kosong'),
('EVA GROUP HOTEL', '003', 1, 4, 'Kosong'),
('EVA GROUP HOTEL', '004', 1, 4, 'Kosong'),
('EVA GROUP HOTEL', '005', 1, 6, 'Kosong'),
('EVA GROUP HOTEL', '006', 1, 6, 'Kosong'),
('EVA GROUP HOTEL', '007', 1, 6, 'Kosong'),
('EVA GROUP HOTEL', '008', 1, 8, 'Kosong'),
('EVA GROUP HOTEL', '009', 2, 4, 'Kosong'),
('EVA GROUP HOTEL', '010', 2, 4, 'Kosong'),
('EVA GROUP HOTEL', '011', 2, 6, 'Kosong'),
('EVA GROUP HOTEL', '012', 2, 8, 'Kosong'),
('EVA GROUP HOTEL', 'VIP1', 3, 10, 'Kosong'),
('EVA GROUP HOTEL', 'VIP2', 3, 12, 'Kosong'),
('EVA GROUP HOTEL', 'BAR1', 1, 2, 'Kosong'),
('EVA GROUP HOTEL', 'BAR2', 1, 2, 'Kosong');

-- ============================================================================
-- FINAL STATUS MESSAGE
-- ============================================================================

SELECT 'Eva Group Hotel Management Database Setup Complete!' as Status,
       'All tables created successfully' as Tables,
       'Sample data inserted' as Data,
       'Ready for use!' as Message;

-- Show tables created
SHOW TABLES;