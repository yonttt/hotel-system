-- Drop guest_registrations table
-- This table appears to be legacy/duplicate data
-- The hotel_registrations table is the primary registration table

USE hotel_system;

-- Drop the table if it exists
DROP TABLE IF EXISTS guest_registrations;

-- Verify the table is deleted
SHOW TABLES;
