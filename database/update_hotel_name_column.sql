-- Add hotel_name column to guest_registrations and hotel_reservations tables
ALTER TABLE guest_registrations ADD hotel_name VARCHAR(100) NOT NULL DEFAULT 'New Idola Hotel';
ALTER TABLE hotel_reservations ADD hotel_name VARCHAR(100) NOT NULL DEFAULT 'New Idola Hotel';
