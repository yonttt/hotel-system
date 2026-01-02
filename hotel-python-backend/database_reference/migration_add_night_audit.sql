/*
 * NIGHT AUDIT DATABASE MIGRATION
 * 
 * This migration creates the night_audit table to store night audit records
 * 
 * USAGE:
 * 1. Open phpMyAdmin
 * 2. Select database 'hotel_system'
 * 3. Import this file
 * 
 * CREATED: January 2026
 */

USE hotel_system;

-- Create night_audit table
CREATE TABLE IF NOT EXISTS night_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_date DATE NOT NULL,
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    room_number VARCHAR(20),
    registration_id INT,
    registration_no VARCHAR(20),
    guest_name VARCHAR(100),
    extra_bed DECIMAL(15, 2) DEFAULT 0.00,
    extra_bill DECIMAL(15, 2) DEFAULT 0.00,
    late_charge DECIMAL(15, 2) DEFAULT 0.00,
    discount DECIMAL(15, 2) DEFAULT 0.00,
    meeting_room DECIMAL(15, 2) DEFAULT 0.00,
    add_meeting_room DECIMAL(15, 2) DEFAULT 0.00,
    cash DECIMAL(15, 2) DEFAULT 0.00,
    debet DECIMAL(15, 2) DEFAULT 0.00,
    transfer DECIMAL(15, 2) DEFAULT 0.00,
    voucher DECIMAL(15, 2) DEFAULT 0.00,
    creditcard DECIMAL(15, 2) DEFAULT 0.00,
    guest_ledger_minus DECIMAL(15, 2) DEFAULT 0.00,
    guest_ledger_plus DECIMAL(15, 2) DEFAULT 0.00,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    total_payment DECIMAL(15, 2) DEFAULT 0.00,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registration_id) REFERENCES hotel_registrations(id) ON DELETE SET NULL
);

-- Add indexes for faster queries
CREATE INDEX idx_night_audit_date ON night_audit(audit_date);
CREATE INDEX idx_night_audit_hotel ON night_audit(hotel_name);
CREATE INDEX idx_night_audit_room ON night_audit(room_number);

-- Create night_audit_summary table for daily summaries
CREATE TABLE IF NOT EXISTS night_audit_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    audit_date DATE NOT NULL,
    hotel_name VARCHAR(100) DEFAULT 'HOTEL NEW IDOLA',
    total_rooms_occupied INT DEFAULT 0,
    total_rooms_available INT DEFAULT 0,
    occupancy_rate DECIMAL(5, 2) DEFAULT 0.00,
    total_extra_bed DECIMAL(15, 2) DEFAULT 0.00,
    total_extra_bill DECIMAL(15, 2) DEFAULT 0.00,
    total_late_charge DECIMAL(15, 2) DEFAULT 0.00,
    total_discount DECIMAL(15, 2) DEFAULT 0.00,
    total_meeting_room DECIMAL(15, 2) DEFAULT 0.00,
    total_add_meeting_room DECIMAL(15, 2) DEFAULT 0.00,
    total_cash DECIMAL(15, 2) DEFAULT 0.00,
    total_debet DECIMAL(15, 2) DEFAULT 0.00,
    total_transfer DECIMAL(15, 2) DEFAULT 0.00,
    total_voucher DECIMAL(15, 2) DEFAULT 0.00,
    total_creditcard DECIMAL(15, 2) DEFAULT 0.00,
    total_guest_ledger_minus DECIMAL(15, 2) DEFAULT 0.00,
    total_guest_ledger_plus DECIMAL(15, 2) DEFAULT 0.00,
    grand_total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    grand_total_payment DECIMAL(15, 2) DEFAULT 0.00,
    audited_by VARCHAR(100),
    audit_status ENUM('Pending', 'Completed', 'Verified') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_audit_date_hotel (audit_date, hotel_name)
);

-- Add index
CREATE INDEX idx_audit_summary_date ON night_audit_summary(audit_date);
