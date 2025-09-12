<?php
// Modul Form Reservasi Kamar
// Kategori: FRONTOFFICE
// Sub-Kategori: FORM

// Periksa apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

// Include koneksi database
require_once $_SERVER['DOCUMENT_ROOT'] . '/hotel-system/config/database.php';

$db = new Database();
$conn = $db->getConnection();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Generate reservation number
        $stmt = $conn->query("SELECT COUNT(*) as count FROM hotel_reservations");
        $count = $stmt->fetch()['count'];
        $reservation_no = str_pad($count + 1, 10, '0', STR_PAD_LEFT);

        $stmt = $conn->prepare("
            INSERT INTO hotel_reservations (
                reservation_no, hotel_name, category_market, market_segment, member_id, 
                transaction_by, id_card_type, id_card_number, guest_name, guest_title,
                mobile_phone, address, nationality, city, email,
                arrival_date, nights, departure_date, guest_type,
                guest_male, guest_female, guest_child,
                extra_bed_nights, extra_bed_qty, room_number, transaction_status,
                payment_method, registration_type, note, payment_amount,
                discount, payment_diskon, deposit, balance, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        
        $stmt->execute([
            $reservation_no,
            'New Idola Hotel', // Save the hotel name
            $_POST['category_market'] ?? 'Walkin',
            $_POST['market_segment'] ?? 'Normal',
            $_POST['member_id'] ?? '',
            $_SESSION['username'] ?? '', // Menggunakan username dari session
            $_POST['id_card_type'] ?? 'KTP',
            $_POST['id_card_number'] ?? '',
            $_POST['guest_name'] ?? '',
            $_POST['guest_title'] ?? 'MR',
            $_POST['mobile_phone'] ?? '',
            $_POST['address'] ?? '',
            $_POST['nationality'] ?? 'INDONESIA',
            $_POST['city'] ?? '',
            $_POST['email'] ?? '',
            $_POST['arrival_date'] ?? date('Y-m-d'),
            $_POST['nights'] ?? 1,
            $_POST['departure_date'] ?? date('Y-m-d', strtotime('+1 day')),
            $_POST['guest_type'] ?? 'Normal',
            $_POST['guest_male'] ?? 0,
            $_POST['guest_female'] ?? 0,
            $_POST['guest_child'] ?? 0,
            $_POST['extra_bed_nights'] ?? 0,
            $_POST['extra_bed_qty'] ?? 0,
            $_POST['room_number'] ?? '',
            'Reservation', // Hardcoded status for reservation
            $_POST['payment_method'] ?? 'Cash',
            $_POST['registration_type'] ?? 'Reservation',
            $_POST['note'] ?? '',
            $_POST['payment_amount'] ?? 0,
            $_POST['discount'] ?? 0,
            $_POST['payment_diskon'] ?? 0,
            $_POST['deposit'] ?? 0,
            $_POST['balance'] ?? 0
        ]);
        
        $success_message = "Reservation saved successfully! Reservation No: $reservation_no";
    } catch (PDOException $e) {
        $error_message = "Database error: " . $e->getMessage();
    } catch (Exception $e) {
        $error_message = "Error: " . $e->getMessage();
    }
}

// Fetch data for dropdowns
$market_segments = $conn->query("SELECT * FROM market_segments WHERE active = 1")->fetchAll();
$countries = $conn->query("SELECT * FROM countries WHERE active = 1")->fetchAll();
$cities = $conn->query("SELECT * FROM cities WHERE active = 1")->fetchAll();
$payment_methods = $conn->query("SELECT * FROM payment_methods WHERE active = 1")->fetchAll();
$registration_types = $conn->query("SELECT * FROM registration_types WHERE active = 1")->fetchAll();
$rooms = $conn->query("SELECT room_number FROM rooms WHERE status = 'available' ORDER BY room_number")->fetchAll();

// Fetch recent reservations for count
$recent_reservations = $conn->query("SELECT * FROM hotel_reservations ORDER BY created_at DESC LIMIT 10")->fetchAll();

// Get next reservation number
$next_reservation_no = '0000000001';
try {
    if (isset($conn)) {
        $result = $conn->query("SELECT COUNT(*) as count FROM hotel_reservations");
        if ($result) {
            $count = $result->fetch()['count'];
            $next_reservation_no = str_pad($count + 1, 10, '0', STR_PAD_LEFT);
        }
    }
} catch (Exception $e) {
    // Use default if error
}
?>

