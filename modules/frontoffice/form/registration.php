<?php
// Modul Form Registrasi Kamar
// Kategori: FRONTOFFICE
// Sub-Kategori: FORM

// Periksa apakah ada error message
if (isset($error_message)): ?>
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <?= htmlspecialchars($error_message) ?>
        </div>
    <?php endif; ?>

<!-- Form Container with Table-like Border -->
<div class="border border-gray-300 bg-white">
    <!-- Compact Header -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-300">
        <h2 class="text-xs font-semibold text-gray-800">REGISTRATION FORM</h2>
        <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
            Room Available
        </button>
    </div>

    <!-- Registration Form -->
    <form method="POST" class="p-0">

<?php
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
        // Generate registration number
        $stmt = $conn->query("SELECT COUNT(*) as count FROM guest_registrations");
        $count = $stmt->fetch()['count'];
        $registration_no = str_pad($count + 1, 10, '0', STR_PAD_LEFT);
        
        $stmt = $conn->prepare("
            INSERT INTO guest_registrations (
                registration_no, category_market_id, market_segment, member_id, 
                transaction_by, id_card_type, id_card_number, guest_name, guest_title,
                mobile_phone, address, nationality_id, city_id, email,
                arrival_date, arrival_time, nights, departure_date, guest_type,
                guest_count_male, guest_count_female, guest_count_child,
                extra_bed_nights, extra_bed_qty, room_number, transaction_status,
                payment_method_id, registration_type_id, notes, payment_amount,
                discount, payment_diskon, deposit, balance, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $registration_no,
            $_POST['category_market'] ?? 1,
            $_POST['market_segment'] ?? 'Normal',
            $_POST['member_id'] ?? '',
            $_POST['transaction_by'] ?? '',
            $_POST['id_card_type'] ?? 'KTP',
            $_POST['id_card_number'] ?? '',
            $_POST['guest_name'] ?? '',
            $_POST['guest_title'] ?? 'MR',
            $_POST['mobile_phone'] ?? '',
            $_POST['address'] ?? '',
            $_POST['nationality'] ?? 1,
            $_POST['city'] ?? 1,
            $_POST['email'] ?? '',
            date('Y-m-d'), // Always use today's date for arrival
            $_POST['arrival_time'] ?? date('H:i'),
            $_POST['nights'] ?? 1,
            $_POST['departure_date'] ?? date('Y-m-d', strtotime('+1 day')),
            $_POST['guest_type'] ?? 'Normal',
            $_POST['guest_male'] ?? 0,
            $_POST['guest_female'] ?? 0,
            $_POST['guest_child'] ?? 0,
            $_POST['extra_bed_nights'] ?? 0,
            $_POST['extra_bed_qty'] ?? 0,
            $_POST['room_number'] ?? '',
            'Registration', // Always set to Registration
            $_POST['payment_method'] ?? 1,
            $_POST['registration_type'] ?? 1,
            $_POST['notes'] ?? '',
            $_POST['payment_amount'] ?? 0,
            $_POST['discount'] ?? 0,
            $_POST['payment_diskon'] ?? 0,
            $_POST['deposit'] ?? 0,
            $_POST['balance'] ?? 0,
            $_SESSION['user_id']
        ]);
        
        $success_message = "Registration saved successfully!";
    } catch (Exception $e) {
        $error_message = "Error saving registration: " . $e->getMessage();
    }
}

// Fetch data for dropdowns
$market_segments = $conn->query("SELECT * FROM market_segments WHERE active = 1")->fetchAll();
$countries = $conn->query("SELECT * FROM countries WHERE active = 1")->fetchAll();
$cities = $conn->query("SELECT * FROM cities WHERE active = 1")->fetchAll();
$payment_methods = $conn->query("SELECT * FROM payment_methods WHERE active = 1")->fetchAll();
$registration_types = $conn->query("SELECT * FROM registration_types WHERE active = 1")->fetchAll();
$rooms = $conn->query("SELECT room_number FROM rooms WHERE status = 'available' ORDER BY room_number")->fetchAll();

