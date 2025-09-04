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
    // (PHP form handling logic remains here...)
    // This part does not affect the visual layout
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
    $reservation_type = $_POST['reservation_type'];
    $note = $_POST['note'];
    $payment_amount = $_POST['payment_amount'];
    $discount = $_POST['discount'];
    $payment_diskon = $_POST['payment_diskon'];
    $deposit = $_POST['deposit'];
    $balance = $_POST['balance'];

    try {
    $sql = "INSERT INTO hotel_reservations (reservation_no, category_market, market_segment, member_id, transaction_by, id_card_type, id_card_number, guest_title, guest_name, mobile_phone, address, nationality, city, email, arrival_date, nights, departure_date, guest_type, guest_male, guest_female, guest_child, extra_bed_nights, extra_bed_qty, room_number, transaction_status, payment_method, reservation_type, note, payment_amount, discount, payment_diskon, deposit, balance, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $reservation_no, $category_market, $market_segment, $member_id, $transaction_by, $id_card_type, $id_card_number, $guest_title, $guest_name, $mobile_phone, $address, $nationality, $city, $email, $arrival_date, $nights, $departure_date, $guest_type, $guest_male, $guest_female, $guest_child, $extra_bed_nights, $extra_bed_qty, $room_number, $transaction_status, $payment_method, $reservation_type, $note, $payment_amount, $discount, $payment_diskon, $deposit, $balance
        ]);
        echo "<script>alert('Reservation saved successfully! Reservation No: $reservation_no'); window.location.href='home.php?module=frontoffice/form/reservation&title=Room Reservation Form';</script>";
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
?>

<?php // Periksa apakah ada error message
if (isset($error_message)): ?>
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <?= htmlspecialchars($error_message) ?>
    </div>
<?php endif; ?>

<div class="border border-gray-300 bg-white">
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
                        <option value="Walkin" selected>Walkin</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Online">Online</option>
                        <option value="Travel Agent">Travel Agent</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Market Segment</label>
                    <select name="market_segment" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Normal" selected>Normal</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Group">Group</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Member ID</label>
                    <input type="text" name="member_id" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction By</label>
                    <input type="text" name="transaction_by" value="YONATHAN" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">ID Card</label>
                    <div class="flex gap-1">
                        <input type="text" name="id_card_number" class="flex-1 px-2 py-1 border border-gray-300 text-xs">
                        <select name="id_card_type" class="w-16 px-1 py-1 border border-gray-300 text-xs">
                            <option value="KTP" selected>KTP</option>
                            <option value="SIM">SIM</option>
                            <option value="PASSPORT">PASSPORT</option>
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
                        <option value="INDONESIA" selected>INDONESIA</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">City</label>
                    <select name="city" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="">--City--</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
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
                    <input type="date" name="departure_date" id="departureDate" class="w-full px-2 py-1 border border-gray-300 text-xs" required>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest Type</label>
                    <select name="guest_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Normal" selected>Normal</option>
                        <option value="VIP">VIP</option>
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
                        <input type="number" name="extra_bed_nights" value="0" min="0" class="flex-1 px-1 py-1 border border-gray-300 text-xs text-center">
                        <input type="number" name="extra_bed_qty" value="0" min="0" class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Room Number</label>
                    <select name="room_number" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="">None selected</option>
                        <option value="101">101</option>
                        <option value="102">102</option>
                    </select>
                </div>
            </div>
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction Status</label>
                    <select name="transaction_status" class="w-full px-2 py-1 border border-gray-300 text-xs" required>
                        <option value="Pending" selected>Pending</option>
                        <option value="Confirmed">Confirmed</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
                    <select name="payment_method" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Cash" selected>Cash</option>
                        <option value="Card">Card</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Registration Type</label>
                    <select name="reservation_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Reservation" selected>Reservation</option>
                        <option value="Walk-in">Walk-in</option>
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

    // Form validation
    function validateReservationForm() {
        // Validation logic here
        return confirm('Are you sure you want to save this reservation?');
    }
</script>