<style>
/* Enhanced fonts for better readability */
.enhanced-form {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.enhanced-form label {
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form input, .enhanced-form select, .enhanced-form textarea {
    font-size: 13px !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form h2 {
    font-size: 16px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
.enhanced-form button {
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
</style>

<?php if (isset($success_message)): ?>
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <?= htmlspecialchars($success_message) ?>
    </div>
<?php endif; ?>
    
<?php if (isset($error_message)): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <?= htmlspecialchars($error_message) ?>
    </div>
<?php endif; ?>

<div class="border border-gray-300 bg-white enhanced-form">
    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-300">
        <h2 class="text-xs font-semibold text-gray-800">RESERVATION FORM</h2>
        <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
            Room Available
        </button>
    </div>

    <form method="POST" class="p-0" id="reservationForm" onsubmit="return validateReservationForm()">
        <div class="grid grid-cols-1 lg:grid-cols-3">
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">RESERVATION NO</label>
                    <input type="text" name="reservation_no" value="<?= htmlspecialchars($next_reservation_no) ?>" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Category Market</label>
                    <select name="category_market" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($market_segments as $segment): ?>
                            <option value="<?= $segment['id'] ?>" <?= $segment['name'] == 'Walkin' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($segment['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Market Segment</label>
                    <select name="market_segment" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Normal" selected>Normal</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Member ID</label>
                    <input type="text" name="member_id" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction By</label>
                    <input type="text" name="transaction_by" value="<?= htmlspecialchars($_SESSION['username'] ?? '') ?>" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">ID Card</label>
                    <div class="flex gap-1">
                        <input type="text" name="id_card_number" class="flex-1 px-2 py-1 border border-gray-300 text-xs">
                        <select name="id_card_type" class="w-16 px-1 py-1 border border-gray-300 text-xs">
                            <option value="KTP" selected>KTP</option>
                            <option value="Passport">Passport</option>
                            <option value="SIM">SIM</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest Name</label>
                    <div class="flex gap-1">
                        <input type="text" name="guest_name" class="flex-1 px-2 py-1 border border-gray-300 text-xs" required>
                        <select name="guest_title" class="w-12 px-1 py-1 border border-gray-300 text-xs">
                            <option value="MR" selected>MR</option>
                            <option value="MRS">MRS</option>
                            <option value="MS">MS</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Mobile Phone</label>
                    <input type="text" name="mobile_phone" class="w-full px-2 py-1 border border-gray-300 text-xs" required>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" rows="2" class="w-full px-2 py-1 border border-gray-300 text-xs resize-none"></textarea>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nationality</label>
                    <select name="nationality" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($countries as $country): ?>
                            <option value="<?= $country['id'] ?>" <?= $country['name'] == 'INDONESIA' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($country['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <select name="city" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="">--City--</option>
                        <?php foreach ($cities as $city): ?>
                            <option value="<?= $city['id'] ?>">
                                <?= htmlspecialchars($city['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
            </div>
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Arrival Date</label>
                    <input type="date" name="arrival_date" id="arrivalDate" class="w-full px-2 py-1 border border-gray-300 text-xs" required>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nights</label>
                    <div class="flex gap-1">
                        <select name="nights" id="nightsSelect" onchange="calculateDeparture()" class="w-16 px-2 py-1 border border-gray-300 text-xs">
                            <?php for($i=1; $i<=30; $i++) echo "<option value='$i'>$i</option>"; ?>
                        </select>
                        <span class="px-2 py-1 bg-gray-50 border border-gray-300 text-xs text-gray-600 flex-1">Nights</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Departure</label>
                    <input type="date" name="departure_date" id="departureDate" class="w-full px-2 py-1 border border-gray-300 text-xs" readonly>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest Type</label>
                    <select name="guest_type" id="guest_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="">-- Select Guest Type --</option>
                        <option value="Normal">Normal</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest</label>
                    <div class="flex gap-1">
                        <div class="text-center">
                            <div class="text-xs text-gray-500 mb-1">M</div>
                            <input type="number" name="guest_male" value="1" min="0" class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-gray-500 mb-1">F</div>
                            <input type="number" name="guest_female" value="0" min="0" class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                        </div>
                        <div class="text-center">
                            <div class="text-xs text-gray-500 mb-1">C</div>
                            <input type="number" name="guest_child" value="0" min="0" class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Extra Bed</label>
                    <div class="flex gap-1">
                        <input type="number" name="extra_bed_nights" min="0" value="0" placeholder="Night"
                               class="flex-1 px-1 py-1 border border-gray-300 text-xs text-center">
                        <input type="number" name="extra_bed_qty" min="0" value="0" placeholder="Qty"
                               class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Room Number</label>
                    <select name="room_number" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="">None selected</option>
                        <?php foreach ($rooms as $room): ?>
                            <option value="<?= $room['room_number'] ?>">
                                <?= htmlspecialchars($room['room_number']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction Status</label>
                    <input type="text" name="transaction_status" value="Reservation" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                    <select name="payment_method" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($payment_methods as $method): ?>
                            <option value="<?= $method['id'] ?>" <?= $method['name'] == 'Debit BCA 446' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($method['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Reservation Type</label>
                    <select name="reservation_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($registration_types as $type): ?>
                            <option value="<?= $type['id'] ?>" <?= $type['name'] == 'Reservation' ? 'selected' : '' ?> >
                                <?= htmlspecialchars($type['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Note</label>
                    <textarea name="note" rows="3" class="w-full px-2 py-1 border border-gray-300 text-xs resize-none"></textarea>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Amount</label>
                    <input type="number" name="payment_amount" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Discount</label>
                    <input type="number" name="discount" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment - Diskon</label>
                    <input type="number" name="payment_diskon" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Deposit</label>
                    <input type="number" name="deposit" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Balance</label>
                    <input type="number" name="balance" step="0.01" value="0.00" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>
                <div class="pt-2">
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 border border-gray-300 font-medium text-sm transition-colors duration-200">
                        Process
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>

<script>
    // Set default arrival date to tomorrow
    document.addEventListener('DOMContentLoaded', function () {
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
    
    // Add event listener for nights changes
    document.getElementById('nightsSelect').addEventListener('change', calculateDeparture);

    // Form validation
    function validateReservationForm() {
        // Validation logic here
        return confirm('Are you sure you want to save this reservation?');
    }
</script>