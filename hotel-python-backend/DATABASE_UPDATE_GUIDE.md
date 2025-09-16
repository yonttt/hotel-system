# Database Update Guide

## Overview
This guide helps you update your hotel management system database to support all the fields from the registration and reservation forms shown in the image.

## Method 1: Quick Update via phpMyAdmin (Recommended)

### Step 1: Access phpMyAdmin
1. Open your web browser
2. Go to `http://localhost/phpmyadmin`
3. Login with your MySQL credentials

### Step 2: Select Database
1. Click on `hotel_system` database from the left sidebar
2. If the database doesn't exist, create it first

### Step 3: Execute Migration
1. Click on the **SQL** tab at the top
2. Copy the entire contents of `migration_manual.sql`
3. Paste it into the SQL query box
4. Click **Go** to execute

### Step 4: Verify Update
Check that these new tables were created:
- ✓ `category_markets`
- ✓ `market_segments`
- ✓ `payment_methods`
- ✓ `registration_types`
- ✓ `nationalities`
- ✓ `cities`
- ✓ `hotel_reservations` (updated)
- ✓ `hotel_registrations` (new)

## Method 2: Command Line (Alternative)

If you prefer command line:

```bash
# Navigate to the database reference folder
cd c:\xampp\htdocs\hotel-system\hotel-python-backend\database_reference

# Execute the migration (replace 'root' with your username)
mysql -u root -p hotel_system < migration_manual.sql
```

## Method 3: Python Script (Advanced)

```bash
# Navigate to backend folder
cd c:\xampp\htdocs\hotel-system\hotel-python-backend

# Run the update script
python update_database.py
```

## Database Changes Summary

### New Lookup Tables
- **category_markets**: Walkin, Online, Corporate, Travel Agent
- **market_segments**: Normal, VIP, Corporate
- **payment_methods**: Debit BCA 446, Cash, Credit Card, Bank Transfer, E-Wallet
- **registration_types**: Reservasi, Individual, Group, Corporate, Walk-in
- **nationalities**: Indonesia, Singapore, Malaysia, Thailand, Others
- **cities**: Jakarta, Surabaya, Bandung, Medan, Makassar, Bali, Others

### Updated hotel_reservations Table
Now includes all fields from the reservation form:
- ✓ Category Market
- ✓ Member ID
- ✓ City selection
- ✓ Payment Method
- ✓ Registration Type
- ✓ Payment - Diskon field
- ✓ All guest information fields
- ✓ Transaction details

### New hotel_registrations Table
Separate table for guest registrations with:
- ✓ All the same fields as reservations
- ✓ Different default values for registration workflow
- ✓ Automatic arrival date (today)
- ✓ Registration-specific status options

## Frontend Integration

After updating the database, your forms will be able to save:
- ✓ All reservation data from the reservation form
- ✓ All registration data from the registration form
- ✓ Lookup relationships for better data management
- ✓ Foreign key constraints for data integrity

## Troubleshooting

### Common Issues

1. **"Table already exists" error**
   - This is normal, the script handles existing tables safely

2. **Foreign key constraint errors**
   - Make sure the `users` table exists first
   - Run the main `hotel_system.sql` if needed

3. **Permission denied**
   - Make sure your MySQL user has CREATE and ALTER privileges
   - Try running as root user

### Verification Steps

1. Check that all tables exist:
   ```sql
   SHOW TABLES LIKE '%hotel_%';
   ```

2. Verify table structure:
   ```sql
   DESCRIBE hotel_reservations;
   DESCRIBE hotel_registrations;
   ```

3. Check sample data:
   ```sql
   SELECT * FROM category_markets;
   SELECT * FROM payment_methods;
   ```

## Next Steps

1. ✅ Update database schema (this guide)
2. 🔄 Update backend API endpoints to use new tables
3. 🔄 Test frontend forms with new database
4. 🔄 Verify data is being saved correctly

## Support

If you encounter any issues:
1. Check the error message in phpMyAdmin
2. Verify your MySQL version compatibility
3. Ensure proper database permissions
4. Contact system administrator if needed