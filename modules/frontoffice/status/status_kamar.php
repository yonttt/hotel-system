<?php
// Modul Status Kamar FO
// Kategori: FRONTOFFICE
// Sub-Kategori: STATUS

// Periksa apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Include koneksi database
require_once $_SERVER['DOCUMENT_ROOT'] . '/hotel-system/config/database.php';

$db = new Database();
$conn = $db->getConnection();

// Fetch all rooms with their current status
$rooms = $conn->query("SELECT * FROM rooms ORDER BY room_number")->fetchAll();

// Group rooms by status for summary
$status_summary = [];
foreach ($rooms as $room) {
    $status = $room['status'];
    if (!isset($status_summary[$status])) {
        $status_summary[$status] = 0;
    }
    $status_summary[$status]++;
}
?>

<style>
.room-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
    gap: 6px;
    padding: 12px;
}
.room-card {
    width: 85px;
    height: 70px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    font-weight: bold;
    color: white;
    text-align: center;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.2s ease;
    padding: 2px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.room-type {
    font-size: 10px;
    font-weight: 600;
    margin: 0;
    line-height: 1;
    order: 1;
}
.room-number {
    font-size: 16px;
    font-weight: 900;
    margin: 2px 0;
    line-height: 1;
    order: 2;
}
.room-status {
    font-size: 11px;
    margin: 0;
    font-weight: 600;
    line-height: 1;
    order: 3;
}
/* Status Colors */
.status-available { background-color: #22c55e; }          /* VR - Vacant Ready (Green) */
.status-occupied { background-color: #ef4444; }           /* OC - Occupied (Red) */
.status-dirty { background-color: #eab308; }              /* VD - Vacant Dirty (Yellow) */
.status-maintenance { background-color: #f97316; }        /* MT - Maintenance (Orange) */
.status-out_of_order { background-color: #6b7280; }       /* OO - Out of Order (Gray) */
.status-checkout { background-color: #3b82f6; }           /* CO - Checkout (Blue) */
.status-general_cleaning { background-color: #8b5cf6; }   /* GC - General Cleaning (Purple) */
.status-vacant_clean { background-color: #10b981; }       /* VC - Vacant Clean (Emerald) */
.status-vacant_uncheck { background-color: #f59e0b; }     /* VU - Vacant Uncheck (Amber) */
.status-arrival { background-color: #06b6d4; }            /* AR - Arrival (Cyan) */
.status-incognito { background-color: #374151; }          /* IC - Incognito (Gray-700) */
.status-occupied_dirty { background-color: #dc2626; }     /* OD - Occupied Dirty (Red-600) */
.status-makeup_room { background-color: #7c3aed; }        /* MU - Makeup Room (Violet) */
.status-occupied_clean { background-color: #059669; }     /* OCC - Occupied Clean (Emerald-600) */
.status-house_use { background-color: #9ca3af; }          /* HU - House Use (Gray-400) */
.status-sleep_out { background-color: #ec4899; }          /* SO - Sleep Out (Pink) */
.status-skipper { background-color: #64748b; }            /* SK - Skipper (Slate) */
.status-expected_departure { background-color: #d97706; } /* ED - Expected Departure (Amber-600) */

/* Tab Styles */
.tab-button {
    border: none;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.tab-button.active {
    background-color: #e5e7eb;
    border-bottom: 2px solid #3b82f6;
}

/* Room Card Hover Effect - No 3D effect */
.room-card:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Only highlight the status text on hover */
.room-card:hover .room-status {
    background-color: rgba(255, 255, 255, 0.9);
    color: #1f2937 !important;
    border-radius: 3px;
    padding: 1px 4px;
    font-weight: 700;
}

/* Keep room type and number normal on hover */
.room-card:hover .room-type,
.room-card:hover .room-number {
    color: white !important;
    font-weight: 700;
}

/* Modal Styles */
.modal-content {
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Form Styles */
select:focus, input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    transition: all 0.2s ease;
}

/* Required field indicator */
.required-field {
    color: #dc2626;
    font-weight: bold;
}
.tab-button:not(.active) {
    background-color: white;
    color: #6b7280;
}
.tab-button:not(.active):hover {
    background-color: #f3f4f6;
}
.tab-content {
    display: none;
}
.tab-content.active {
    display: block;
}
.status-table {
    width: 100%;
    border-collapse: collapse;
}
.status-table th, .status-table td {
    border: 1px solid #d1d5db;
    padding: 10px;
    text-align: left;
    font-size: 13px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.status-table th {
    background-color: #f3f4f6;
    font-weight: 600;
    font-size: 14px;
}
.status-badge {
    padding: 6px 10px;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    font-size: 11px;
    text-align: center;
    min-width: 85px;
    display: inline-block;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

/* Summary and Filter Styles */
.summary-bar {
    font-size: 13px;
    font-weight: 600;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-controls {
    font-size: 13px;
    font-weight: 500;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-controls select {
    font-size: 12px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

<div class="border border-gray-300 bg-white">
    <!-- Header with tabs -->
    <div class="flex border-b border-gray-300">
        <button class="tab-button active" onclick="showTab('all-rooms')" id="all-rooms-tab">
            ALL ROOM STATUS
        </button>
        <button class="tab-button" onclick="showTab('room-description')" id="room-description-tab">
            ROOM DESCRIPTION
        </button>
    </div>

    <!-- All Rooms Tab Content -->
    <div id="all-rooms-content" class="tab-content active">
        <!-- Status Summary Bar -->
        <div class="bg-gray-50 px-4 py-2 border-b border-gray-300">
            <div class="flex flex-wrap gap-4 summary-bar">
                <span><strong>VD:</strong> <?= $status_summary['dirty'] ?? 0 ?></span>
                <span><strong>VC:</strong> <?= $status_summary['vacant_clean'] ?? 0 ?></span>
                <span><strong>VR:</strong> <?= $status_summary['available'] ?? 0 ?></span>
                <span><strong>OR:</strong> <?= $status_summary['occupied'] ?? 0 ?></span>
                <span><strong>BO:</strong> 0</span>
                <span><strong>OD:</strong> <?= $status_summary['occupied_dirty'] ?? 0 ?></span>
                <span><strong>MU:</strong> <?= $status_summary['makeup_room'] ?? 0 ?></span>
                <span><strong>OC:</strong> <?= $status_summary['occupied_clean'] ?? 0 ?></span>
                <span><strong>ED:</strong> <?= $status_summary['expected_departure'] ?? 0 ?></span>
                <span><strong>HU:</strong> <?= $status_summary['house_use'] ?? 0 ?></span>
                <span><strong>SO:</strong> <?= $status_summary['sleep_out'] ?? 0 ?></span>
                <span><strong>DND:</strong> 0</span>
                <span><strong>Checkout:</strong> <?= $status_summary['checkout'] ?? 0 ?></span>
                <span><strong>VU:</strong> <?= $status_summary['vacant_uncheck'] ?? 0 ?></span>
                <span><strong>Maintenance:</strong> <?= $status_summary['maintenance'] ?? 0 ?></span>
                <span><strong>OO:</strong> <?= $status_summary['out_of_order'] ?? 0 ?></span>
            </div>
        </div>

        <!-- Filter Controls -->
        <div class="bg-white px-4 py-2 border-b border-gray-300">
            <div class="flex gap-4 items-center filter-controls">
                <span><strong>Lookup:</strong></span>
                <select class="border border-gray-300 px-2 py-1">
                    <option>HOTEL NEW IDOLA</option>
                </select>
                <span><strong>All Type:</strong></span>
                <select id="typeFilter" class="border border-gray-300 px-2 py-1" onchange="filterRoomsByType()">
                    <option value="">All Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Presidential">Presidential</option>
                </select>
                <span><strong>Status:</strong></span>
                <select id="statusFilter" class="border border-gray-300 px-2 py-1" onchange="filterRoomsByStatus()">
                    <option value="">All Status</option>
                    <option value="available">VR - Vacant Ready</option>
                    <option value="occupied">OC - Occupied</option>
                    <option value="dirty">VD - Vacant Dirty</option>
                    <option value="maintenance">MT - Maintenance</option>
                    <option value="out_of_order">OO - Out Of Order</option>
                    <option value="checkout">CO - Checkout</option>
                    <option value="general_cleaning">GC - General Cleaning</option>
                    <option value="vacant_clean">VC - Vacant Clean</option>
                    <option value="vacant_uncheck">VU - Vacant Uncheck</option>
                    <option value="arrival">AR - Arrival</option>
                    <option value="incognito">IC - Incognito</option>
                    <option value="occupied_dirty">OD - Occupied Dirty</option>
                    <option value="makeup_room">MU - Makeup Room</option>
                    <option value="occupied_clean">OCC - Occupied Clean</option>
                    <option value="house_use">HU - House Use</option>
                    <option value="sleep_out">SO - Sleep Out</option>
                    <option value="skipper">SK - Skipper</option>
                    <option value="expected_departure">ED - Expected Departure</option>
                </select>
                <span><strong>Floor:</strong></span>
                <select id="floorFilter" class="border border-gray-300 px-2 py-1" onchange="filterRoomsByFloor()">
                    <option value="">All Floor</option>
                    <option value="1">Floor 1</option>
                    <option value="2">Floor 2</option>
                    <option value="3">Floor 3</option>
                </select>
            </div>
        </div>

        <!-- Room Grid -->
        <div class="room-grid bg-white" style="max-height: 600px; overflow-y: auto;">
            <?php foreach ($rooms as $room): ?>
                <?php 
                $status_class = 'status-' . str_replace(' ', '_', strtolower($room['status']));
                $status_text = '';
                switch($room['status']) {
                    case 'available': $status_text = 'VR'; break;               // Vacant Ready
                    case 'occupied': $status_text = 'OC'; break;                // Occupied
                    case 'dirty': $status_text = 'VD'; break;                   // Vacant Dirty
                    case 'maintenance': $status_text = 'MT'; break;             // Maintenance
                    case 'out_of_order': $status_text = 'OO'; break;            // Out of Order
                    case 'checkout': $status_text = 'CO'; break;                // Checkout
                    case 'general_cleaning': $status_text = 'GC'; break;        // General Cleaning
                    case 'vacant_clean': $status_text = 'VC'; break;            // Vacant Clean
                    case 'vacant_uncheck': $status_text = 'VU'; break;          // Vacant Uncheck
                    case 'arrival': $status_text = 'AR'; break;                 // Arrival
                    case 'incognito': $status_text = 'IC'; break;               // Incognito
                    case 'occupied_dirty': $status_text = 'OD'; break;          // Occupied Dirty
                    case 'makeup_room': $status_text = 'MU'; break;             // Makeup Room
                    case 'occupied_clean': $status_text = 'OCC'; break;         // Occupied Clean
                    case 'house_use': $status_text = 'HU'; break;               // House Use
                    case 'sleep_out': $status_text = 'SO'; break;               // Sleep Out
                    case 'skipper': $status_text = 'SK'; break;                 // Skipper
                    case 'expected_departure': $status_text = 'ED'; break;      // Expected Departure
                    default: $status_text = 'VR';                               // Default to Vacant Ready
                }
                
                // Determine floor from room number (first digit)
                $room_number = $room['room_number'];
                $floor = substr($room_number, 0, 1); // Get first digit as floor
                if (!is_numeric($floor) || $floor == '0') {
                    $floor = '1'; // Default to floor 1 if not numeric or zero
                }
                
                // Assign room type based on room number and database structure
                // Using actual hotel room types: Standard, Deluxe, Suite, Presidential
                $room_types = ['Standard', 'Deluxe', 'Suite', 'Presidential'];
                $room_type = isset($room['room_type']) ? $room['room_type'] : $room_types[($room_number % count($room_types))];
                
                // Create room type abbreviations that match hotel standards
                $type_abbreviations = [
                    'Standard' => 'VR',    // Standard rooms -> VR (Vacant Ready)
                    'Deluxe' => 'VR',      // Deluxe rooms -> VR (Vacant Ready) 
                    'Suite' => 'CO',       // Suite rooms -> CO (Checkout)
                    'Presidential' => 'OD', // Presidential -> OD (Occupied Dirty)
                    // Legacy mappings for compatibility
                    'Executive' => 'VR',
                    'Superior' => 'VR',
                    'Business' => 'OD',
                    'Apartemen' => 'CO',
                    'APT DLX' => 'CO'
                ];
                $room_type_abbr = isset($type_abbreviations[$room_type]) ? $type_abbreviations[$room_type] : 'VR';
                ?>
                <div class="room-card <?= $status_class ?>" 
                     data-status="<?= htmlspecialchars($room['status']) ?>" 
                     data-room-number="<?= htmlspecialchars($room['room_number']) ?>"
                     data-floor="<?= htmlspecialchars($floor) ?>"
                     data-type="<?= htmlspecialchars($room_type) ?>"
                     onclick="selectRoom('<?= $room['room_number'] ?>')">
                    <div class="room-type"><?= htmlspecialchars($room_type_abbr) ?></div>
                    <div class="room-number"><?= htmlspecialchars($room['room_number']) ?></div>
                    <div class="room-status"><?= $status_text ?></div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Room Description Tab Content -->
    <div id="room-description-content" class="tab-content">
        <div class="p-4">
            <table class="status-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Room Status</th>
                        <th>Description</th>
                        <th>No</th>
                        <th>Room Status</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td><span class="status-badge" style="background-color: #1f2937; color: white;">Checkout</span></td>
                        <td>Tamu baru saja checkout</td>
                        <td>10</td>
                        <td><span class="status-badge" style="background-color: #3b82f6; color: white;">Occupied Ready</span></td>
                        <td>Kamar terisi dan tamu meminta untuk tidak diganggu</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><span class="status-badge" style="background-color: #6b7280; color: white;">General Cleaning</span></td>
                        <td>Kamar dalam tahap pembersihan global / Pest Control</td>
                        <td>11</td>
                        <td><span class="status-badge" style="background-color: #eab308; color: black;">Occupied Dirty</span></td>
                        <td>Kamar terisi (extend) yang akan diassgn room attendant untuk membersihkan kamar</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><span class="status-badge" style="background-color: #ef4444; color: white;">Out Of Order</span></td>
                        <td>Kamar rusak (Tidak dapat dijual)</td>
                        <td>12</td>
                        <td><span class="status-badge" style="background-color: #8b5cf6; color: white;">Makeup Room</span></td>
                        <td>Kamar terisi yang telah di assign room attendant untuk membersihkan kamar</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td><span class="status-badge" style="background-color: #f97316; color: white;">Vacant Dirty</span></td>
                        <td>Kamar checkout yang sudah diassgn room attendant untuk membersihkan kamar</td>
                        <td>13</td>
                        <td><span class="status-badge" style="background-color: #f97316; color: white;">Occupied Clean</span></td>
                        <td>Kamar terisi dan telah selesai dibersihkan oleh room attendant</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td><span class="status-badge" style="background-color: #22c55e; color: white;">Vacant Clean</span></td>
                        <td>Kamar yang sudah dibersihkan room attendant namun belum dicek oleh Leader HK</td>
                        <td>14</td>
                        <td><span class="status-badge" style="background-color: #3b82f6; color: white;">Occupied Ready</span></td>
                        <td>Kamar yang sudah dibersihkan/tamu baru saja checkin</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td><span class="status-badge" style="background-color: #22c55e; color: white;">Vacant Ready</span></td>
                        <td>Kamar yang sudah dicek kelengkapannya dan siap untuk dijual</td>
                        <td>15</td>
                        <td><span class="status-badge" style="background-color: #9ca3af; color: white;">House Use</span></td>
                        <td>Kamar yang digunakan oleh staff hotel</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td><span class="status-badge" style="background-color: #8b5cf6; color: white;">Vacant Uncheck</span></td>
                        <td>Kamar yang harus dibersihkan/dicek kelengkapannya jika kamar blm terjual setelah melalui night audit</td>
                        <td>16</td>
                        <td><span class="status-badge" style="background-color: #ec4899; color: white;">Sleep Out</span></td>
                        <td>Kamar yang sudah dibayar oleh tamu dan tidak ditempati</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td><span class="status-badge" style="background-color: #06b6d4; color: white;">Arrival</span></td>
                        <td>Kamar reservasi yang akan menginap pada H-0</td>
                        <td>17</td>
                        <td><span class="status-badge" style="background-color: #64748b; color: white;">Skipper</span></td>
                        <td>Tamu yang meninggalkan kamar tanpa ada informasi dari Front Office</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td><span class="status-badge" style="background-color: #374151; color: white;">Incognito</span></td>
                        <td>Tamu yang ingin dirahasiakan keberadaannya</td>
                        <td>18</td>
                        <td><span class="status-badge" style="background-color: #eab308; color: black;">Expected Departure</span></td>
                        <td>Kamar yang akan checkout</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Room Status Modal -->
<div id="roomStatusModal" class="modal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
    <div class="modal-content" style="background-color: #fefefe; margin: 5% auto; padding: 0; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Modal Header -->
        <div class="modal-header" style="background-color: #dc2626; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; font-weight: 600;">Room Status</h3>
            <span class="close-modal" onclick="closeRoomModal()" style="cursor: pointer; font-size: 24px; font-weight: bold;">&times;</span>
        </div>
        
        <!-- Modal Body -->
        <div class="modal-body" style="padding: 20px;">
            <form id="roomStatusForm">
                <!-- Room Number Display -->
                <div style="background-color: #fee2e2; border: 1px solid #fecaca; border-radius: 4px; padding: 8px 12px; margin-bottom: 15px;">
                    <strong id="selectedRoomNumber" style="color: #dc2626; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px;">ROOM 205</strong>
                </div>
                
                <!-- Room Status Field -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; font-weight: 600; color: #374151;">Room Status <span style="color: #dc2626;">*</span></label>
                    <select id="roomStatusSelect" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; background-color: white;">
                        <option value="">--Room Status--</option>
                        <option value="available">VR - Vacant Ready</option>
                        <option value="occupied">OC - Occupied</option>
                        <option value="dirty">VD - Vacant Dirty</option>
                        <option value="maintenance">MT - Maintenance</option>
                        <option value="out_of_order">OO - Out Of Order</option>
                        <option value="checkout">CO - Checkout</option>
                        <option value="general_cleaning">GC - General Cleaning</option>
                        <option value="vacant_clean">VC - Vacant Clean</option>
                        <option value="vacant_uncheck">VU - Vacant Uncheck</option>
                        <option value="arrival">AR - Arrival</option>
                        <option value="incognito">IC - Incognito</option>
                        <option value="occupied_dirty">OD - Occupied Dirty</option>
                        <option value="makeup_room">MU - Makeup Room</option>
                        <option value="occupied_clean">OCC - Occupied Clean</option>
                        <option value="house_use">HU - House Use</option>
                        <option value="sleep_out">SO - Sleep Out</option>
                        <option value="skipper">SK - Skipper</option>
                        <option value="expected_departure">ED - Expected Departure</option>
                    </select>
                </div>
                
                <!-- Room Boy Field -->
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; font-weight: 600; color: #374151;">Room Boy <span style="color: #dc2626;">*</span></label>
                    <select id="roomBoySelect" required style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; background-color: white;">
                        <option value="">Room Attendant</option>
                        <option value="attendant_1">Room Attendant 1</option>
                        <option value="attendant_2">Room Attendant 2</option>
                        <option value="attendant_3">Room Attendant 3</option>
                        <option value="attendant_4">Room Attendant 4</option>
                        <option value="housekeeping_1">Housekeeping Staff 1</option>
                        <option value="housekeeping_2">Housekeeping Staff 2</option>
                    </select>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button type="button" onclick="closeRoomModal()" style="padding: 8px 20px; border: 1px solid #d1d5db; background-color: #f9fafb; color: #374151; border-radius: 4px; cursor: pointer; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; font-weight: 600;">Cancel</button>
                    <button type="submit" style="padding: 8px 20px; border: none; background-color: #3b82f6; color: white; border-radius: 4px; cursor: pointer; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; font-weight: 600;">Process</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName + '-content').classList.add('active');
    
    // Add active class to selected tab button
    document.getElementById(tabName + '-tab').classList.add('active');
}

function selectRoom(roomNumber) {
    // Show the modal
    document.getElementById('roomStatusModal').style.display = 'block';
    
    // Update the room number in the modal
    document.getElementById('selectedRoomNumber').textContent = 'ROOM ' + roomNumber;
    
    // Get current room data to pre-populate the form
    const roomCard = document.querySelector(`[data-room-number="${roomNumber}"]`);
    if (roomCard) {
        const currentStatus = roomCard.getAttribute('data-status');
        document.getElementById('roomStatusSelect').value = currentStatus;
    }
    
    // Reset room boy selection
    document.getElementById('roomBoySelect').value = '';
}

function closeRoomModal() {
    document.getElementById('roomStatusModal').style.display = 'none';
}

// Handle form submission
document.getElementById('roomStatusForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const roomNumber = document.getElementById('selectedRoomNumber').textContent.replace('ROOM ', '');
    const newStatus = document.getElementById('roomStatusSelect').value;
    const roomBoy = document.getElementById('roomBoySelect').value;
    
    if (!newStatus || !roomBoy) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Update the room card with new status
    updateRoomStatus(roomNumber, newStatus);
    
    // Close the modal
    closeRoomModal();
    
    // Show success message
    alert(`Room ${roomNumber} status updated to ${newStatus} and assigned to ${roomBoy}`);
});

function updateRoomStatus(roomNumber, newStatus) {
    const roomCard = document.querySelector(`[data-room-number="${roomNumber}"]`);
    if (roomCard) {
        // Remove old status class
        const oldStatus = roomCard.getAttribute('data-status');
        roomCard.classList.remove('status-' + oldStatus.replace(' ', '_').toLowerCase());
        
        // Add new status class
        roomCard.classList.add('status-' + newStatus.replace(' ', '_').toLowerCase());
        roomCard.setAttribute('data-status', newStatus);
        
        // Update status text with proper hotel abbreviations
        let statusText = '';
        switch(newStatus) {
            case 'available': statusText = 'VR'; break;               // Vacant Ready
            case 'occupied': statusText = 'OC'; break;                // Occupied
            case 'dirty': statusText = 'VD'; break;                   // Vacant Dirty
            case 'maintenance': statusText = 'MT'; break;             // Maintenance
            case 'out_of_order': statusText = 'OO'; break;            // Out of Order
            case 'checkout': statusText = 'CO'; break;                // Checkout
            case 'general_cleaning': statusText = 'GC'; break;        // General Cleaning
            case 'vacant_clean': statusText = 'VC'; break;            // Vacant Clean
            case 'vacant_uncheck': statusText = 'VU'; break;          // Vacant Uncheck
            case 'arrival': statusText = 'AR'; break;                 // Arrival
            case 'incognito': statusText = 'IC'; break;               // Incognito
            case 'occupied_dirty': statusText = 'OD'; break;          // Occupied Dirty
            case 'makeup_room': statusText = 'MU'; break;             // Makeup Room
            case 'occupied_clean': statusText = 'OCC'; break;         // Occupied Clean
            case 'house_use': statusText = 'HU'; break;               // House Use
            case 'sleep_out': statusText = 'SO'; break;               // Sleep Out
            case 'skipper': statusText = 'SK'; break;                 // Skipper
            case 'expected_departure': statusText = 'ED'; break;      // Expected Departure
            default: statusText = 'VR';                               // Default to Vacant Ready
        }
        roomCard.querySelector('.room-status').textContent = statusText;
        
        // Update the summary counts
        updateStatusSummary();
    }
}

// Initialize the summary counts when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateStatusSummary();
});

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('roomStatusModal');
    if (event.target == modal) {
        closeRoomModal();
    }
}

function filterRoomsByStatus() {
    applyAllFilters();
}

function updateStatusSummary() {
    // Count all rooms by status (not just visible ones for total counts)
    const allRooms = document.querySelectorAll('.room-card');
    const statusCounts = {
        'dirty': 0,
        'vacant_clean': 0,
        'available': 0,
        'occupied': 0,
        'occupied_dirty': 0,
        'makeup_room': 0,
        'occupied_clean': 0,
        'expected_departure': 0,
        'house_use': 0,
        'sleep_out': 0,
        'checkout': 0,
        'vacant_uncheck': 0,
        'maintenance': 0,
        'out_of_order': 0
    };
    
    allRooms.forEach(room => {
        const status = room.getAttribute('data-status');
        if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
        }
    });
    
    // Update the summary bar counts
    const summaryBar = document.querySelector('.summary-bar');
    if (summaryBar) {
        const spans = summaryBar.querySelectorAll('span');
        spans.forEach(span => {
            const text = span.innerHTML;
            if (text.includes('<strong>VD:</strong>')) {
                span.innerHTML = `<strong>VD:</strong> ${statusCounts['dirty']}`;
            } else if (text.includes('<strong>VC:</strong>')) {
                span.innerHTML = `<strong>VC:</strong> ${statusCounts['vacant_clean']}`;
            } else if (text.includes('<strong>VR:</strong>')) {
                span.innerHTML = `<strong>VR:</strong> ${statusCounts['available']}`;
            } else if (text.includes('<strong>OR:</strong>')) {
                span.innerHTML = `<strong>OR:</strong> ${statusCounts['occupied']}`;
            } else if (text.includes('<strong>OD:</strong>')) {
                span.innerHTML = `<strong>OD:</strong> ${statusCounts['occupied_dirty']}`;
            } else if (text.includes('<strong>MU:</strong>')) {
                span.innerHTML = `<strong>MU:</strong> ${statusCounts['makeup_room']}`;
            } else if (text.includes('<strong>OC:</strong>')) {
                span.innerHTML = `<strong>OC:</strong> ${statusCounts['occupied_clean']}`;
            } else if (text.includes('<strong>ED:</strong>')) {
                span.innerHTML = `<strong>ED:</strong> ${statusCounts['expected_departure']}`;
            } else if (text.includes('<strong>HU:</strong>')) {
                span.innerHTML = `<strong>HU:</strong> ${statusCounts['house_use']}`;
            } else if (text.includes('<strong>SO:</strong>')) {
                span.innerHTML = `<strong>SO:</strong> ${statusCounts['sleep_out']}`;
            } else if (text.includes('<strong>Checkout:</strong>')) {
                span.innerHTML = `<strong>Checkout:</strong> ${statusCounts['checkout']}`;
            } else if (text.includes('<strong>VU:</strong>')) {
                span.innerHTML = `<strong>VU:</strong> ${statusCounts['vacant_uncheck']}`;
            } else if (text.includes('<strong>Maintenance:</strong>')) {
                span.innerHTML = `<strong>Maintenance:</strong> ${statusCounts['maintenance']}`;
            } else if (text.includes('<strong>OO:</strong>')) {
                span.innerHTML = `<strong>OO:</strong> ${statusCounts['out_of_order']}`;
            }
        });
    }
}

function filterRoomsByFloor() {
    applyAllFilters();
}

function filterRoomsByType() {
    applyAllFilters();
}

function applyAllFilters() {
    const selectedStatus = document.getElementById('statusFilter').value;
    const selectedFloor = document.getElementById('floorFilter').value;
    const selectedType = document.getElementById('typeFilter').value;
    const roomCards = document.querySelectorAll('.room-card');
    let visibleCount = 0;
    
    roomCards.forEach(card => {
        const roomStatus = card.getAttribute('data-status');
        const roomFloor = card.getAttribute('data-floor');
        const roomType = card.getAttribute('data-type');
        let shouldShow = true;
        
        // Apply status filter
        if (selectedStatus !== '' && roomStatus !== selectedStatus) {
            shouldShow = false;
        }
        
        // Apply floor filter
        if (selectedFloor !== '' && roomFloor !== selectedFloor) {
            shouldShow = false;
        }
        
        // Apply type filter
        if (selectedType !== '' && roomType !== selectedType) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no rooms match
    if (visibleCount === 0 && (selectedStatus !== '' || selectedFloor !== '' || selectedType !== '')) {
        console.log('No rooms found with current filters');
    }
    
    // Update the grid layout after filtering
    updateStatusSummary();
}
</script>