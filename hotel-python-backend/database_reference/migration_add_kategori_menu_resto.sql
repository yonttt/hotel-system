/*
 * MIGRATION: Add Kategori Menu Resto (Restaurant Menu Category) for Food & Beverage
 * 
 * This migration creates the kategori_menu_resto table for menu category management
 * 
 * USAGE:
 * 1. Open phpMyAdmin
 * 2. Select database 'hotel_system'
 * 3. Import this file
 */

USE hotel_system;

-- Drop table if exists
DROP TABLE IF EXISTS kategori_menu_resto;

-- Create kategori_menu_resto table
CREATE TABLE kategori_menu_resto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT DEFAULT 1,
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    nama_kategori VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_hotel_kategori (hotel_id, nama_kategori)
);

-- Insert sample data (7 categories as shown in the screenshot)
INSERT INTO kategori_menu_resto (hotel_id, hotel_name, nama_kategori) VALUES
(1, 'HOTEL NEW IDOLA', 'Idola Cafe'),
(1, 'HOTEL NEW IDOLA', 'Paket'),
(1, 'HOTEL NEW IDOLA', 'Go Food'),
(1, 'HOTEL NEW IDOLA', 'Pahe'),
(1, 'HOTEL NEW IDOLA', 'Drugstore'),
(1, 'HOTEL NEW IDOLA', 'Beverage'),
(1, 'HOTEL NEW IDOLA', 'Food');

-- Verify the data
SELECT * FROM kategori_menu_resto ORDER BY id;
