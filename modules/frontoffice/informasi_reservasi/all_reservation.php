<?php
// Simple All Reservation Module - Data Table from hotel_reservations
require_once __DIR__ . '/../../../config/database.php';
if (!isset($pdo)) {
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
}
$reservations = $pdo->query("SELECT reservation_no, guest_name, arrival_date, departure_date, room_number, transaction_status FROM hotel_reservations ORDER BY created_at DESC LIMIT 50")->fetchAll();
?>
<div class="p-4">
    <h2 class="text-lg font-semibold mb-4">All Reservations</h2>
    <table class="min-w-full bg-white rounded shadow">
        <thead>
            <tr>
                <th class="px-4 py-2">Reservation No</th>
                <th class="px-4 py-2">Guest Name</th>
                <th class="px-4 py-2">Arrival</th>
                <th class="px-4 py-2">Departure</th>
                <th class="px-4 py-2">Room</th>
                <th class="px-4 py-2">Status</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($reservations as $row): ?>
            <tr>
                <td class="px-4 py-2"><?= htmlspecialchars($row['reservation_no']) ?></td>
                <td class="px-4 py-2"><?= htmlspecialchars($row['guest_name']) ?></td>
                <td class="px-4 py-2"><?= htmlspecialchars($row['arrival_date']) ?></td>
                <td class="px-4 py-2"><?= htmlspecialchars($row['departure_date']) ?></td>
                <td class="px-4 py-2"><?= htmlspecialchars($row['room_number']) ?></td>
                <td class="px-4 py-2"><?= htmlspecialchars($row['transaction_status']) ?></td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
