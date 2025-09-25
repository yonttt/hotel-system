/*
 * MIGRATION: Add discount functionality to market_segments table
 * 
 * This migration adds discount percentage functionality to the market segments
 * and populates the Walkin market segment with all its discount rates
 * 
 * FEATURES:
 * - Adds discount_percentage column to market_segments table
 * - Adds category column to group different discount types
 * - Inserts all Walkin discount rates as requested
 * 
 * CREATED: September 2025
 * VERSION: 1.0 - Market Segments Discount System
 */

USE hotel_system;

-- Step 1: Add discount_percentage and category columns to market_segments table
ALTER TABLE market_segments 
ADD COLUMN discount_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Discount percentage (0.00 to 100.00)',
ADD COLUMN category VARCHAR(100) DEFAULT NULL COMMENT 'Category/group for organizing market segments',
ADD COLUMN description TEXT DEFAULT NULL COMMENT 'Description of the market segment';

-- Step 2: Insert all Walkin market segment discount rates
INSERT INTO market_segments (name, discount_percentage, category, description, active) VALUES 

-- Walkin Normal Rates
('Walkin - Normal', 0.00, 'Walkin', 'Normal walkin rate with no discount', TRUE),

-- Walkin Special Cases  
('Walkin - 10 Room free 1', 100.00, 'Walkin', '10 rooms booked, 1 room completely free', TRUE),
('Walkin - Family', 15.00, 'Walkin', 'Family discount for walkin guests', TRUE),
('Walkin - Staff Rate', 45.00, 'Walkin', 'Staff discount rate', TRUE),
('Walkin - Out of Order Room', 30.00, 'Walkin', 'Discount for out of order room usage', TRUE),
('Walkin - Keamanan/Polisi', 15.00, 'Walkin', 'Security/Police personnel discount', TRUE),
('Walkin - Dinas Management', 100.00, 'Walkin', 'Management duty rate - fully covered', TRUE),
('Walkin - Special Case', 100.00, 'Walkin', 'Special case - fully covered', TRUE),

-- Walkin Owner Rates (various percentages)
('Walkin - Owner 10%', 10.00, 'Walkin', 'Owner discount 10%', TRUE),
('Walkin - Owner 20%', 20.00, 'Walkin', 'Owner discount 20%', TRUE),
('Walkin - Owner 25%', 25.00, 'Walkin', 'Owner discount 25%', TRUE),
('Walkin - Owner 30%', 30.00, 'Walkin', 'Owner discount 30%', TRUE),
('Walkin - Owner 40%', 40.00, 'Walkin', 'Owner discount 40%', TRUE),
('Walkin - Owner 50%', 50.00, 'Walkin', 'Owner discount 50%', TRUE),
('Walkin - Owner 60%', 60.00, 'Walkin', 'Owner discount 60%', TRUE),
('Walkin - Owner 70%', 70.00, 'Walkin', 'Owner discount 70%', TRUE),
('Walkin - Owner 80%', 80.00, 'Walkin', 'Owner discount 80%', TRUE),
('Walkin - Owner 90%', 90.00, 'Walkin', 'Owner discount 90%', TRUE),
('Walkin - Owner 100%', 100.00, 'Walkin', 'Owner discount 100% - fully covered', TRUE),

-- Walkin Promotional Rates
('Walkin - Promo Discount 15%', 15.00, 'Walkin', 'General promotional discount', TRUE),
('Walkin - Promo 5%', 5.00, 'Walkin', 'Walkin promotional rate 5%', TRUE),
('Walkin - Promo 10%', 10.00, 'Walkin', 'Walkin promotional rate 10%', TRUE),
('Walkin - Promo 15%', 15.00, 'Walkin', 'Walkin promotional rate 15%', TRUE),

-- Walkin Special Event Rates
('Walkin - Promo Wedding 100%', 100.00, 'Walkin', 'Wedding promotion - fully covered', TRUE),
('Walkin - Promo APT 1 bulan', 53.00, 'Walkin', 'Apartment 1 month promotional rate', TRUE),
('Walkin - Promo APT 1 bulan 1006 HNI', 53.00, 'Walkin', 'Apartment 1 month HNI promotional rate', TRUE),

-- Walkin General Discounts
('Walkin - Promo Discount 5%', 5.00, 'Walkin', 'General promotional discount 5%', TRUE),
('Walkin - Promo Discount 8%', 8.00, 'Walkin', 'General promotional discount 8%', TRUE),
('Walkin - Promo Discount 10%', 10.00, 'Walkin', 'General promotional discount 10%', TRUE),
('Walkin - Promo Discount 12%', 12.00, 'Walkin', 'General promotional discount 12%', TRUE),

-- Walkin SPA Packages
('Walkin - SPA for one', 12.00, 'Walkin', 'SPA package for one person', TRUE),
('Walkin - SPA for one extra 2 jam', 46.00, 'Walkin', 'SPA package for one with extra 2 hours', TRUE),
('Walkin - SPA for one guest house', 24.00, 'Walkin', 'SPA package for guest house visitor', TRUE),

-- Walkin Health/Safety Packages
('Walkin - Isolasi mandiri package 7 days', 15.00, 'Walkin', 'Self-isolation package for 7 days', TRUE),
('Walkin - Isolasi mandiri package 14 days', 25.00, 'Walkin', 'Self-isolation package for 14 days', TRUE),

-- Walkin Weekend Specials
('Walkin - Promo special weekend 10%', 10.00, 'Walkin', 'Special weekend promotional rate 10%', TRUE),
('Walkin - Promo special weekend 15%', 15.00, 'Walkin', 'Special weekend promotional rate 15%', TRUE),

-- Walkin Independence Day 2025 Promos
('Walkin - Promo HUT RI ke 80 tahun 2025 5%', 5.00, 'Walkin', 'Indonesia Independence Day 80th anniversary promo 5%', TRUE),
('Walkin - Promo HUT RI ke 80 tahun 2025 10%', 10.00, 'Walkin', 'Indonesia Independence Day 80th anniversary promo 10%', TRUE),
('Walkin - Promo HUT RI ke 80 tahun 2025 15%', 15.00, 'Walkin', 'Indonesia Independence Day 80th anniversary promo 15%', TRUE),
('Walkin - Promo HUT RI ke 80 tahun 2025 20%', 20.00, 'Walkin', 'Indonesia Independence Day 80th anniversary promo 20%', TRUE);

-- Step 3: Update existing market segments with basic information
UPDATE market_segments SET 
    discount_percentage = 0.00, 
    category = 'Standard',
    description = 'Standard market segment rates'
WHERE discount_percentage IS NULL;

-- Step 4: Create index for better query performance
CREATE INDEX idx_market_segments_category ON market_segments(category);
CREATE INDEX idx_market_segments_discount ON market_segments(discount_percentage);

-- Verification query to show all Walkin rates
SELECT 
    name,
    discount_percentage,
    category,
    description,
    active
FROM market_segments 
WHERE category = 'Walkin' 
ORDER BY discount_percentage ASC, name ASC;