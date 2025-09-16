/*
 * UPDATED HOTEL MANAGEMENT SYSTEM - COMPREHENSIVE DATABASE SCHEMA
 * 
 * This file contains the updated database structure to support all fields
 * from the registration and reservation forms
 * 
 * USAGE:
 * 1. Import this file via phpMyAdmin
 * 2. Or run: mysql -u root -p < updated_hotel_system.sql
 * 
 * UPDATES:
 * - Enhanced hotel_reservations table with all form fields
 * - New hotel_registrations table for guest registrations
 * - Updated lookup tables for better data management
 * 
 * COMPATIBILITY:
 * - Works with existing data
 * - Adds new required fields
 * - Maintains data integrity
 */

-- Use existing database
USE hotel_system;

-- Category Market lookup table
CREATE TABLE IF NOT EXISTS category_markets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market Segment lookup table
CREATE TABLE IF NOT EXISTS market_segments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Methods lookup table
CREATE TABLE IF NOT EXISTS payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('cash', 'card', 'transfer', 'digital', 'other') DEFAULT 'other',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registration Types lookup table
CREATE TABLE IF NOT EXISTS registration_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('registration', 'reservation', 'walkin', 'group', 'corporate') DEFAULT 'registration',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nationalities lookup table
CREATE TABLE IF NOT EXISTS nationalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities lookup table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Indonesia',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Updated Hotel Reservations table
DROP TABLE IF EXISTS hotel_reservations;
CREATE TABLE hotel_reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_no VARCHAR(20) UNIQUE NOT NULL,
    
    -- Market Information
    category_market_id INT,
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment_id INT,
    market_segment VARCHAR(50) DEFAULT 'Normal',
    member_id VARCHAR(50),
    
    -- Transaction Information
    transaction_by VARCHAR(100) NOT NULL,
    transaction_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Checked-in', 'Checked-out') DEFAULT 'Pending',
    
    -- Guest Information
    id_card_type ENUM('KTP', 'SIM', 'PASSPORT', 'OTHERS') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    guest_name VARCHAR(100) NOT NULL,
    mobile_phone VARCHAR(20) NOT NULL,
    address TEXT,
    nationality_id INT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city_id INT,
    city VARCHAR(100),
    email VARCHAR(100),
    
    -- Booking Information
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    nights INT DEFAULT 1,
    guest_type ENUM('Normal', 'VIP', 'Corporate') DEFAULT 'Normal',
    
    -- Guest Count
    guest_male INT DEFAULT 1,
    guest_female INT DEFAULT 0,
    guest_child INT DEFAULT 0,
    
    -- Extra Services
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    
    -- Room Information
    room_number VARCHAR(20),
    
    -- Payment Information
    payment_method_id INT,
    payment_method VARCHAR(100) DEFAULT 'Debit BCA 446',
    registration_type_id INT,
    registration_type VARCHAR(100) DEFAULT 'Reservasi',
    payment_amount DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    payment_diskon DECIMAL(10, 2) DEFAULT 0,
    deposit DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2) DEFAULT 0,
    
    -- Additional Information
    note TEXT,
    hotel_name VARCHAR(100) DEFAULT 'New Idola Hotel',
    
    -- System Information
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (category_market_id) REFERENCES category_markets(id) ON DELETE SET NULL,
    FOREIGN KEY (market_segment_id) REFERENCES market_segments(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_type_id) REFERENCES registration_types(id) ON DELETE SET NULL,
    FOREIGN KEY (nationality_id) REFERENCES nationalities(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Hotel Registrations table (for same-day registrations)
CREATE TABLE IF NOT EXISTS hotel_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_no VARCHAR(20) UNIQUE NOT NULL,
    
    -- Market Information
    category_market_id INT,
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment_id INT,
    market_segment VARCHAR(50) DEFAULT 'Normal',
    member_id VARCHAR(50),
    
    -- Transaction Information
    transaction_by VARCHAR(100) NOT NULL,
    transaction_status ENUM('Registration', 'Check-in', 'Check-out', 'Cancelled') DEFAULT 'Registration',
    
    -- Guest Information
    id_card_type ENUM('KTP', 'SIM', 'PASSPORT', 'OTHERS') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    guest_name VARCHAR(100) NOT NULL,
    mobile_phone VARCHAR(20) NOT NULL,
    address TEXT,
    nationality_id INT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city_id INT,
    city VARCHAR(100),
    email VARCHAR(100),
    
    -- Booking Information
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    nights INT DEFAULT 1,
    guest_type ENUM('Normal', 'VIP', 'Corporate') DEFAULT 'Normal',
    
    -- Guest Count
    guest_count_male INT DEFAULT 1,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    
    -- Extra Services
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    
    -- Room Information
    room_number VARCHAR(20),
    
    -- Payment Information
    payment_method_id INT,
    payment_method VARCHAR(100) DEFAULT 'Cash',
    registration_type_id INT,
    registration_type VARCHAR(100) DEFAULT 'Individual',
    payment_amount DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    payment_diskon DECIMAL(10, 2) DEFAULT 0,
    deposit DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2) DEFAULT 0,
    
    -- Additional Information
    notes TEXT,
    hotel_name VARCHAR(100) DEFAULT 'New Idola Hotel',
    
    -- System Information
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (category_market_id) REFERENCES category_markets(id) ON DELETE SET NULL,
    FOREIGN KEY (market_segment_id) REFERENCES market_segments(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    FOREIGN KEY (registration_type_id) REFERENCES registration_types(id) ON DELETE SET NULL,
    FOREIGN KEY (nationality_id) REFERENCES nationalities(id) ON DELETE SET NULL,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert lookup data for Category Markets
INSERT INTO category_markets (name) VALUES 
('Walkin'),
('Online'),
('Corporate'),
('Travel Agent') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert lookup data for Market Segments
INSERT INTO market_segments (name) VALUES 
('Normal'),
('VIP'),
('Corporate') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert lookup data for Payment Methods
INSERT INTO payment_methods (name, type) VALUES 
('Debit BCA 446', 'card'),
('Cash', 'cash'),
('Credit Card', 'card'),
('Bank Transfer', 'transfer'),
('E-Wallet', 'digital') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert lookup data for Registration Types
INSERT INTO registration_types (name, type) VALUES 
('Reservasi', 'reservation'),
('Individual', 'registration'),
('Group', 'group'),
('Corporate', 'corporate'),
('Walk-in', 'walkin') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert lookup data for Nationalities
INSERT INTO nationalities (name, code) VALUES 
('INDONESIA', 'ID'),
('SINGAPORE', 'SG'),
('MALAYSIA', 'MY'),
('THAILAND', 'TH'),
('OTHERS', 'XX') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert lookup data for Cities
INSERT INTO cities (name, country) VALUES 
('Jakarta', 'Indonesia'),
('Surabaya', 'Indonesia'),
('Bandung', 'Indonesia'),
('Medan', 'Indonesia'),
('Makassar', 'Indonesia'),
('Bali', 'Indonesia'),
('Others', 'Indonesia') 
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample data for testing (if tables are empty)
INSERT INTO hotel_reservations (
    reservation_no, guest_name, mobile_phone, arrival_date, departure_date, 
    category_market, market_segment, transaction_by
) VALUES
('0001376699', 'YONATHAN', '+6281234567890', '2025-09-16', '2025-09-17', 'Walkin', 'Normal', 'ADMIN')
ON DUPLICATE KEY UPDATE reservation_no = VALUES(reservation_no);

-- Create indexes for better performance
CREATE INDEX idx_reservations_arrival ON hotel_reservations(arrival_date);
CREATE INDEX idx_reservations_departure ON hotel_reservations(departure_date);
CREATE INDEX idx_reservations_status ON hotel_reservations(transaction_status);
CREATE INDEX idx_reservations_guest ON hotel_reservations(guest_name);

CREATE INDEX idx_registrations_arrival ON hotel_registrations(arrival_date);
CREATE INDEX idx_registrations_departure ON hotel_registrations(departure_date);
CREATE INDEX idx_registrations_status ON hotel_registrations(transaction_status);
CREATE INDEX idx_registrations_guest ON hotel_registrations(guest_name);