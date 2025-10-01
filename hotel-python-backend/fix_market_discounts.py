"""
Fix market segment discount percentages to match their names
"""
import pymysql
import re

conn = pymysql.connect(
    host='localhost',
    user='system',
    password='yont29921',
    database='hotel_system'
)

cursor = conn.cursor()

# Get all market segments
cursor.execute("SELECT id, name FROM market_segments ORDER BY name")
segments = cursor.fetchall()

print("="*70)
print("UPDATING MARKET SEGMENT DISCOUNT PERCENTAGES")
print("="*70)

updates = []

for seg_id, name in segments:
    discount = 0.00
    
    # Extract percentage from name if it exists
    # Pattern: "10%", "15%", "100%", etc.
    match = re.search(r'(\d+)%', name)
    if match:
        discount = float(match.group(1))
    # Look for "Owner XX%" pattern
    elif 'Owner' in name and '%' not in name:
        match = re.search(r'Owner (\d+)', name)
        if match:
            discount = float(match.group(1))
    # Special cases
    elif name == 'VIP':
        discount = 10.00
    elif name == 'Corporate':
        discount = 15.00
    elif 'Wedding' in name or 'Honeymoon' in name:
        discount = 20.00
    elif 'Group' in name or 'Conference' in name or 'Meeting' in name:
        discount = 12.00
    elif 'Birthday' in name or 'Anniversary' in name:
        discount = 8.00
    elif 'Holiday' in name or 'Weekend' in name:
        discount = 7.00
    elif 'Extended Stay' in name:
        discount = 15.00
    elif 'Isolasi mandiri' in name:
        if '14 days' in name:
            discount = 25.00
        elif '7 days' in name:
            discount = 20.00
    elif 'SPA' in name:
        discount = 10.00
    elif 'Staff Rate' in name:
        discount = 30.00
    elif 'Dinas Management' in name:
        discount = 20.00
    elif 'Keamanan' in name or 'Polisi' in name:
        discount = 15.00
    elif 'Special Case' in name:
        discount = 25.00
    elif 'Out of Order' in name:
        discount = 100.00
    elif '10 Room free 1' in name:
        discount = 10.00
    elif 'Walkin - Normal' in name:
        discount = 0.00
    elif 'Walkin - Family' in name:
        discount = 5.00
    
    # Update if there's a discount
    if discount > 0:
        cursor.execute(
            "UPDATE market_segments SET discount_percentage = %s WHERE id = %s",
            (discount, seg_id)
        )
        updates.append((name, discount))
        print(f"✅ {name:50s} → {discount:6.2f}%")

conn.commit()

print("="*70)
print(f"Updated {len(updates)} market segments")
print("="*70)

# Show final result
cursor.execute("""
    SELECT name, discount_percentage 
    FROM market_segments 
    WHERE discount_percentage > 0 
    ORDER BY discount_percentage DESC, name
""")
results = cursor.fetchall()

print("\n" + "="*70)
print("MARKET SEGMENTS WITH DISCOUNTS (Sorted by Discount %)")
print("="*70)
for name, discount in results:
    print(f"{discount:6.2f}% - {name}")
print("="*70)

cursor.close()
conn.close()

print("\n✅ Market segment discounts updated successfully!")
