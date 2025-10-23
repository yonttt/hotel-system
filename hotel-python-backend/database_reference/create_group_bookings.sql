-- Create group_bookings table to store group booking information
-- This table stores the main group booking details (header)
CREATE TABLE IF NOT EXISTS group_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_booking_id VARCHAR(50) UNIQUE NOT NULL,  -- Format: GRP-timestamp
    group_name VARCHAR(255) NOT NULL,
    group_pic VARCHAR(255) NOT NULL,  -- Person in charge
    pic_phone VARCHAR(50) NOT NULL,
    pic_email VARCHAR(255),
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    nights INT NOT NULL,
    total_rooms INT NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    total_amount DECIMAL(15, 3) DEFAULT 0,
    total_deposit DECIMAL(15, 3) DEFAULT 0,
    total_balance DECIMAL(15, 3) DEFAULT 0,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'Active',  -- Active, Checked-In, Completed, Cancelled
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    hotel_name VARCHAR(255) DEFAULT 'New Idola Hotel',
    INDEX idx_group_booking_id (group_booking_id),
    INDEX idx_arrival_date (arrival_date),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create group_booking_rooms table to store individual room details
-- This table stores details for each room in a group booking
CREATE TABLE IF NOT EXISTS group_booking_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_booking_id VARCHAR(50) NOT NULL,  -- Links to group_bookings table
    reservation_no VARCHAR(10) NOT NULL,  -- Individual reservation number
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(100),
    guest_name VARCHAR(255) NOT NULL,
    guest_title VARCHAR(10),
    id_card_type VARCHAR(50),
    id_card_number VARCHAR(100),
    mobile_phone VARCHAR(50),
    nationality VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    guest_count_male INT DEFAULT 0,
    guest_count_female INT DEFAULT 0,
    guest_count_child INT DEFAULT 0,
    extra_bed INT DEFAULT 0,
    rate DECIMAL(15, 3) DEFAULT 0,
    discount DECIMAL(15, 3) DEFAULT 0,
    subtotal DECIMAL(15, 3) DEFAULT 0,
    room_status VARCHAR(50) DEFAULT 'Reserved',  -- Reserved, Checked-In, Checked-Out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_booking_id) REFERENCES group_bookings(group_booking_id) ON DELETE CASCADE,
    INDEX idx_group_booking_id (group_booking_id),
    INDEX idx_reservation_no (reservation_no),
    INDEX idx_room_number (room_number),
    INDEX idx_guest_name (guest_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comments to tables
ALTER TABLE group_bookings COMMENT = 'Stores group booking header information';
ALTER TABLE group_booking_rooms COMMENT = 'Stores individual room details for each group booking';
