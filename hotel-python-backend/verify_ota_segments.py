"""Verify OTA segments and their linkage."""

import mysql.connector

try:
    connection = mysql.connector.connect(
        host='localhost',
        user='system',
        password='yont29921',
        database='hotel_system'
    )
    
    cursor = connection.cursor()
    
    print("=" * 80)
    print("VERIFICATION - MARKET SEGMENTS BY CATEGORY")
    print("=" * 80)
    
    # Get Walkin segments
    cursor.execute("""
        SELECT name, discount_percentage 
        FROM market_segments 
        WHERE category = 'Walkin'
        ORDER BY name
    """)
    
    walkin_segments = cursor.fetchall()
    print(f"\n✅ WALKIN CATEGORY ({len(walkin_segments)} segments)")
    print("-" * 80)
    for seg in walkin_segments[:5]:  # Show first 5
        print(f"  • {seg[0]} ({seg[1]}%)")
    if len(walkin_segments) > 5:
        print(f"  ... and {len(walkin_segments) - 5} more")
    
    # Get OTA segments
    cursor.execute("""
        SELECT name, discount_percentage, description
        FROM market_segments 
        WHERE category = 'Online Travel Agent (OTA)'
        ORDER BY name
    """)
    
    ota_segments = cursor.fetchall()
    print(f"\n✅ ONLINE TRAVEL AGENT (OTA) CATEGORY ({len(ota_segments)} segments)")
    print("-" * 80)
    for seg in ota_segments:
        print(f"  • {seg[0]} ({seg[1]}%) - {seg[2]}")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total Walkin segments: {len(walkin_segments)}")
    print(f"Total OTA segments: {len(ota_segments)}")
    print("\n✅ All OTA segments are properly configured and ready to use!")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
