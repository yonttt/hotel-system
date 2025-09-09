<?php
/**
 * Front Office Module - Laporan - AR Aging Report
 * 
 * This module handles accounts receivable aging analysis
 * 
 * @author Eva Group Hotel System
 * @version 1.0
 */

// Include required files
require_once '../../../config/database.php';

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>

<div class="main-content">
    <div class="content-header">
        <h1>AR Aging Report</h1>
        <p>Account Receivable Aging Analysis Report</p>
    </div>

    <div class="content-card">
        <form method="GET" class="filter-form" style="margin-bottom: 20px;">
            <input type="hidden" name="module" value="ar-aging-report">
            <input type="hidden" name="title" value="AR Aging Report">
            
            <div class="form-row">
                <div class="form-group">
                    <label for="as_of_date">As of Date:</label>
                    <input type="date" name="as_of_date" id="as_of_date" 
                           value="<?php echo isset($_GET['as_of_date']) ? $_GET['as_of_date'] : date('Y-m-d'); ?>" 
                           class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="customer_type">Customer Type:</label>
                    <select name="customer_type" id="customer_type" class="form-control">
                        <option value="">All Customers</option>
                        <option value="corporate" <?php echo (isset($_GET['customer_type']) && $_GET['customer_type'] == 'corporate') ? 'selected' : ''; ?>>Corporate</option>
                        <option value="individual" <?php echo (isset($_GET['customer_type']) && $_GET['customer_type'] == 'individual') ? 'selected' : ''; ?>>Individual</option>
                        <option value="travel_agent" <?php echo (isset($_GET['customer_type']) && $_GET['customer_type'] == 'travel_agent') ? 'selected' : ''; ?>>Travel Agent</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="aging_period">Aging Period:</label>
                    <select name="aging_period" id="aging_period" class="form-control">
                        <option value="30_60_90" <?php echo (isset($_GET['aging_period']) && $_GET['aging_period'] == '30_60_90') ? 'selected' : ''; ?>>30-60-90 Days</option>
                        <option value="30_60_90_120" <?php echo (isset($_GET['aging_period']) && $_GET['aging_period'] == '30_60_90_120') ? 'selected' : ''; ?>>30-60-90-120 Days</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Generate Report</button>
                    <button type="button" onclick="window.print()" class="btn btn-secondary">Print</button>
                </div>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Customer Type</th>
                        <th>Current (0-30)</th>
                        <th>31-60 Days</th>
                        <th>61-90 Days</th>
                        <th>Over 90 Days</th>
                        <th>Total Outstanding</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    // Sample data - replace with actual database query
                    $sample_data = [
                        [
                            'customer_name' => 'PT. ABC Corporation',
                            'customer_type' => 'Corporate',
                            'current' => 5000000,
                            'days_31_60' => 2000000,
                            'days_61_90' => 1000000,
                            'over_90' => 500000,
                            'total' => 8500000
                        ],
                        [
                            'customer_name' => 'John Doe',
                            'customer_type' => 'Individual',
                            'current' => 750000,
                            'days_31_60' => 0,
                            'days_61_90' => 0,
                            'over_90' => 0,
                            'total' => 750000
                        ],
                        [
                            'customer_name' => 'XYZ Travel Agency',
                            'customer_type' => 'Travel Agent',
                            'current' => 3200000,
                            'days_31_60' => 1500000,
                            'days_61_90' => 800000,
                            'over_90' => 200000,
                            'total' => 5700000
                        ]
                    ];

                    $total_current = 0;
                    $total_31_60 = 0;
                    $total_61_90 = 0;
                    $total_over_90 = 0;
                    $grand_total = 0;

                    foreach ($sample_data as $data) {
                        $total_current += $data['current'];
                        $total_31_60 += $data['days_31_60'];
                        $total_61_90 += $data['days_61_90'];
                        $total_over_90 += $data['over_90'];
                        $grand_total += $data['total'];
                        ?>
                        <tr>
                            <td><?php echo $data['customer_name']; ?></td>
                            <td><?php echo $data['customer_type']; ?></td>
                            <td>Rp <?php echo number_format($data['current'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['days_31_60'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['days_61_90'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['over_90'], 0, ',', '.'); ?></td>
                            <td>Rp <?php echo number_format($data['total'], 0, ',', '.'); ?></td>
                        </tr>
                        <?php
                    }
                    ?>
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td colspan="2"><strong>TOTAL</strong></td>
                        <td><strong>Rp <?php echo number_format($total_current, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_31_60, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_61_90, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($total_over_90, 0, ',', '.'); ?></strong></td>
                        <td><strong>Rp <?php echo number_format($grand_total, 0, ',', '.'); ?></strong></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <!-- Aging Summary Chart -->
        <div class="mt-6">
            <h3>Aging Summary</h3>
            <div class="aging-chart">
                <div class="chart-item">
                    <div class="chart-label">Current (0-30 days)</div>
                    <div class="chart-bar">
                        <div class="chart-fill current" style="width: <?php echo ($grand_total > 0) ? ($total_current / $grand_total * 100) : 0; ?>%"></div>
                    </div>
                    <div class="chart-value"><?php echo ($grand_total > 0) ? round($total_current / $grand_total * 100, 1) : 0; ?>%</div>
                </div>
                
                <div class="chart-item">
                    <div class="chart-label">31-60 days</div>
                    <div class="chart-bar">
                        <div class="chart-fill warning" style="width: <?php echo ($grand_total > 0) ? ($total_31_60 / $grand_total * 100) : 0; ?>%"></div>
                    </div>
                    <div class="chart-value"><?php echo ($grand_total > 0) ? round($total_31_60 / $grand_total * 100, 1) : 0; ?>%</div>
                </div>
                
                <div class="chart-item">
                    <div class="chart-label">61-90 days</div>
                    <div class="chart-bar">
                        <div class="chart-fill danger" style="width: <?php echo ($grand_total > 0) ? ($total_61_90 / $grand_total * 100) : 0; ?>%"></div>
                    </div>
                    <div class="chart-value"><?php echo ($grand_total > 0) ? round($total_61_90 / $grand_total * 100, 1) : 0; ?>%</div>
                </div>
                
                <div class="chart-item">
                    <div class="chart-label">Over 90 days</div>
                    <div class="chart-bar">
                        <div class="chart-fill critical" style="width: <?php echo ($grand_total > 0) ? ($total_over_90 / $grand_total * 100) : 0; ?>%"></div>
                    </div>
                    <div class="chart-value"><?php echo ($grand_total > 0) ? round($total_over_90 / $grand_total * 100, 1) : 0; ?>%</div>
                </div>
            </div>
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

.aging-chart {
    margin-top: 20px;
}

.chart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.chart-label {
    width: 150px;
    font-size: 14px;
}

.chart-bar {
    flex: 1;
    height: 20px;
    background: #f0f0f0;
    border-radius: 10px;
    margin: 0 10px;
    overflow: hidden;
}

.chart-fill {
    height: 100%;
    border-radius: 10px;
}

.chart-fill.current {
    background: #28a745;
}

.chart-fill.warning {
    background: #ffc107;
}

.chart-fill.danger {
    background: #fd7e14;
}

.chart-fill.critical {
    background: #dc3545;
}

.chart-value {
    width: 50px;
    text-align: right;
    font-weight: 600;
}

@media print {
    .filter-form, .btn {
        display: none !important;
    }
}
</style>
