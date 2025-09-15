/*
 * DATABASE SCHEMA UPDATE - HOTEL NAME COLUMN
 * 
 * This file adds hotel_name column to existing tables
 * 
 * USAGE:
 * - Run this after the main database setup
 * - Import via phpMyAdmin for schema updates
 * 
 * MODIFIES:
 * - Table: guest_registrations (adds hotel_name column)
 * - Table: hotel_reservations (adds hotel_name column)
 * 
 * AFFECTS:
 * - Frontend/modules/frontoffice/form/registration.php
 * - Frontend/modules/frontoffice/form/reservation.php
 * - All modules that display hotel information
 */

-- Add hotel_name column to guest_registrations and hotel_reservations tables
ALTER TABLE guest_registrations ADD hotel_name VARCHAR(100) NOT NULL DEFAULT 'New Idola Hotel';
ALTER TABLE hotel_reservations ADD hotel_name VARCHAR(100) NOT NULL DEFAULT 'New Idola Hotel';
