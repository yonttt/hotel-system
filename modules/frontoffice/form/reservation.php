<?php
// Modul Form Reservasi Kamar
// Kategori: FRONTOFFICE
// Sub-Kategori: FORM

// Cek apakah ada pesan error
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

    <form method="POST" action="home.php?module=reservation&title=Room Reservation Form" class="p-0">

<?php
// Cek apakah user sudah login
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
        $stmt = $conn->query("SELECT COUNT(*) as count FROM guest_reservations");
        $count = $stmt->fetch()['count'];
        $reservation_no = 'RES' . str_pad($count + 1, 8, '0', STR_PAD_LEFT);
        
        $stmt = $conn->prepare("
            INSERT INTO guest_reservations (
                reservation_no, category_market_id, market_segment, member_id, 
                transaction_by, id_card_type, id_card_number, guest_name, guest_title,
                mobile_phone, address, nationality_id, city_id, email,
                arrival_date, departure_date, nights, guest_type,
                guest_count_male, guest_count_female, guest_count_child,
                room_type, room_rate, notes, reservation_status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $reservation_no,
            $_POST['category_market'] ?? 1,
            $_POST['market_segment'] ?? 'Normal',
            $_POST['member_id'] ?? '',
            $_SESSION['username'] ?? '', // Menggunakan username dari session
            $_POST['id_card_type'] ?? 'KTP',
            $_POST['id_card_number'] ?? '',
            $_POST['guest_name'] ?? '',
            $_POST['guest_title'] ?? 'MR',
            $_POST['mobile_phone'] ?? '',
            $_POST['address'] ?? '',
            $_POST['nationality'] ?? 1,
            $_POST['city'] ?? 1,
            $_POST['email'] ?? '',
            $_POST['arrival_date'] ?? date('Y-m-d'),
            $_POST['departure_date'] ?? date('Y-m-d', strtotime('+1 day')),
            $_POST['nights'] ?? 1,
            $_POST['guest_type'] ?? 'Normal',
            $_POST['guest_male'] ?? 0,
            $_POST['guest_female'] ?? 0,
            $_POST['guest_child'] ?? 0,
            $_POST['room_type'] ?? '',
            $_POST['room_rate'] ?? 0,
            $_POST['notes'] ?? '',
            'Reserved', // Selalu set ke Reserved
            $_SESSION['user_id']
        ]);
        
        $success_message = "Reservation saved successfully!";
    } catch (Exception $e) {
        $error_message = "Error saving reservation: " . $e->getMessage();
    }
}

// Fetch data untuk dropdown
$market_segments = $conn->query("SELECT * FROM market_segments WHERE active = 1")->fetchAll();
$countries = $conn->query("SELECT * FROM countries WHERE active = 1")->fetchAll();
$cities = $conn->query("SELECT * FROM cities WHERE active = 1")->fetchAll();
// **FIXED QUERY:** Fetch room types from the 'rooms' table instead of the non-existent 'room_types' table.
$room_types_query = "SELECT room_type as type_name, MIN(price) as base_rate FROM rooms GROUP BY room_type ORDER BY room_type";
$room_types = $conn->query($room_types_query)->fetchAll();


// Fetch reservasi terakhir untuk count
$recent_reservations = $conn->query("SELECT * FROM guest_reservations ORDER BY created_at DESC LIMIT 10")->fetchAll();
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

    <form method="POST" action="home.php?module=reservation&title=Room Reservation Form" class="p-0">
        <div class="grid grid-cols-1 lg:grid-cols-3">
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">RESERVATION NO</label>
                    <input type="text" value="RES<?= str_pad((count($recent_reservations) + 1), 8, '0', STR_PAD_LEFT) ?>" 
                           class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
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
                    <input type="text" name="mobile_phone" class="w-full px-2 py-1 border border-gray-300 text-xs">
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
                    <input type="date" name="arrival_date" value="<?= date('Y-m-d') ?>" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Nights</label>
                    <div class="flex gap-1">
                        <select name="nights" class="w-16 px-2 py-1 border border-gray-300 text-xs">
                            <?php for ($i = 1; $i <= 30; $i++): ?>
                                <option value="<?= $i ?>"><?= $i ?></option>
                            <?php endfor; ?>
                        </select>
                        <span class="px-2 py-1 bg-gray-50 border border-gray-300 text-xs text-gray-600 flex-1">Nights</span>
                    </div>
                </div>

                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Departure</label>
                    <input type="date" name="departure_date" value="<?= date('Y-m-d', strtotime('+1 day')) ?>" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Guest Type</label>
                    <select name="guest_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
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
                    <label class="block text-xs font-medium text-gray-700 mb-1">Room Type</label>
                    <select name="room_type" class="w-full px-2 py-1 border border-gray-300 text-xs">
                        <?php foreach ($room_types as $type): ?>
                            <option value="<?= $type['type_name'] ?>" data-rate="<?= $type['base_rate'] ?>">
                                <?= htmlspecialchars($type['type_name']) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Room Rate</label>
                    <input type="number" name="room_rate" step="0.01" value="0" class="w-full px-2 py-1 border border-gray-300 text-xs">
                </div>

                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Note</label>
                    <textarea name="notes" rows="3" class="w-full px-2 py-1 border border-gray-300 text-xs resize-none"></textarea>
                </div>

                <div class="pt-2">
                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 border border-gray-300 font-medium text-sm transition-colors duration-200">
                        Process Reservation
                    </button>
                </div>
            </div>
            
            <div class="p-4">
                <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Transaction Status</label>
                    <input type="text" name="transaction_status" value="Reservation" class="w-full px-2 py-1 border border-gray-300 text-xs bg-gray-50" readonly>
                </div>
            </div>

        </div>
    </form>
</div>
    </div>
</div>

<script>
// JavaScript untuk modul Form Reservasi Kamar
console.log('Hotel Reservation Form loaded');

document.addEventListener('DOMContentLoaded', function() {
    const arrivalDateInput = document.querySelector('input[name="arrival_date"]');
    const nightsSelect = document.querySelector('select[name="nights"]');
    const departureDateInput = document.querySelector('input[name="departure_date"]');
    const roomTypeSelect = document.querySelector('select[name="room_type"]');
    const roomRateInput = document.querySelector('input[name="room_rate"]');

    function calculateDepartureDate() {
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

    function updateRoomRate() {
        const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
        if (selectedOption) {
            roomRateInput.value = selectedOption.getAttribute('data-rate');
        }
    }
    
    if (arrivalDateInput) arrivalDateInput.addEventListener('change', calculateDepartureDate);
    if (nightsSelect) nightsSelect.addEventListener('change', calculateDepartureDate);
    if (roomTypeSelect) roomTypeSelect.addEventListener('change', updateRoomRate);
    
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
            
            if (!confirm('Are you sure you want to process this reservation?')) {
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
    updateRoomRate();
});
</script>