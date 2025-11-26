# Revenue Reports Database Integration

## Overview
This document describes the database structure and API integration for the Laporan Global (Global Reports) feature.

## Database Tables

### 1. hotel_revenue_summary
Stores daily revenue summary for each hotel in the Eva Group.

**Columns:**
- `id` - Primary key (auto-increment)
- `hotel_id` - Hotel identifier
- `hotel_name` - Hotel name (e.g., 'HOTEL NEW IDOLA')
- `report_date` - Date of the report (DATE)
- `available_rooms` - Total available rooms
- `room_sales` - Number of rooms sold
- `occupancy_rate` - Occupancy percentage (VARCHAR, e.g., '15.67%')
- `arr` - Average Room Rate (DECIMAL)
- `revenue_from_na` - Revenue from N/A (DECIMAL)
- `total_cash` - Total cash summary (DECIMAL)
- `collection` - Collection amount (DECIMAL)
- `bank_distribution` - Bank distribution amount (DECIMAL)
- `balance` - Balance amount (DECIMAL)
- `operational_expense` - Operational expenses (DECIMAL)
- `non_operational_expense` - Non-operational expenses (DECIMAL)
- `owner_receive_expense` - Owner receive/expense (DECIMAL)
- `total_expense` - Total expenses (DECIMAL)
- `net_income` - Net income (DECIMAL)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

**Indexes:**
- `idx_hotel_date` - Composite index on (hotel_id, report_date)
- `idx_report_date` - Index on report_date

### 2. non_hotel_revenue_summary
Stores daily revenue summary for non-hotel business units.

**Columns:**
- `id` - Primary key (auto-increment)
- `unit_id` - Business unit identifier
- `unit_name` - Business unit name (e.g., 'LAUNDRY KYNITA BANDUNG')
- `report_date` - Date of the report (DATE)
- `revenue_from_na` - Revenue from N/A (DECIMAL)
- `total_cash` - Total cash summary (DECIMAL)
- `collection` - Collection amount (DECIMAL)
- `bank_distribution` - Bank distribution amount (DECIMAL)
- `balance` - Balance amount (DECIMAL)
- `operational_expense` - Operational expenses (DECIMAL)
- `non_operational_expense` - Non-operational expenses (DECIMAL)
- `owner_receive_expense` - Owner receive/expense (DECIMAL)
- `total_expense` - Total expenses (DECIMAL)
- `net_income` - Net income (DECIMAL)
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

**Indexes:**
- `idx_unit_date` - Composite index on (unit_id, report_date)
- `idx_report_date` - Index on report_date

## API Endpoints

### GET /revenue-reports/hotel-revenue
Retrieves hotel revenue data filtered by date range.

**Query Parameters:**
- `start_date` (optional) - Start date in YYYY-MM-DD format
- `end_date` (optional) - End date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "no": 1,
      "hotelName": "HOTEL NEW IDOLA",
      "availableRooms": 134,
      "roomSales": 21,
      "occ": "15.67%",
      "arr": 0,
      "revFromNA": 0,
      "totalCash": -22000,
      "colection": 8411000,
      "bankDist": 0,
      "balance": 8411000,
      "operationalExp": 0,
      "nonOperationalExp": 0,
      "ownerReceive": 0,
      "totalExpense": 0,
      "netIncome": -22000
    }
  ]
}
```

### GET /revenue-reports/non-hotel-revenue
Retrieves non-hotel revenue data filtered by date range.

**Query Parameters:**
- `start_date` (optional) - Start date in YYYY-MM-DD format
- `end_date` (optional) - End date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "no": 1,
      "unitName": "LAUNDRY KYNITA BANDUNG",
      "revFromNA": 0,
      "totalCash": 0,
      "colection": 0,
      "bankDist": 0,
      "balance": 0,
      "operationalExp": 0,
      "nonOperationalExp": 0,
      "ownerReceive": 0,
      "totalExpense": 0,
      "netIncome": 0
    }
  ]
}
```

## Frontend Integration

The Laporan Global page (`LaporanGlobal.jsx`) fetches data from both endpoints when:
1. Component mounts
2. Start date changes
3. End date changes

Data is automatically calculated for:
- Hotel totals (sum of all hotels)
- Non-hotel totals (sum of all units)
- Global totals (sum of hotel + non-hotel)

## Sample Data

The migration includes sample data for 2025-11-26:
- **8 hotels:** HOTEL NEW IDOLA, HOTEL BENUA, HOTEL SEMERU, HOTEL GHOTIC, HOTEL AMANAH BENUA, PENGINAPAN RIO, HOTEL BAMBOO, WISMA DEWI SARTIKA
- **15 non-hotel units:** Various laundry services, water refill stations, futsal, rental properties, CCTV services, management offices, restaurants, and cafes

## Migration File

Location: `hotel-python-backend/database_reference/migration_add_revenue_reports.sql`

To run the migration:
```bash
cd hotel-python-backend
python run_revenue_migration.py
```

## Models

Backend SQLAlchemy models are defined in:
`hotel-python-backend/app/models/__init__.py`

- `HotelRevenueSummary` - Maps to hotel_revenue_summary table
- `NonHotelRevenueSummary` - Maps to non_hotel_revenue_summary table

## API Service

Frontend API methods are in:
`hotel-react-frontend/src/services/api.js`

- `getHotelRevenue(startDate, endDate)` - Fetches hotel revenue
- `getNonHotelRevenue(startDate, endDate)` - Fetches non-hotel revenue

## Notes

- All decimal values are handled as DECIMAL(15,2) in the database
- Backend converts Decimal to float for JSON serialization
- Negative values are displayed in red in the frontend
- The "Cetak" (Print) button is available for future print functionality
- Date filter applies to both hotel and non-hotel revenue simultaneously
