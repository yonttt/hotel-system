<?php
include_once '../../../config/database.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

<div class="main-content">
    <div class="content-header">
        <h1>Actual Shift Report</h1>
        <p>Laporan aktual per shift periode tertentu</p>
    </div>

    <div class="content-card">
        <form method="GET" class="filter-form" style="margin-bottom: 20px;">
            <input type="hidden" name="module" value="actual-shift-report">
            <input type="hidden" name="title" value="Actual Shift Report">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="tanggal_dari">Tanggal Dari:</label>
                    <input type="date" name="tanggal_dari" id="tanggal_dari" 
                           value="<?php echo isset($_GET['tanggal_dari']) ? $_GET['tanggal_dari'] : date('Y-m-d'); ?>" 
                           class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="tanggal_sampai">Tanggal Sampai:</label>
                    <input type="date" name="tanggal_sampai" id="tanggal_sampai" 
                           value="<?php echo isset($_GET['tanggal_sampai']) ? $_GET['tanggal_sampai'] : date('Y-m-d'); ?>" 
                           class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="shift">Shift:</label>
                    <select name="shift" id="shift" class="form-control">
                        <option value="">Semua Shift</option>
                        <option value="pagi" <?php echo (isset($_GET['shift']) && $_GET['shift'] == 'pagi') ? 'selected' : ''; ?>>Pagi (06:00 - 14:00)</option>
                        <option value="siang" <?php echo (isset($_GET['shift']) && $_GET['shift'] == 'siang') ? 'selected' : ''; ?>>Siang (14:00 - 22:00)</option>
                        <option value="malam" <?php echo (isset($_GET['shift']) && $_GET['shift'] == 'malam') ? 'selected' : ''; ?>>Malam (22:00 - 06:00)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Filter</button>
                    <button type="button" onclick="window.print()" class="btn btn-secondary">Print</button>
                </div>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Shift</th>
                        <th>Room Revenue</th>
                        <th>F&B Revenue</th>
                        <th>Other Revenue</th>
                        <th>Total Revenue</th>
                        <th>Occupancy</th>
                        <th>ADR</th>
                        <th>RevPAR</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $tanggal_dari = isset($_GET['tanggal_dari']) ? $_GET['tanggal_dari'] : date('Y-m-d');
                    $tanggal_sampai = isset($_GET['tanggal_sampai']) ? $_GET['tanggal_sampai'] : date('Y-m-d');
                    $shift_filter = isset($_GET['shift']) ? $_GET['shift'] : '';

                    // Sample data - replace with actual database query
                    $sample_data = [
                        [
                            'tanggal' => date('Y-m-d'),
                            'shift' => 'Pagi',
                            'room_revenue' => 5500000,
                            'fnb_revenue' => 1200000,
                            'other_revenue' => 300000,
                            'total_revenue' => 7000000,
                            'occupancy' => 85.5,
                            'adr' => 650000,
                            'revpar' => 555750
                        ],
                        [
                            'tanggal' => date('Y-m-d'),
                            'shift' => 'Siang',
                            'room_revenue' => 3200000,
                            'fnb_revenue' => 2100000,
                            'other_revenue' => 450000,
                            'total_revenue' => 5750000,
                            'occupancy' => 78.2,
                            'adr' => 680000,
                            'revpar' => 531760
                        ],
                        [
                            'tanggal' => date('Y-m-d'),
                            'shift' => 'Malam',
                            'room_revenue' => 2800000,
                            'fnb_revenue' => 850000,
                            'other_revenue' => 200000,
                            'total_revenue' => 3850000,
                            'occupancy' => 65.8,
                            'adr' => 620000,
                            'revpar' => 407960
                        ]
                    ];

                    $total_room = 0;
                    $total_fnb = 0;
                    $total_other = 0;
                    $total_all = 0;

                    foreach ($sample_data as $data) {
                        if ($shift_filter && strtolower($data['shift']) != $shift_filter) {
                            continue;
                        }

                        $total_room += $data['room_revenue'];
                        $total_fnb += $data['fnb_revenue'];
                        $total_other += $data['other_revenue'];
                        $total_all += $data['total_revenue'];
                        ?>
                        <tr>
                            <td><?php echo date('d/m/Y', strtotime($data['tanggal'])); ?></td>
                            <td><?php echo $data['shift']; ?></td>
                            <td>Rp <?php echo number_format($data['room_revenue'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['fnb_revenue'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['other_revenue'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['total_revenue'], 0, ',', '.'); ?></td>
                            <td><?php echo $data['occupancy']; ?>%</td>
                            <td>Rp <?php echo number_format($data['adr'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['revpar'], 0, ',', '.'); ?></td>
                        </tr>
                        <?php
                    }
                    ?>
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2"><strong>TOTAL</strong></td>
                        <td><strong>Rp <?php echo number_format($total_room, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_fnb, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_other, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_all, 0, ',', '.'); ?></strong></td>
                        <td colspan="3"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>

<style>
.content-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-form .form-row {
    display: flex;
    gap: 15px;
    align-items: end;
    flex-wrap: wrap;
}

.filter-form .form-group {
    display: flex;
    flex-direction: column;
}

.filter-form label {
    margin-bottom: 5px;
    font-weight: 500;
}

.form-control {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn:hover {
    opacity: 0.9;
}

.table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.table th, .table td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table th {
    background: #f8f9fa;
    font-weight: 600;
}

.table tbody tr:hover {
    background: #f8f9fa;
}

.total-row {
    background: #e9ecef !important;
    font-weight: bold;
}

.table-responsive {
    overflow-x: auto;
}

@media print {
    .filter-form, .btn {
        display: none !important;
    }
}
</style>
