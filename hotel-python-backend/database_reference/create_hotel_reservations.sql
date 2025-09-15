/*
 * HOTEL RESERVATIONS TABLE CREATION
 * 
 * This file creates the hotel_reservations table with proper structure
 * 
 * USAGE:
 * - Run this after the main hotel_system.sql
 * - Or import via phpMyAdmin
 * 
 * CREATES:
 * - Table: hotel_reservations (comprehensive reservation data)
 * 
 * USED BY:
 * - Frontend/modules/frontoffice/form/reservation.php
 * - Frontend/modules/frontoffice/informasi_reservasi/*.php
 * - All reservation-related frontend modules
 */

-- Create new table for hotel reservations with proper structure
CREATE TABLE IF NOT EXISTS hotel_reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_no VARCHAR(20) UNIQUE NOT NULL,
    category_market VARCHAR(50) DEFAULT 'Walkin',
    market_segment VARCHAR(50) DEFAULT 'Normal',
    member_id VARCHAR(50),
    transaction_by VARCHAR(100),
    id_card_type ENUM('KTP', 'SIM', 'PASSPORT', 'OTHERS') DEFAULT 'KTP',
    id_card_number VARCHAR(50),
    guest_title ENUM('MR', 'MRS', 'MS', 'DR', 'PROF') DEFAULT 'MR',
    guest_name VARCHAR(100) NOT NULL,
    mobile_phone VARCHAR(20) NOT NULL,
    address TEXT,
    nationality VARCHAR(50) DEFAULT 'INDONESIA',
    city VARCHAR(100),
    email VARCHAR(100),
    arrival_date DATE NOT NULL,
    nights INT DEFAULT 1,
    departure_date DATE NOT NULL,
    guest_type ENUM('Normal', 'VIP', 'Corporate') DEFAULT 'Normal',
    guest_male INT DEFAULT 1,
    guest_female INT DEFAULT 0,
    guest_child INT DEFAULT 0,
    extra_bed_nights INT DEFAULT 0,
    extra_bed_qty INT DEFAULT 0,
    room_number VARCHAR(20),
    transaction_status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'Debit BCA 446',
    registration_type ENUM('Reservasi', 'Walkin', 'Group') DEFAULT 'Reservasi',
    note TEXT,
    payment_amount DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    payment_diskon DECIMAL(10, 2) DEFAULT 0,
    deposit DECIMAL(10, 2) DEFAULT 0,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data for testing
INSERT INTO hotel_reservations (reservation_no, guest_name, mobile_phone, arrival_date, departure_date) VALUES
('0000000001', 'John Doe', '+6281234567890', '2025-09-04', '2025-09-05'),
('0000000002', 'Jane Smith', '+6281234567891', '2025-09-05', '2025-09-07');

CREATE TABLE `reservation_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- You can add more reservation types here as needed.
INSERT INTO `reservation_types` (`name`) VALUES
('Standard Reservation'),
('Guaranteed'),
('Corporate');