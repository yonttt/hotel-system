-- Migration: Add Revenue Reports Tables
-- Description: Creates tables for tracking hotel and non-hotel revenue summaries
-- Date: 2025-11-26

-- Table for Hotel Revenue Summary
CREATE TABLE IF NOT EXISTS hotel_revenue_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    available_rooms INT DEFAULT 0,
    room_sales INT DEFAULT 0,
    occupancy_rate VARCHAR(10) DEFAULT '0%',
    arr DECIMAL(15,2) DEFAULT 0,
    revenue_from_na DECIMAL(15,2) DEFAULT 0,
    total_cash DECIMAL(15,2) DEFAULT 0,
    collection DECIMAL(15,2) DEFAULT 0,
    bank_distribution DECIMAL(15,2) DEFAULT 0,
    balance DECIMAL(15,2) DEFAULT 0,
    operational_expense DECIMAL(15,2) DEFAULT 0,
    non_operational_expense DECIMAL(15,2) DEFAULT 0,
    owner_receive_expense DECIMAL(15,2) DEFAULT 0,
    total_expense DECIMAL(15,2) DEFAULT 0,
    net_income DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_hotel_date (hotel_id, report_date),
    INDEX idx_report_date (report_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for Non-Hotel Revenue Summary
CREATE TABLE IF NOT EXISTS non_hotel_revenue_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    report_date DATE NOT NULL,
    revenue_from_na DECIMAL(15,2) DEFAULT 0,
    total_cash DECIMAL(15,2) DEFAULT 0,
    collection DECIMAL(15,2) DEFAULT 0,
    bank_distribution DECIMAL(15,2) DEFAULT 0,
    balance DECIMAL(15,2) DEFAULT 0,
    operational_expense DECIMAL(15,2) DEFAULT 0,
    non_operational_expense DECIMAL(15,2) DEFAULT 0,
    owner_receive_expense DECIMAL(15,2) DEFAULT 0,
    total_expense DECIMAL(15,2) DEFAULT 0,
    net_income DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_unit_date (unit_id, report_date),
    INDEX idx_report_date (report_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for Hotel Revenue (2025-11-26)
INSERT INTO hotel_revenue_summary (hotel_id, hotel_name, report_date, available_rooms, room_sales, occupancy_rate, arr, revenue_from_na, total_cash, collection, bank_distribution, balance, operational_expense, non_operational_expense, owner_receive_expense, total_expense, net_income)
VALUES
(1, 'HOTEL NEW IDOLA', '2025-11-26', 134, 21, '15.67%', 0, 0, -22000, 8411000, 0, 8411000, 0, 0, 0, 0, -22000),
(2, 'HOTEL BENUA', '2025-11-26', 152, 61, '40.13%', 0, 0, 0, 18962000, 0, 18962000, 0, 0, 0, 0, 0),
(3, 'HOTEL SEMERU', '2025-11-26', 76, 29, '38.16%', 0, 0, 0, 10674000, 0, 10674000, 0, 0, 0, 0, 0),
(4, 'HOTEL GHOTIC', '2025-11-26', 74, 16, '21.62%', 0, 0, 0, 2403000, 0, 2403000, 0, 0, 0, 0, 0),
(5, 'HOTEL AMANAH BENUA', '2025-11-26', 68, 8, '11.76%', 0, 0, -285000, 2842000, 0, 2842000, 0, 0, 0, 0, -285000),
(6, 'PENGINAPAN RIO', '2025-11-26', 73, 25, '34.25%', 0, 0, 0, 4692000, 0, 4692000, 0, 0, 0, 0, 0),
(7, 'HOTEL BAMBOO', '2025-11-26', 73, 29, '39.73%', 0, 0, 0, 7001000, 0, 7001000, 0, 0, 0, 0, 0),
(8, 'WISMA DEWI SARTIKA', '2025-11-26', 28, 6, '21.43%', 0, 0, 0, 1302000, 0, 1302000, 705335, 0, 0, 705335, -705335);

-- Insert sample data for Non-Hotel Revenue (2025-11-26)
INSERT INTO non_hotel_revenue_summary (unit_id, unit_name, report_date, revenue_from_na, total_cash, collection, bank_distribution, balance, operational_expense, non_operational_expense, owner_receive_expense, total_expense, net_income)
VALUES
(1, 'LAUNDRY KYNITA BANDUNG', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 'LAUNDRY KYNITA CIREBON', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(3, 'AIR ISI ULANG CI&PI 1 (JKT)', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(4, 'FUTSAL BANDUNG', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 'KOS SETRA MURNI', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 'CCTV PUSAT', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 'MANAGEMENT PUSAT 1', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(8, 'LAUNDRY KYNITA JAKARTA', '2025-11-26', 0, 0, 0, 0, 0, 427660, 0, 0, 427660, -427660),
(9, 'AIR ISI ULANG CI&PI 3 (Fusal BDG)', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(10, 'AIR ISI ULANG CI&PI 4 (Laundry BDG)', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(11, 'AIR ISI ULANG CI&PI 2 (HNI)', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(12, 'REFLEKSI CI&PI 1', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(13, 'MANAGEMENT PUSAT 2', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(14, 'RESTO BAKSO SUBUR KEROBOKAN', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(15, 'KEDAI BINGGO', '2025-11-26', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