// Fetch recent registrations for count
$recent_registrations = $conn->query("SELECT * FROM guest_registrations ORDER BY created_at DESC LIMIT 10")->fetchAll();
?>

<div class="bg-white rounded-lg shadow-lg">
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

    <!-- Registration Form -->
    <form method="POST" class="p-0">
        <!-- Table-like structure -->
        <div class="grid grid-cols-1 lg:grid-cols-3">
            <!-- Left Column -->
            <div class="p-4">
                <!-- Registration Number -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">REGISTRATION NO</label>
                    <input type="text" value="<?= str_pad((count($recent_registrations) + 1), 10, '0', STR_PAD_LEFT) ?>" 
                           class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>

                <!-- Category Market -->
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

                <!-- Market Segment -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Market Segment</label>
                    <select name="market_segment" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Normal" selected>Normal</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>

                <!-- Member ID -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Member ID</label>
                    <input type="text" name="member_id" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Transaction By -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction By</label>
                    <input type="text" name="transaction_by" value="YONATHAN" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- ID Card -->
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

                <!-- Guest Name -->
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

                <!-- Mobile Phone -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Mobile Phone</label>
                    <input type="text" name="mobile_phone" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Address -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" rows="2" class="w-full px-2 py-1 border border-gray-300 text-xs resize-none"></textarea>
                </div>

                <!-- Nationality -->
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

                <!-- City -->
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

                <!-- Email -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>
            </div>

            <!-- Middle Column -->
            <div class="p-4">
                <!-- Arrival Date -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Arrival Date</label>
                    <input type="date" name="arrival_date" value="<?= date('Y-m-d') ?>" class="w-full px-2 py-1 border border-gray-300 text-xs" readonly>
                </div>

                <!-- Nights -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nights</label>
                    <div class="flex gap-1">
                        <select name="nights" class="w-16 px-2 py-1 border border-gray-300 text-xs">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                        <span class="px-2 py-1 bg-gray-50 border border-gray-300 text-xs text-gray-600 flex-1">Nights</span>
                    </div>
                </div>

                <!-- Departure -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Departure</label>
                    <input type="date" name="departure_date" value="<?= date('Y-m-d', strtotime('+1 day')) ?>" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Guest Type -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest Type</label>
                    <select name="guest_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <option value="Normal" selected>Normal</option>
                        <option value="VIP">VIP</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>

                <!-- Guest -->
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

                <!-- Extra Bed -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Extra Bed</label>
                    <div class="flex gap-1">
                        <span class="px-2 py-1 bg-gray-50 border border-gray-300 text-xs text-gray-600 flex-1">Night</span>
                        <input type="number" name="extra_bed_qty" value="0" min="0" class="w-12 px-1 py-1 border border-gray-300 text-xs text-center">
                        <span class="px-2 py-1 bg-gray-50 border border-gray-300 text-xs text-gray-600">Qty</span>
                    </div>
                </div>

                <!-- Room Number -->
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

            <!-- Right Column -->
            <div class="p-4">
                <!-- Transaction Status -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction Status</label>
                    <input type="text" name="transaction_status" value="Registration" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>

                <!-- Payment Method -->
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

                <!-- Registration Type -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Registration Type</label>
                    <select name="registration_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($registration_types as $type): ?>
                            <option value="<?= $type['id'] ?>" <?= $type['name'] == 'Registration' ? 'selected' : '' ?>>
                                <?= htmlspecialchars($type['name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- Note -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Note</label>
                    <textarea name="notes" rows="3" class="w-full px-2 py-1 border border-gray-300 text-xs resize-none"></textarea>
                </div>

                <!-- Payment Amount -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Amount</label>
                    <input type="number" name="payment_amount" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Discount -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Discount</label>
                    <input type="number" name="discount" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Payment - Diskon -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment - Diskon</label>
                    <input type="number" name="payment_diskon" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Deposit -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Deposit</label>
                    <input type="number" name="deposit" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <!-- Balance -->
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Balance</label>
                    <input type="number" name="balance" step="0.01" value="0.00" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>

                <!-- Process Button -->
                <div class="pt-2">
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 border border-gray-300 font-medium text-sm transition-colors duration-200">
                        Process
                    </button>
                </div>
            </div>
        </div>
    </form>
</div>
    </div>
</div>

<script>
// JavaScript untuk modul Form Registrasi Kamar
console.log('Hotel Registration Form loaded');

document.addEventListener('DOMContentLoaded', function() {
    // Set arrival date to today's date automatically (readonly, but updates daily)
    const arrivalDateInput = document.querySelector('input[name="arrival_date"]');
    const nightsSelect = document.querySelector('select[name="nights"]');
    const departureDateInput = document.querySelector('input[name="departure_date"]');
    
    // Function to get today's date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Set arrival date to today automatically
    if (arrivalDateInput) {
        arrivalDateInput.value = getTodayDate();
    }
    
    function calculateDepartureDate() {
        if (arrivalDateInput && departureDateInput && nightsSelect) {
            if (arrivalDateInput.value && nightsSelect.value) {
                const arrivalDate = new Date(arrivalDateInput.value);
                const nights = parseInt(nightsSelect.value);
                const departureDate = new Date(arrivalDate);
                departureDate.setDate(departureDate.getDate() + nights);
                
                const year = departureDate.getFullYear();
                const month = String(departureDate.getMonth() + 1).padStart(2, '0');
                const day = String(departureDate.getDate()).padStart(2, '0');
                
                departureDateInput.value = `${year}-${month}-${day}`;
            }
        }
    }
    
    // Only listen to nights change since arrival date is now readonly
    if (nightsSelect) nightsSelect.addEventListener('change', calculateDepartureDate);
    
    // Auto-calculate balance when payment amounts change
    const paymentAmountInput = document.querySelector('input[name="payment_amount"]');
    const discountInput = document.querySelector('input[name="discount"]');
    const paymentDiskonInput = document.querySelector('input[name="payment_diskon"]');
    const depositInput = document.querySelector('input[name="deposit"]');
    const balanceInput = document.querySelector('input[name="balance"]');
    
    function calculateBalance() {
        if (paymentAmountInput && balanceInput) {
            const paymentAmount = parseFloat(paymentAmountInput.value) || 0;
            const discount = parseFloat(discountInput?.value) || 0;
            const paymentDiskon = parseFloat(paymentDiskonInput?.value) || 0;
            const deposit = parseFloat(depositInput?.value) || 0;
            
            const balance = paymentAmount - discount - paymentDiskon - deposit;
            balanceInput.value = balance.toFixed(2);
        }
    }
    
    if (paymentAmountInput) paymentAmountInput.addEventListener('input', calculateBalance);
    if (discountInput) discountInput.addEventListener('input', calculateBalance);
    if (paymentDiskonInput) paymentDiskonInput.addEventListener('input', calculateBalance);
    if (depositInput) depositInput.addEventListener('input', calculateBalance);
    
    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const guestName = document.querySelector('input[name="guest_name"]')?.value;
            
            if (!guestName?.trim()) {
                alert('Guest name is required');
                e.preventDefault();
                return;
            }
            
            // Confirmation
            if (!confirm('Are you sure you want to process this registration?')) {
                e.preventDefault();
            }
        });
    }
    
    // Auto-uppercase guest name
    const guestNameInput = document.querySelector('input[name="guest_name"]');
    if (guestNameInput) {
        guestNameInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
    }
    
    // Initialize calculations
    calculateDepartureDate();
    calculateBalance();
});
</script>
