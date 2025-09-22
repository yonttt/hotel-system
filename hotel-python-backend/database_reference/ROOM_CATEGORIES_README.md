# Room Categories Database Setup

This directory contains SQL scripts to add room categories functionality to the hotel management system.

## Files Created

### 1. `create_room_categories.sql`
- Creates a standalone room_categories table
- Inserts the 7 room types with their rates as shown in the UI
- Use this for new database installations

### 2. `updated_hotel_system_with_categories.sql`
- Complete database schema including room categories
- Updates existing rooms table with foreign key relationship
- Creates useful views for room inventory management
- Use this for complete fresh installations

### 3. `migration_add_room_categories.sql` ⭐ **RECOMMENDED**
- **Safe migration script for existing databases**
- Checks for existing tables/columns before making changes
- Preserves all existing data
- Links existing rooms to appropriate categories
- Use this to update your current running system

## Room Categories Added

| Code | Type | Normal Rate | Weekend Rate | Description |
|------|------|-------------|--------------|-------------|
| EXE | Executive | 345.000 | 355.000 | Premium amenities with city view |
| SPR | Superior | 325.000 | 335.000 | Enhanced features with modern decor |
| DLX | Deluxe | 295.000 | 305.000 | Comfortable accommodations with garden view |
| STD | Standard | 265.000 | 275.000 | Basic amenities with essential comfort |
| BIS | Business | 190.000 | 200.000 | Corporate facilities for business guests |
| APT | Apartemen | 360.000 | 370.000 | Apartment style with kitchen facilities |
| APT DLX | APT DLX | 1000.000 | 1000.000 | Deluxe apartment with premium services |

## How to Apply

### For Existing Database (RECOMMENDED):
```sql
-- 1. Backup your database first!
mysqldump -u root -p hotel_system > backup_before_categories.sql

-- 2. Apply the migration
mysql -u root -p hotel_system < migration_add_room_categories.sql
```

### For New Installation:
```sql
-- Use the complete schema
mysql -u root -p < updated_hotel_system_with_categories.sql
```

## Views Created

### `active_room_categories`
- Shows all active room categories with current rates (weekend vs normal)
- Automatically calculates current rate based on day of week

### `room_inventory` (in complete schema)
- Combines rooms with their category details
- Shows current pricing for each room
- Useful for reservation systems

## Backend Integration

After running the migration, update your backend API endpoints to:

1. **Fetch room categories:**
   ```sql
   SELECT * FROM active_room_categories ORDER BY normal_rate DESC;
   ```

2. **Get rooms with pricing:**
   ```sql
   SELECT * FROM room_inventory WHERE status = 'available';
   ```

3. **Calculate room rate:**
   ```sql
   SELECT 
     CASE 
       WHEN DAYOFWEEK(?) IN (1,7) THEN weekend_rate 
       ELSE normal_rate 
     END as rate
   FROM room_categories WHERE code = ?;
   ```

## Frontend Integration

The room categories can now be used in:
- Reservation forms (dropdown for room types)
- Pricing calculations
- Room availability displays
- Rate management interfaces

## Safety Notes

- ✅ The migration script is safe for existing data
- ✅ It checks for existing columns before adding them
- ✅ It preserves all current reservations and room data
- ✅ It automatically links existing rooms to appropriate categories
- ⚠️ Always backup your database before running any migration!