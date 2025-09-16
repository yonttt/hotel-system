# EVA GROUP HOTEL MANAGEMENT SYSTEM - DATABASE SETUP GUIDE

## Quick Setup Instructions

### Option 1: Using phpMyAdmin (Recommended)

1. **Open phpMyAdmin** in your browser (usually `http://localhost/phpmyadmin`)

2. **Create/Select Database:**
   - Click "New" to create a new database OR select existing `hotel_system` database
   - Name: `hotel_system`
   - Collation: `utf8mb4_general_ci`

3. **Import Complete Setup:**
   - Click on the "Import" tab
   - Choose file: `eva_group_hotel_complete_setup.sql`
   - Click "Go" button
   - Wait for "Import has been successfully finished" message

4. **Verify Setup:**
   - You should see 16 tables created
   - All lookup tables populated with sample data
   - System ready to use!

### Option 2: Using MySQL Command Line

```bash
# Navigate to project directory
cd C:\xampp\htdocs\hotel-system\hotel-python-backend\database_reference

# Run the setup script
mysql -u root -p < eva_group_hotel_complete_setup.sql
```

## Database Structure Overview

### Core Tables
- `users` - System users (admin, manager, staff)
- `hotel_registrations` - Main registration system with clean numbering
- `hotel_reservations` - Future bookings system
- `rooms` - Hotel room inventory

### Lookup Tables (All Pre-populated)
- `cities` - Indonesian cities (31 cities + Others)
- `nationalities` - Countries/nationalities (31 countries)
- `category_markets` - Market categories (20 types)
- `market_segments` - Market segments (20 types)
- `payment_methods` - Payment options (18 methods)
- `registration_types` - Registration types (20 types)

### System Tables
- `services` - Hotel services and pricing
- `settings` - System configuration
- `master_meja` - F&B table management

## Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| manager | manager123 | manager |
| staff | staff123 | staff |

## Key Features Included

✅ **Clean 10-digit numbering system** (0000000001, 0000000002, etc.)
✅ **Comprehensive lookup data** - Cities, nationalities, markets, payment methods
✅ **Proper foreign key relationships** - Data integrity maintained
✅ **Sample room inventory** - 9 rooms across different types
✅ **System settings** - Configurable hotel parameters
✅ **F&B table management** - 16 tables ready for restaurant operations

## Database Schema Benefits

1. **Single Import Solution** - Everything in one file
2. **Complete Data Population** - No empty dropdowns
3. **Scalable Design** - Easy to add new lookup data
4. **Referential Integrity** - Foreign keys maintain data consistency
5. **Ready for Production** - Includes all necessary sample data

## Troubleshooting

### Common Issues:

**Import Error: "Table already exists"**
- Solution: The script includes `DROP TABLE IF EXISTS` statements - this is normal

**Empty Dropdowns in Frontend**
- Solution: Restart your backend server after import
- Check API endpoints are running correctly

**Login Issues**
- Solution: Use default credentials above
- Password: Use exactly as shown (case-sensitive)

**Missing Data**
- Solution: Re-run the complete setup script
- Verify all 16 tables are created

## Next Steps After Setup

1. **Test Backend Connection:**
   ```bash
   cd hotel-python-backend
   python run.py
   ```

2. **Test Frontend:**
   ```bash
   cd hotel-react-frontend
   npm run dev
   ```

3. **Verify Database Integration:**
   - Login with admin/admin123
   - Check registration form dropdowns are populated
   - Test creating a new registration

## File Structure Reference

```
hotel-python-backend/
├── database_reference/
│   ├── eva_group_hotel_complete_setup.sql  ← **USE THIS FILE**
│   ├── create_hotel_reservations.sql       ← (Legacy - can ignore)
│   ├── hotel_system.sql                    ← (Legacy - can ignore)
│   └── update_hotel_name_column.sql        ← (Legacy - can ignore)
```

## Support

For issues or questions:
1. Check this guide first
2. Verify all steps completed correctly
3. Check browser console for frontend errors
4. Check backend logs for API errors

---
**Created:** September 2025  
**Version:** 3.0 - Complete Unified Setup  
**Database:** MySQL/MariaDB Compatible