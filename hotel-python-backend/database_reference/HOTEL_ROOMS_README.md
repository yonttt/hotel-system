# Hotel Rooms Database Setup

This directory contains SQL scripts to add the complete hotel rooms inventory for Hotel New Idola based on the actual room data from your system.

## Files Created

### 1. `create_hotel_rooms.sql`
- Creates the complete hotel_rooms table with all room data
- Includes all 95 rooms from Hotel New Idola
- Use this for new database installations

### 2. `migration_add_hotel_rooms.sql` ⭐ **RECOMMENDED**
- **Safe migration script for existing databases**
- Checks for existing tables before making changes
- Preserves all existing data
- Links rooms to room categories automatically
- Use this to update your current running system

## Hotel Inventory Summary

**Total Rooms:** 95 rooms across 8 floors

### Room Distribution by Type:
- **EXE (Executive):** 17 rooms
- **SPR (Superior):** 27 rooms  
- **DLX (Deluxe):** 15 rooms
- **STD (Standard):** 19 rooms
- **BIS (Business):** 9 rooms
- **APT (Apartemen):** 8 rooms

### Floor Distribution:
- **Floor 1:** 19 rooms (mix of STD, APT, DLX, BIS)
- **Floor 2:** 12 rooms (STD, DLX, BIS)
- **Floor 3:** 13 rooms (STD, BIS, SPR, DLX)
- **Floor 4:** 11 rooms (STD, DLX, SPR, BIS, EXE)
- **Floor 5:** 13 rooms (DLX, SPR, EXE)
- **Floor 6:** 9 rooms (SPR, EXE, DLX)
- **Floor 7:** 9 rooms (SPR, EXE, DLX)
- **Floor 8:** 9 rooms (SPR, EXE)

### Special Features:
- **VIP Rooms:** None (all marked as 'NO')
- **Smoking Allowed:** 76 rooms
- **Non-Smoking:** 19 rooms
- **Tax Status:** Mixed (YA/TIDAK)
- **Room Sizes:** Specified for some Executive and Business rooms (13-56 sqm)

## Database Schema

### Table: `hotel_rooms`
```sql
- id (Primary Key)
- hotel_name (Default: 'HOTEL NEW IDOLA')
- room_number (Unique identifier)
- room_type (STD, SPR, DLX, EXE, BIS, APT)
- floor_number (1-8)
- vip_status (YES/NO)
- smoking_allowed (Yes/No)
- tax_status (YA/TIDAK)
- room_size (Square meters, where specified)
- bed_type (Default: 'Double')
- max_occupancy (Default: 2)
- status (available/occupied/maintenance/out_of_order)
- category_id (Links to room_categories table)
- is_active (Boolean, default: TRUE)
- created_at, updated_at (Timestamps)
- created_by (Tracking field)
```

## How to Apply

### For Existing Database (RECOMMENDED):
```sql
-- 1. Backup your database first!
mysqldump -u root -p hotel_system > backup_before_rooms.sql

-- 2. Apply the migration
mysql -u root -p hotel_system < migration_add_hotel_rooms.sql
```

## Views Created

### `room_availability`
Comprehensive view combining room details with pricing information:
- Room details (number, type, floor, features)
- Category information and pricing
- Current rate calculation (weekend vs normal)
- Status display formatting
- Availability information

## Sample Queries

### Get Available Rooms by Type:
```sql
SELECT room_number, room_type, floor_number, current_rate 
FROM room_availability 
WHERE status = 'available' AND room_type = 'EXE'
ORDER BY floor_number, room_number;
```

### Get Rooms by Floor:
```sql
SELECT room_number, room_type, smoking_allowed, current_rate
FROM room_availability 
WHERE floor_number = 5
ORDER BY room_number;
```

### Get Executive Rooms with Sizes:
```sql
SELECT room_number, floor_number, room_size, current_rate
FROM room_availability 
WHERE room_type = 'EXE' AND room_size IS NOT NULL
ORDER BY room_size DESC;
```

### Room Occupancy Summary:
```sql
SELECT 
    room_type,
    COUNT(*) as total_rooms,
    SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available,
    SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied
FROM hotel_rooms 
GROUP BY room_type 
ORDER BY total_rooms DESC;
```

## Backend Integration

After running the migration, your backend can now:

1. **Get room availability by type:**
   ```sql
   SELECT * FROM room_availability WHERE room_type = ? AND status = 'available';
   ```

2. **Check specific room:**
   ```sql
   SELECT * FROM room_availability WHERE room_number = ?;
   ```

3. **Get rooms for booking:**
   ```sql
   SELECT room_number, room_type, current_rate, max_occupancy 
   FROM room_availability 
   WHERE status = 'available' 
   ORDER BY current_rate;
   ```

## Frontend Integration

This room inventory can now be used in:
- Room selection dropdowns (filtered by type/floor)
- Availability calendars
- Pricing displays
- Room management interfaces
- Housekeeping status boards

## Safety Notes

- ✅ The migration script is safe for existing data
- ✅ It checks for existing tables before creating them
- ✅ It preserves all current reservations and guest data
- ✅ It automatically links rooms to room categories if both tables exist
- ✅ All room numbers are unique and validated
- ⚠️ Always backup your database before running any migration!

## Next Steps

1. Run the room migration
2. Update your room selection APIs to use `room_availability` view
3. Implement room status management (available/occupied/maintenance)
4. Add room assignment logic to your reservation system
5. Consider adding room amenities and features data