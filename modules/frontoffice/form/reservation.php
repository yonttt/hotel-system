<?php
// Modul Form Reservasi Kamar
// Kategori: FRONTOFFICE
// Sub-Kategori: FORM

// Include database connection
require_once __DIR__ . '/../../../config/database.php';
// Ensure $pdo is defined from database.php
if (!isset($pdo)) {
    try {
        $pdo = new PDO($dsn, $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (Exception $e) {
        die('Database connection failed: ' . $e->getMessage());
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reservation_no = $_POST['reservation_no'];
    $category_market = $_POST['category_market'];
    $market_segment = $_POST['market_segment'];
    $member_id = $_POST['member_id'];
    $transaction_by = $_POST['transaction_by'];
    $id_card_type = $_POST['id_card_type'];
    $id_card_number = $_POST['id_card_number'];
    $guest_title = $_POST['guest_title'];
    $guest_name = $_POST['guest_name'];
    $mobile_phone = $_POST['mobile_phone'];
    $address = $_POST['address'];
    $nationality = $_POST['nationality'];
    $city = $_POST['city'];
    $email = $_POST['email'];
    $arrival_date = $_POST['arrival_date'];
    $nights = $_POST['nights'];
    $departure_date = $_POST['departure_date'];
    $guest_type = $_POST['guest_type'];
    $guest_male = $_POST['guest_male'];
    $guest_female = $_POST['guest_female'];
    $guest_child = $_POST['guest_child'];
    $extra_bed_nights = $_POST['extra_bed_nights'];
    $extra_bed_qty = $_POST['extra_bed_qty'];
    $room_number = $_POST['room_number'];
    $transaction_status = $_POST['transaction_status'];
    $payment_method = $_POST['payment_method'];
    $registration_type = $_POST['registration_type'];
    $note = $_POST['note'];
    $payment_amount = $_POST['payment_amount'];
    $discount = $_POST['discount'];
    $payment_diskon = $_POST['payment_diskon'];
    $deposit = $_POST['deposit'];
    $balance = $_POST['balance'];

    try {
        $sql = "INSERT INTO hotel_reservations (reservation_no, category_market, market_segment, member_id, transaction_by, id_card_type, id_card_number, guest_title, guest_name, mobile_phone, address, nationality, city, email, arrival_date, nights, departure_date, guest_type, guest_male, guest_female, guest_child, extra_bed_nights, extra_bed_qty, room_number, transaction_status, payment_method, registration_type, note, payment_amount, discount, payment_diskon, deposit, balance, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $reservation_no, $category_market, $market_segment, $member_id, $transaction_by, $id_card_type, $id_card_number, $guest_title, $guest_name, $mobile_phone, $address, $nationality, $city, $email, $arrival_date, $nights, $departure_date, $guest_type, $guest_male, $guest_female, $guest_child, $extra_bed_nights, $extra_bed_qty, $room_number, $transaction_status, $payment_method, $registration_type, $note, $payment_amount, $discount, $payment_diskon, $deposit, $balance
        ]);
        echo "<script>alert('Reservation saved successfully! Reservation No: $reservation_no'); window.location.href='home.php?module=reservation&title=Room Reservation Form';</script>";
        exit;
    } catch (PDOException $e) {
        $error_message = "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Get next reservation number
$next_reservation_no = '0000000001';
try {
    if (isset($pdo)) {
        $result = $pdo->query("SELECT COUNT(*) as count FROM hotel_reservations");
        if ($result) {
            $count = $result->fetch()['count'];
            $next_reservation_no = str_pad($count + 1, 10, '0', STR_PAD_LEFT);
        }
    }
} catch (Exception $e) {
    // Use default if error
}

// Periksa apakah ada error message
if (isset($error_message)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <?= htmlspecialchars($error_message) ?>
        </div>
    <?php endif; ?>

<!-- Form Container -->
<div class="bg-white p-6">
    <form method="POST" class="space-y-6" id="reservationForm" onsubmit="return validateReservationForm()">
        
        <!-- First Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Reservation No -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">RESERVATION NO</label>
                <input type="text" name="reservation_no" value="<?= $next_reservation_no ?>" readonly
                       class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-sm">
            </div>
            
            <!-- Arrival Date -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
                <input type="date" name="arrival_date" id="arrivalDate" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <!-- Transaction Status -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Status</label>
                <select name="transaction_status" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Status</option>
                    <option value="Pending" selected>Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        <!-- Second Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Category Market -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Category Market</label>
                <select name="category_market" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Walkin" selected>Walkin</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Online">Online</option>
                    <option value="Travel Agent">Travel Agent</option>
                </select>
            </div>
            
            <!-- Nights -->
            <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                <div class="flex items-center gap-2">
                    <select name="nights" id="nightsSelect" onchange="calculateDeparture()"
                            class="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <?php for($i = 1; $i <= 30; $i++): ?>
                            <option value="<?= $i ?>" <?= $i == 1 ? 'selected' : '' ?>><?= $i ?></option>
                        <?php endfor; ?>
                    </select>
                    <span class="text-sm text-gray-600">Nights</span>
                </div>
            </div>
            
            <!-- Payment Method -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select name="payment_method" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Debit BCA 446" selected>Debit BCA 446</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Transfer">Transfer</option>
                </select>
            </div>
        </div>

        <!-- Third Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Market Segment -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Market Segment</label>
                <select name="market_segment" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Normal" selected>Normal</option>
                    <option value="VIP">VIP</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Group">Group</option>
                </select>
            </div>
            
            <!-- Departure -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <input type="date" name="departure_date" id="departureDate" required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <!-- Registration Type -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Registration Type</label>
                <select name="registration_type" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Reservasi" selected>Reservasi</option>
                    <option value="Walkin">Walkin</option>
                    <option value="Group">Group</option>
                </select>
            </div>
        </div>

        <!-- Fourth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Member ID -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                <input type="text" name="member_id" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Member ID (optional)">
            </div>
            
            <!-- Guest Type -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Guest Type</label>
                <select name="guest_type" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Normal" selected>Normal</option>
                    <option value="VIP">VIP</option>
                    <option value="Corporate">Corporate</option>
                </select>
            </div>
            
            <!-- Note -->
            <div class="col-span-6">
                <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea name="note" rows="1" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Additional notes"></textarea>
            </div>
        </div>

        <!-- Fifth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Transaction By -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Transaction By</label>
                <input type="text" name="transaction_by" value="YONATHAN" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <!-- Guest Count -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Guest</label>
                <div class="grid grid-cols-3 gap-2">
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">M</label>
                        <input type="number" name="guest_male" min="0" value="1" 
                               class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">F</label>
                        <input type="number" name="guest_female" min="0" value="0" 
                               class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center">
                    </div>
                    <div>
                        <label class="block text-xs text-gray-600 mb-1">C</label>
                        <input type="number" name="guest_child" min="0" value="0" 
                               class="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center">
                    </div>
                </div>
            </div>
            
            <!-- Payment Amount -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <input type="number" name="payment_amount" step="0.01" min="0" value="0" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>

        <!-- Sixth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- ID Card -->
            <div class="col-span-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Card</label>
                <div class="flex gap-2">
                    <input type="text" name="id_card_number" 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="ID Card Number">
                    <select name="id_card_type" 
                            class="w-20 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="KTP" selected>KTP</option>
                        <option value="SIM">SIM</option>
                        <option value="PASSPORT">PASSPORT</option>
                    </select>
                </div>
            </div>
            
            <!-- Extra Bed -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Extra Bed</label>
                <div class="flex gap-2">
                    <input type="number" name="extra_bed_nights" min="0" value="0" placeholder="Night"
                           class="flex-1 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <input type="number" name="extra_bed_qty" min="0" value="0" placeholder="Qty"
                           class="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            
            <!-- Discount -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                <input type="number" name="discount" step="0.01" min="0" value="0" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>

        <!-- Seventh Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Guest Name -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <div class="flex gap-2">
                    <select name="guest_title" 
                            class="w-16 px-2 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="MR" selected>MR</option>
                        <option value="MRS">MRS</option>
                        <option value="MS">MS</option>
                        <option value="DR">DR</option>
                    </select>
                    <input type="text" name="guest_name" required 
                           class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Guest Name">
                </div>
            </div>
            
            <!-- Room Number -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <select name="room_number" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" selected>None selected</option>
                    <option value="101">101</option>
                    <option value="102">102</option>
                    <option value="103">103</option>
                    <option value="201">201</option>
                    <option value="202">202</option>
                    <option value="203">203</option>
                </select>
            </div>
            
            <!-- Payment - Diskon -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment - Diskon</label>
                <input type="number" name="payment_diskon" step="0.01" min="0" value="0" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>

        <!-- Eighth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Mobile Phone -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
                <input type="tel" name="mobile_phone" required 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Phone Number">
            </div>
            
            <!-- Empty column for spacing -->
            <div class="col-span-3"></div>
            
            <!-- Deposit -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Deposit</label>
                <input type="number" name="deposit" step="0.01" min="0" value="0" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
        </div>

        <!-- Ninth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Address -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea name="address" rows="2" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Address"></textarea>
            </div>
            
            <!-- Empty column for spacing -->
            <div class="col-span-3"></div>
            
            <!-- Balance -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                <input type="number" name="balance" step="0.01" value="0.00" readonly
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100">
            </div>
        </div>

        <!-- Tenth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Nationality -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select name="nationality" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="INDONESIA" selected>INDONESIA</option>
                    <option value="SINGAPORE">SINGAPORE</option>
                    <option value="MALAYSIA">MALAYSIA</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="AUSTRALIA">AUSTRALIA</option>
                </select>
            </div>
        </div>

        <!-- Eleventh Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- City -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select name="city" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="" selected>--City--</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Medan">Medan</option>
                    <option value="Semarang">Semarang</option>
                </select>
            </div>
        </div>

        <!-- Twelfth Row -->
        <div class="grid grid-cols-12 gap-4">
            <!-- Email -->
            <div class="col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="Email Address">
            </div>
        </div>

        <!-- Process Button -->
        <div class="flex justify-center mt-8">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg text-lg transition duration-300">
                Process
            </button>
        </div>
    </form>
</div>

<script>
// Set default arrival date to tomorrow
document.addEventListener('DOMContentLoaded', function() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('arrivalDate').value = tomorrow.toISOString().split('T')[0];
    
    calculateDeparture();
});

// Calculate departure date based on arrival and nights
function calculateDeparture() {
    const arrivalDate = new Date(document.getElementById('arrivalDate').value);
    const nights = parseInt(document.getElementById('nightsSelect').value);
    
    if (arrivalDate && nights) {
        const departureDate = new Date(arrivalDate);
        departureDate.setDate(departureDate.getDate() + nights);
        document.getElementById('departureDate').value = departureDate.toISOString().split('T')[0];
    }
}

// Add event listener for arrival date changes
document.getElementById('arrivalDate').addEventListener('change', calculateDeparture);

// Form validation
function validateReservationForm() {
    const arrivalDate = new Date(document.getElementById('arrivalDate').value);
    const departureDate = new Date(document.getElementById('departureDate').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if arrival date is not in the past
    if (arrivalDate < today) {
        alert('Arrival date cannot be in the past!');
        return false;
    }
    
    // Check if departure is after arrival
    if (departureDate <= arrivalDate) {
        alert('Departure date must be after arrival date!');
        return false;
    }
    
    return confirm('Are you sure you want to save this reservation?');
}
</script>