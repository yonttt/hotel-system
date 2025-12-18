/*
 * MIGRATION: Add Master Meja (Table Management) for Food & Beverage
 * 
 * This migration creates the master_meja table for restaurant table management
 * 
 * USAGE:
 * 1. Open phpMyAdmin
 * 2. Select database 'hotel_system'
 * 3. Import this file
 */

USE hotel_system;

-- Drop table if exists
DROP TABLE IF EXISTS master_meja;

-- Create master_meja table
CREATE TABLE master_meja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT DEFAULT 1,
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    no_meja VARCHAR(20) NOT NULL,
    lantai INT NOT NULL DEFAULT 1,
    kursi INT NOT NULL DEFAULT 4,
    status ENUM('Tersedia', 'Terpakai', 'Reserved', 'Maintenance') DEFAULT 'Tersedia',
    hit INT DEFAULT 0,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_hotel_meja (hotel_id, no_meja)
);

-- Insert sample data (28 tables as shown in the screenshots)
INSERT INTO master_meja (hotel_id, hotel_name, no_meja, lantai, kursi, status, hit) VALUES
(1, 'HOTEL NEW IDOLA', '30', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '29', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '28', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '27', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '26', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '25', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '24', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '23', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '22', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '21', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '20', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '19', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '18', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '17', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '16', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '15', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '14', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '13', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '12', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '11', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '10', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '09', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '08', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '07', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '06', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '05', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '04', 1, 4, 'Tersedia', 0),
(1, 'HOTEL NEW IDOLA', '03', 1, 4, 'Tersedia', 0);

-- Verify the data
SELECT * FROM master_meja ORDER BY CAST(no_meja AS UNSIGNED) DESC;
