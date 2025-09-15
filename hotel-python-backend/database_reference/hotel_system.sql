/*
 * HOTEL MANAGEMENT SYSTEM - MAIN DATABASE SCHEMA
 * 
 * This file contains the complete database structure for the hotel management system
 * 
 * USAGE:
 * 1. Import this file via phpMyAdmin
 * 2. Or run: mysql -u root -p < hotel_system.sql
 * 
 * CREATES:
 * - Database: hotel_system
 * - Tables: users, rooms, reservations, guests, etc.
 * 
 * USED BY:
 * - All frontend modules that require database operations
 * - Backend/config/database.php connects to this database
 * - Backend/includes/auth.php uses the users table
 */

-- Create database
CREATE DATABASE IF NOT EXISTS hotel_system;
USE hotel_system;

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

-- Guests table
CREATE TABLE guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    id_number VARCHAR(50),
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_number VARCHAR(20) UNIQUE NOT NULL,
    guest_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    total_amount DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled') DEFAULT 'pending',
    special_requests TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Payments table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer') NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
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

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email, role) VALUES 
('admin', 'admin123', 'admin@newidolahotel.com', 'admin'),
('manager', 'manager123', 'manager@newidolahotel.com', 'manager'),
('staff', 'staff123', 'staff@newidolahotel.com', 'staff');

-- Insert system settings
INSERT INTO settings (setting_key, setting_value, description) VALUES 
('hotel_name', 'Eva Group Hotel Management', 'Hotel name displayed in system'),
('check_in_time', '15:00', 'Default check-in time'),
('check_out_time', '11:00', 'Default check-out time'),
('currency', 'USD', 'System currency'),
('tax_rate', '10.00', 'Tax percentage applied to bookings');

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

-- Insert sample data for Master Meja
INSERT INTO master_meja (nama_cabang, no_meja, lantai, kursi, status, hit) VALUES
('HOTEL NEW IDOLA', '001', 1, 6, 'Terisi', 0),
('HOTEL NEW IDOLA', '002', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '003', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '004', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '005', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '006', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '007', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '008', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '009', 1, 6, 'Kosong', 0),
('HOTEL NEW IDOLA', '06', 2, 2, 'Kosong', 0);
