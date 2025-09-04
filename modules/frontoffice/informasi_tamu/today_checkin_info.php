<?php
// Check In Today Module
require_once __DIR__ . '/../../../config/database.php';

$date_today = date('Y-m-d');
$stmt = $pdo->prepare("SELECT reservation_number, guest_id, room_id, check_in_date, status FROM reservations WHERE check_in_date = :today AND status IN ('checked_in', 'confirmed')");
$stmt->execute([':today' => $date_today]);
$checkins = $stmt->fetchAll();
?>
<div class="p-4">
    <h2 class="text-lg font-semibold mb-4">Check In Today</h2>
    <table class="min-w-full bg-white rounded shadow">
        <thead>
            <tr>
                <th>Reservation No</th>
                <th>Guest ID</th>
                <th>Room ID</th>
                <th>Check In Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($checkins)): ?>
                <tr><td colspan="5" style="text-align:center;">No check-ins today.</td></tr>
            <?php else: foreach ($checkins as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row['reservation_number']) ?></td>
                    <td><?= htmlspecialchars($row['guest_id']) ?></td>
                    <td><?= htmlspecialchars($row['room_id']) ?></td>
                    <td><?= htmlspecialchars($row['check_in_date']) ?></td>
                    <td><?= htmlspecialchars($row['status']) ?></td>
                </tr>
            <?php endforeach; endif; ?>
        </tbody>
    </table>
</div>
