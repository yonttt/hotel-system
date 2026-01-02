/*
 * CHECKOUT HISTORY DATABASE MIGRATION
 * 
 * This migration creates the checkout_history table to store all checkout records
 * 
 * USAGE:
 * 1. Open phpMyAdmin
 * 2. Select database 'hotel_system'
 * 3. Import this file
 * 
 * CREATED: January 2026
 */

USE hotel_system;

-- Create checkout_history table
CREATE TABLE IF NOT EXISTS checkout_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT,
    registration_no VARCHAR(20),
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    guest_name VARCHAR(100) NOT NULL,
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    id_card_type ENUM('KTP', 'Passport', 'SIM', 'Other') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    mobile_phone VARCHAR(20),
    address TEXT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city VARCHAR(100),
    email VARCHAR(100),
    room_number VARCHAR(20),
    room_type VARCHAR(50),
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment VARCHAR(50) DEFAULT 'Normal',
    guest_type ENUM('Normal', 'VIP', 'Corporate', 'Group') DEFAULT 'Normal',
    arrival_date DATETIME,
    departure_date DATETIME,
    checkout_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    nights INT DEFAULT 1,
    guest_count_male INT DEFAULT 1,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    payment_method VARCHAR(100),
    payment_amount DECIMAL(15, 2) DEFAULT 0.00,
    discount DECIMAL(15, 2) DEFAULT 0.00,
    deposit DECIMAL(15, 2) DEFAULT 0.00,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    total_charge DECIMAL(15, 2) DEFAULT 0.00,
    checkout_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES hotel_registrations(id) ON DELETE SET NULL
);

-- Add index for faster queries
CREATE INDEX idx_checkout_date ON checkout_history(checkout_date);
CREATE INDEX idx_hotel_name ON checkout_history(hotel_name);
CREATE INDEX idx_guest_name ON checkout_history(guest_name);
CREATE INDEX idx_room_number ON checkout_history(room_number);

-- Add hotel_name column to hotel_registrations if not exists
ALTER TABLE hotel_registrations 
ADD COLUMN IF NOT EXISTS hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA' AFTER id;
