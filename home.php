<?php
/**
 * Eva Group Hotel Management System - Main Dashboard
 * 
 * This is the main application file that handles:
 * - User authentication and session management
 * - Sidebar navigation and module routing
 * - Dashboard layout and structure
 * 
 * @author Yonttt
 * @version 2.0
 * @since 2025
 */

// Core includes and authentication
require_once 'includes/auth.php';

$auth = new Auth();
$auth->requireLogin();

// User session variables
$username = $_SESSION['username'] ?? 'User';
$userRole = $_SESSION['user_role'] ?? 'guest';

// Handle logout request
if (isset($_GET['logout'])) {
    $auth->logout();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eva Group Hotel Management System - Home</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="js/fast-loader.js" defer></script>
</head>

<body class="dashboard-page">
    <div class="flex h-screen bg-gray-100">
        
        <!-- ===== SIDEBAR NAVIGATION ===== -->
        <aside class="sidebar">
            <!-- Sidebar Header -->
            <div class="sidebar-header">
                <h1 class="sidebar-brand">EVA GROUP HOTEL MANAGEMENT</h1>
            </div>

            <!-- Main Navigation Menu -->
            <nav class="sidebar-nav">
                <ul class="space-y-2">
                    
                    <!-- ===== HOME NAVIGATION ===== -->
                    <li class="nav-item">
                        <a href="#" onclick="resetSidebarAndGoHome(); return false;" class="nav-link active">
                            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            HOME
                        </a>
                    </li>
                    
                    <!-- ===== OPERATIONAL MODULES ===== -->
                    <li class="nav-group">
                        <button class="nav-group-header" onclick="toggleSubmenu('operational')">
                            <div style="display: flex; align-items: center;">
                                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                OPERATIONAL
                            </div>
                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        <ul class="nav-submenu" id="operational-submenu">
                            
                            <!-- ===== ADJUSTMENT DEPARTMENT ===== -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('adjustment')">
                                    <span>Adjustment</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                
                                <ul class="nav-submenu" id="adjustment-submenu">
                                    
                                    <!-- === Food & Beverage === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfoodbeverage')">
                                            <span>Food & Beverage</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfoodbeverage-submenu">
                                            <li><a href="home.php?module=transaction-history&title=Transaction History" class="nav-link">Transaction History</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Front Office === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentfrontoffice')">
                                            <span>Front Office</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentfrontoffice-submenu">
                                            <li><a href="home.php?module=additional-deposit&title=Additional Deposit" class="nav-link">Additional Deposit</a></li>
                                            <li><a href="home.php?module=charge-to-room&title=Charge To Room" class="nav-link">Charge To Room</a></li>
                                            <li><a href="home.php?module=clearance-deposit&title=Clearance Deposit" class="nav-link">Clearance Deposit</a></li>
                                            <li><a href="home.php?module=clearance-deposit-pending&title=Clearance Deposit Pending" class="nav-link">Clearance Deposit Pending</a></li>
                                            <li><a href="home.php?module=double-checkin&title=Double Checkin" class="nav-link">Double Checkin</a></li>
                                            <li><a href="home.php?module=extra-bed&title=Extra Bed" class="nav-link">Extra Bed</a></li>
                                            <li><a href="home.php?module=extrabill&title=Extrabill" class="nav-link">Extrabill</a></li>
                                            <li><a href="home.php?module=guest-folio&title=Guest Folio" class="nav-link">Guest Folio</a></li>
                                            <li><a href="home.php?module=guest-ledger&title=Guest Ledger" class="nav-link">Guest Ledger</a></li>
                                            <li><a href="home.php?module=late-checkout&title=Late Checkout" class="nav-link">Late Checkout</a></li>
                                            <li><a href="home.php?module=market-segment&title=Market Segment" class="nav-link">Market Segment</a></li>
                                            <li><a href="home.php?module=night-audit&title=Night Audit" class="nav-link">Night Audit</a></li>
                                            <li><a href="home.php?module=other-extrabill&title=Other Extrabill" class="nav-link">Other Extrabill</a></li>
                                            <li><a href="home.php?module=payment-pending&title=Payment Pending" class="nav-link">Payment Pending</a></li>
                                            <li><a href="home.php?module=payment&title=Payment" class="nav-link">Payment</a></li>
                                            <li><a href="home.php?module=room-status&title=Room Status" class="nav-link">Room Status</a></li>
                                            <li><a href="home.php?module=upnormal-payment&title=Upnormal Payment" class="nav-link">Upnormal Payment</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Kos === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentkos')">
                                            <span>Kos</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentkos-submenu">
                                            <li><a href="home.php?module=kos-payment&title=Kos Payment" class="nav-link">Payment</a></li>
                                            <li><a href="home.php?module=kos-room-charge&title=Kos Room Charge" class="nav-link">Room Charge</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Laundry === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentlaundry')">
                                            <span>Laundry</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentlaundry-submenu">
                                            <li><a href="home.php?module=laundry-transaction&title=Laundry Transaction" class="nav-link">Laundry Transaction</a></li>
                                        </ul>
                                    </li>
                                    
                                    <!-- === Meeting Room === -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('adjustmentmeetingroom')">
                                            <span>Meeting Room</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="adjustmentmeetingroom-submenu">
                                            <li><a href="home.php?module=meeting-room-deposit&title=Meeting Room Deposit" class="nav-link">Meeting Room Deposit</a></li>
                                            <li><a href="home.php?module=meeting-room-refund&title=Meeting Room Refund" class="nav-link">Meeting Room Refund</a></li>
                                            <li><a href="home.php?module=meeting-room-trans&title=Meeting Room Trans" class="nav-link">Meeting Room Trans</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Food & Beverage -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('foodbeverage')">
                                    <span>Food & Beverage</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="foodbeverage-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragechart')">
                                            <span>Chart & Presentase</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragechart-submenu">
                                            <li><a href="home.php?module=menu-fast-moving&title=Menu Fast Moving" class="nav-link">Menu Fast Moving</a></li>
                                            <li><a href="home.php?module=menu-slow-moving&title=Menu Slow Moving" class="nav-link">Menu Slow Moving</a></li>
                                            <li><a href="home.php?module=sales-chart&title=Sales Chart" class="nav-link">Sales Chart</a></li>
                                            <li><a href="home.php?module=sales-by-category&title=Sales by Category" class="nav-link">Sales by Category</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeverageform')">
                                            <span>Transaction Forms</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeverageform-submenu">
                                            <li><a href="home.php?module=direct-purchase&title=Direct Purchase" class="nav-link">Direct Purchase</a></li>
                                            <li><a href="home.php?module=stock-request&title=Stock Request" class="nav-link">Stock Request</a></li>
                                            <li><a href="home.php?module=external-guest&title=External Guest" class="nav-link">External Guest</a></li>
                                            <li><a href="home.php?module=event-menu-setup&title=Event Menu Setup" class="nav-link">Event Menu Setup</a></li>
                                            <li><a href="home.php?module=sales-transaction&title=Sales Transaction" class="nav-link">Sales Transaction</a></li>
                                            <li><a href="home.php?module=pending-transaction&title=Pending Transaction" class="nav-link">Pending Transaction</a></li>
                                            <li><a href="home.php?module=item-usage&title=Item Usage" class="nav-link">Item Usage</a></li>
                                            <li><a href="home.php?module=expired-damaged-items&title=Expired/Damaged Items" class="nav-link">Expired/Damaged Items</a></li>
                                            <li><a href="home.php?module=restaurant-stock-taking&title=Restaurant Stock Taking" class="nav-link">Restaurant Stock Taking</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeverageinfo')">
                                            <span>Information</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeverageinfo-submenu">
                                            <li><a href="home.php?module=stock-request-info&title=Stock Request Info" class="nav-link">Stock Request Info</a></li>
                                            <li><a href="home.php?module=today-transaction&title=Today Transaction" class="nav-link">Today Transaction</a></li>
                                            <li><a href="home.php?module=room-service-request&title=Room Service Request" class="nav-link">Room Service Request</a></li>
                                            <li><a href="home.php?module=receivable-info&title=Receivable Info" class="nav-link">Receivable Info</a></li>
                                            <li><a href="home.php?module=item-stock-info&title=Item Stock Info" class="nav-link">Item Stock Info</a></li>
                                            <li><a href="home.php?module=stock-card&title=Stock Card" class="nav-link">Stock Card</a></li>
                                            <li><a href="home.php?module=banquet-receivable&title=Banquet Receivable" class="nav-link">Banquet Receivable</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragelaporan')">
                                            <span>Reports</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragelaporan-submenu">
                                            <li><a href="home.php?module=night-audit-fnb&title=Night Audit F&B" class="nav-link">Night Audit F&B</a></li>
                                            <li><a href="home.php?module=restaurant-sales-per-item&title=Restaurant Sales Per Item" class="nav-link">Restaurant Sales Per Item</a></li>
                                            <li><a href="home.php?module=restaurant-sales&title=Restaurant Sales" class="nav-link">Restaurant Sales</a></li>
                                            <li><a href="home.php?module=shift-report&title=Shift Report" class="nav-link">Shift Report</a></li>
                                            <li><a href="home.php?module=restaurant-guest-report&title=Restaurant Guest Report" class="nav-link">Restaurant Guest Report</a></li>
                                            <li><a href="home.php?module=restaurant-stocktaking-history&title=Restaurant Stocktaking History" class="nav-link">Restaurant Stocktaking History</a></li>
                                            <li><a href="home.php?module=restaurant-shift-report&title=Restaurant Shift Report" class="nav-link">Restaurant Shift Report</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('foodbeveragemaster')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="foodbeveragemaster-submenu">
                                            <li><a href="home.php?module=master-discount&title=Master Discount" class="nav-link">Master Discount</a></li>
                                            <li><a href="home.php?module=table-master&title=Table Master" class="nav-link">Table Master</a></li>
                                            <li><a href="home.php?module=restaurant-menu-master&title=Restaurant Menu Master" class="nav-link">Restaurant Menu Master</a></li>
                                            <li><a href="home.php?module=restaurant-menu-category&title=Restaurant Menu Category" class="nav-link">Restaurant Menu Category</a></li>
                                            <li><a href="home.php?module=restaurant-menu-type&title=Restaurant Menu Type" class="nav-link">Restaurant Menu Type</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Front Office -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('frontoffice')">
                                    <span>Front Office</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu show" id="frontoffice-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficechart')">
                                            <span>Charts & Analytics</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficechart-submenu">
                                            <li><a href="home.php?module=monthly-room-chart&title=Monthly Room Chart" class="nav-link">Monthly Room Chart</a></li>
                                            <li><a href="home.php?module=monthly-revenue-chart&title=Monthly Revenue Chart" class="nav-link">Monthly Revenue Chart</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeform')">
                                            <span>Transaction Forms</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu show" id="frontofficeform-submenu">
                                            <li><a href="home.php?module=direct-purchase-fo&title=Direct Purchase FO" class="nav-link">Direct Purchase FO</a></li>
                                            <li><a href="home.php?module=refresh-room-status&title=Refresh Room Status" class="nav-link">Refresh Room Status</a></li>
                                            <li><a href="home.php?module=group-registration&title=Group Registration" class="nav-link">Group Registration</a></li>
                                            <li><a href="home.php?module=laundry-transaction&title=Laundry Transaction" class="nav-link">Laundry Transaction</a></li>
                                            <li><a href="home.php?module=reservation&title=Room Reservation Form" class="nav-link">Room Reservation Form</a></li>
                                            <li><a href="home.php?module=registration&title=Room Registration Form" class="nav-link">Room Registration Form</a></li>
                                            <li><a href="home.php?module=kost-registration&title=Kost Registration Form" class="nav-link">Kost Registration Form</a></li>
                                            <li><a href="home.php?module=kost-reservation&title=Kost Reservation Form" class="nav-link">Kost Reservation Form</a></li>
                                            <li><a href="home.php?module=meeting-room-transaction&title=Meeting Room Transaction" class="nav-link">Meeting Room Transaction</a></li>
                                            <li><a href="home.php?module=extrabill-form&title=Extrabill Form" class="nav-link">Extrabill Form</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinfo')">
                                            <span>Reservation Info</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinfo-submenu">
                                            <li><a href="home.php?module=info-reservasi-hari-ini&title=Reservation Today" class="nav-link">Reservation Today</a></li>
                                            <li><a href="home.php?module=deposit-report&title=Deposit Report" class="nav-link">Reservation By Deposit</a></li>
                                            <li><a href="home.php?module=group-reservation&title=Group Reservation" class="nav-link">All Reservation</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinformasi')">
                                            <span>Information</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinformasi-submenu">
                                            <li><a href="home.php?module=info-kamar-available&title=Available Room Info" class="nav-link">Available Room Info</a></li>
                                            <li><a href="home.php?module=guest-history&title=Guest History" class="nav-link">Guest History</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficeinformasitamu')">
                                            <span>Guest Information</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficeinformasitamu-submenu">
                                            <li><a href="home.php?module=guest-history&title=Guest History" class="nav-link">Guest Research</a></li>
                                            <li><a href="home.php?module=info-checkout-hari-ini&title=Check In Today" class="nav-link">Check In Today</a></li>
                                            <li><a href="home.php?module=early-checkout&title=Early Checkout" class="nav-link">Early Checkout</a></li>
                                            <li><a href="home.php?module=info-pending-checkout&title=Expected Departure" class="nav-link">Expected Departure</a></li>
                                            <li><a href="home.php?module=room-status-realtime&title=Room Status Real Time" class="nav-link">Room Status Real Time</a></li>
                                            <li><a href="home.php?module=info-checkout-hari-ini&title=Checkout Today" class="nav-link">Checkout Today</a></li>
                                            <li><a href="home.php?module=room-move&title=Room Move" class="nav-link">Change Room</a></li>
                                            <li><a href="home.php?module=cancel-reservation&title=Cancellation Today" class="nav-link">Cancellation Today</a></li>
                                            <li><a href="home.php?module=refund-deposit&title=Refund Deposit" class="nav-link">Refund</a></li>
                                            <li><a href="home.php?module=blacklist-guest&title=Blacklist Guest" class="nav-link">Blacklist Guest</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficelaporan')">
                                            <span>Reports</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficelaporan-submenu">
                                            <li><a href="home.php?module=actual-shift-report&title=Actual Shift Report" class="nav-link">Actual Shift Report</a></li>
                                            <li><a href="home.php?module=blacklist-management&title=Blacklist Management" class="nav-link">Blacklist Management</a></li>
                                            <li><a href="home.php?module=night-audit-report&title=Night Audit Report" class="nav-link">Night Audit Report</a></li>
                                            <li><a href="home.php?module=room-revenue-report&title=Room Revenue Report" class="nav-link">Room Revenue Report</a></li>
                                            <li><a href="home.php?module=occupancy-report&title=Occupancy Report" class="nav-link">Occupancy Report</a></li>
                                            <li><a href="home.php?module=adr-revpar-report&title=ADR RevPAR Report" class="nav-link">ADR RevPAR Report</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficemasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficemasterdata-submenu">
                                            <li><a href="home.php?module=room-maintenance-status&title=Room Maintenance Status" class="nav-link">Room Maintenance Status</a></li>
                                            <li><a href="home.php?module=room-rate-master&title=Room Rate Master" class="nav-link">Room Rate Master</a></li>
                                            <li><a href="home.php?module=master-charge-code&title=Master Charge Code" class="nav-link">Master Charge Code</a></li>
                                            <li><a href="home.php?module=master-package&title=Master Package" class="nav-link">Master Package</a></li>
                                            <li><a href="home.php?module=master-voucher&title=Master Voucher" class="nav-link">Master Voucher</a></li>
                                            <li><a href="home.php?module=market-segment-analysis&title=Market Segment Analysis" class="nav-link">Market Segment Analysis</a></li>
                                            <li><a href="home.php?module=master-guest&title=Master Guest" class="nav-link">Master Guest</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('frontofficestatuskamar')">
                                            <span>Status Kamar</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="frontofficestatuskamar-submenu">
                                            <li><a href="home.php?module=room-status-realtime&title=Room Status Real Time" class="nav-link">Status Kamar FO</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Housekeeping -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('housekeeping')">
                                    <span>Housekeeping</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="housekeeping-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingchart')">
                                            <span>Chart & Presentase</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingchart-submenu">
                                            <li><a href="home.php?module=chart-room-cleaning&title=Chart Room Cleaning" class="nav-link">Out Of Order Room</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingform-submenu">
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Form Kamar OO</a></li>
                                            <li><a href="home.php?module=cleaning-schedule&title=Cleaning Schedule" class="nav-link">HK Pembelian Langsung</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=inventory-request&title=Inventory Request" class="nav-link">Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=maintenance-request-hk&title=Maintenance Request" class="nav-link">Form O O Request</a></li>
                                            <li><a href="home.php?module=amenities-restock&title=Amenities Restock" class="nav-link">Form Pemakaian Barang</a></li>
                                            <li><a href="home.php?module=lost-found-entry&title=Lost & Found Entry" class="nav-link">Form Loan</a></li>
                                            <li><a href="home.php?module=room-inspection&title=Room Inspection" class="nav-link">Form Tarik Extrabed</a></li>
                                            <li><a href="home.php?module=lost-found-entry&title=Lost & Found Entry" class="nav-link">Form Lose & Fund</a></li>
                                            <li><a href="home.php?module=deep-cleaning-schedule&title=Deep Cleaning Schedule" class="nav-link">Barang Rusak/Expire HK</a></li>
                                            <li><a href="home.php?module=inventory-request&title=Inventory Request" class="nav-link">Atur Par Stok</a></li>
                                            <li><a href="home.php?module=public-area-cleaning&title=Public Area Cleaning" class="nav-link">Stok Opname HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepinginformasi')">
                                            <span>Informasi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepinginformasi-submenu">
                                            <li><a href="home.php?module=cleaning-progress&title=Cleaning Progress" class="nav-link">Info Direct Purchase</a></li>
                                            <li><a href="home.php?module=inventory-level&title=Inventory Level" class="nav-link">Info Permintaan Stok HK</a></li>
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">Informasi In/Out Linen</a></li>
                                            <li><a href="home.php?module=equipment-status&title=Equipment Status" class="nav-link">Penggunaan Extrabed</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=staff-assignment&title=Staff Assignment" class="nav-link">Log Kamar</a></li>
                                            <li><a href="home.php?module=amenities-stock&title=Amenities Stock" class="nav-link">Info Stok Barang HK</a></li>
                                            <li><a href="home.php?module=room-discrepancy&title=Room Discrepancy" class="nav-link">Riwayat Stok Opname HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepinglaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepinglaporan-submenu">
                                            <li><a href="home.php?module=linen-par-level&title=Linen Par Level" class="nav-link">Laporan Stok Linen</a></li>
                                            <li><a href="home.php?module=room-productivity-report&title=Room Productivity Report" class="nav-link">Room Count Sheet</a></li>
                                            <li><a href="home.php?module=maintenance-summary&title=Maintenance Summary" class="nav-link">Riwayat Perbaikan Kamar</a></li>
                                            <li><a href="home.php?module=daily-housekeeping-report&title=Daily Housekeeping Report" class="nav-link">Occupancy Room</a></li>
                                            <li><a href="home.php?module=lost-found-report&title=Lost & Found Report" class="nav-link">Laporan Kamar OO</a></li>
                                            <li><a href="home.php?module=inventory-usage-report&title=Inventory Usage Report" class="nav-link">Lap Penggunaan Supplies</a></li>
                                            <li><a href="home.php?module=room-cleaning-report&title=Room Cleaning Report" class="nav-link">Lap Pembersihan Kamar</a></li>
                                            <li><a href="home.php?module=room-maintenance-history&title=Room Maintenance History" class="nav-link">Riwayat Perawatan kamar</a></li>
                                            <li><a href="home.php?module=extra-bed-history&title=Extra Bed History" class="nav-link">Riwayat Ext Bed</a></li>
                                            <li><a href="home.php?module=inspection-report&title=Inspection Report" class="nav-link">Cetak Kartu Stok HK</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingmasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingmasterdata-submenu">
                                            <li><a href="home.php?module=maintenance-status&title=Maintenance Status" class="nav-link">Master Operasional</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Master Room Type</a></li>
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Management Room</a></li>
                                            <li><a href="home.php?module=deep-cleaning-schedule&title=Deep Cleaning Schedule" class="nav-link">Master General Cleaning</a></li>
                                            <li><a href="home.php?module=cleaning-schedule&title=Cleaning Schedule" class="nav-link">Daftar Kamar GC</a></li>
                                            <li><a href="home.php?module=room-inspection&title=Room Inspection" class="nav-link">Master Kamar OO</a></li>
                                            <li><a href="home.php?module=maintenance-request-hk&title=Maintenance Request" class="nav-link">Jadwal Maintenance</a></li>
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Room Type Kost</a></li>
                                            <li><a href="home.php?module=room-assignment&title=Room Assignment" class="nav-link">Master Room Kost</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('housekeepingstatuskamar')">
                                            <span>Status Kamar</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="housekeepingstatuskamar-submenu">
                                            <li><a href="home.php?module=room-status-hk&title=Room Status Housekeeping" class="nav-link">Status Kamar</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Laundry -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('laundry')">
                                    <span>Laundry</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="laundry-submenu">
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundryform')">
                                            <span>Form Transaksi</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundryform-submenu">
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Penerimaan Linen</a></li>
                                            <li><a href="home.php?module=linen-exchange&title=Linen Exchange" class="nav-link">Pengiriman Linen</a></li>
                                            <li><a href="home.php?module=laundry-order&title=Laundry Order" class="nav-link">Stok Opname Laundry</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundrylaporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundrylaporan-submenu">
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">In/Out Linen</a></li>
                                            <li><a href="home.php?module=laundry-report&title=Laundry Report" class="nav-link">Lap Stok Opname Laundry</a></li>
                                            <li><a href="home.php?module=linen-in-progress&title=Linen In Progress" class="nav-link">Linen In Progress</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('laundrymasterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="laundrymasterdata-submenu">
                                            <li><a href="home.php?module=laundry-amenities-stock&title=Laundry Amenities Stock" class="nav-link">Master Barang Laundry</a></li>
                                            <li><a href="home.php?module=linen-status&title=Linen Status" class="nav-link">Master Barang Linen</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    
                    <!-- ===== HRD MODULES ===== -->
                    <li class="nav-group">
                        <button class="nav-group-header" onclick="toggleSubmenu('hrd')">
                            <div style="display: flex; align-items: center;">
                                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                HRD
                            </div>
                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </button>
                        
                        <ul class="nav-submenu" id="hrd-submenu">
                            <!-- Account Receivable -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accountreceivable')">
                                    <span>Account Receivable</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accountreceivable-submenu">
                                    <!-- Laporan submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('ar-laporan')">
                                            <span>Laporan</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="ar-laporan-submenu">
                                            <li><a href="home.php?module=laporan-pershift&title=Laporan Pershift" class="nav-link">Laporan Pershift</a></li>
                                            <li><a href="home.php?module=laporan-night-audit&title=Laporan Night Audit" class="nav-link">Laporan Night Audit</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Accounting -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('accounting')">
                                    <span>Accounting</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="accounting-submenu">
                                    <!-- Laporan Global submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('accounting-laporan')">
                                            <span>Laporan Global</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="accounting-laporan-submenu">
                                            <li><a href="home.php?module=laporan-global-accounting&title=Laporan Global" class="nav-link">Laporan Global</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                            <!-- Administration -->
                            <li class="nav-group">
                                <button class="nav-group-header" onclick="toggleSubmenu('administration')">
                                    <span>Administration</span>
                                    <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                                <ul class="nav-submenu" id="administration-submenu">
                                    <!-- Master Data submenu -->
                                    <li class="nav-group">
                                        <button class="nav-group-header" onclick="toggleSubmenu('admin-masterdata')">
                                            <span>Master Data</span>
                                            <svg class="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                            </svg>
                                        </button>
                                        <ul class="nav-submenu" id="admin-masterdata-submenu">
                                            <li><a href="home.php?module=profil-hotel&title=Profil Hotel" class="nav-link">Profil Hotel</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="main-container">
            <!-- Header -->
            <header class="top-header">
                <div class="header-left">
                    <button class="header-btn header-btn-secondary">TRAVELSINU</button>
                </div>

                <div class="header-right">
                    <a href="#" class="header-btn header-btn-secondary">Info Karyawan</a>
                    <a href="#" class="header-btn header-btn-secondary">Login Web Mail</a>
                    
                    <div class="dropdown">
                        <button class="dropdown-btn" onclick="toggleDropdown()">
                            <?php echo strtoupper(htmlspecialchars($username)); ?>
                            <svg class="dropdown-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        <div class="dropdown-content" id="adminDropdown">
                            <div class="dropdown-header">ANDA LOGIN SEBAGAI</div>
                            <div class="dropdown-username"><?php echo strtoupper(htmlspecialchars($username)); ?></div>
                            <a href="#" class="dropdown-item">Lihat Akun</a>
                        </div>
                    </div>
                    
                    <a href="?logout=1" class="header-btn header-btn-danger">Logout</a>
                </div>
            </header>

            <!-- Main Content Area -->
            <main class="main-content">
                <?php
                // Get the module parameter from URL
                $module = $_GET['module'] ?? 'dashboard';
                $ref = $_GET['ref'] ?? null;

                // Module handling with organized folder structure
                switch ($module) {
                    case 'transaction-history':
                        include 'modules/adjustment/foodbeverage/transaction_history.php';
                        break;
                    
                    // Adjustment - Front Office modules
                    case 'additional-deposit':
                        include 'modules/adjustment/frontoffice/additional_deposit.php';
                        break;
                    case 'charge-to-room':
                        include 'modules/adjustment/frontoffice/charge_to_room.php';
                        break;
                    case 'clearance-deposit':
                        include 'modules/adjustment/frontoffice/clearance_deposit.php';
                        break;
                    case 'clearance-deposit-pending':
                        include 'modules/adjustment/frontoffice/clearance_deposit_pending.php';
                        break;
                    case 'double-checkin':
                        include 'modules/adjustment/frontoffice/double_checkin.php';
                        break;
                    case 'extra-bed':
                        include 'modules/adjustment/frontoffice/extra_bed.php';
                        break;
                    case 'extrabill':
                        include 'modules/adjustment/frontoffice/extrabill.php';
                        break;
                    case 'guest-folio':
                        include 'modules/adjustment/frontoffice/guest_folio.php';
                        break;
                    case 'guest-ledger':
                        include 'modules/adjustment/frontoffice/guest_ledger.php';
                        break;
                    case 'late-checkout':
                        include 'modules/adjustment/frontoffice/late_checkout.php';
                        break;
                    case 'market-segment':
                        include 'modules/adjustment/frontoffice/market_segment.php';
                        break;
                    case 'night-audit':
                        include 'modules/adjustment/frontoffice/night_audit.php';
                        break;
                    case 'other-extrabill':
                        include 'modules/adjustment/frontoffice/other_extrabill.php';
                        break;
                    case 'payment-pending':
                        include 'modules/adjustment/frontoffice/payment_pending.php';
                        break;
                    case 'payment':
                        include 'modules/adjustment/frontoffice/payment.php';
                        break;
                    case 'refund':
                        include 'modules/adjustment/frontoffice/refund.php';
                        break;
                    case 'reprocess-clearance':
                        include 'modules/adjustment/frontoffice/reprocess_clearance.php';
                        break;
                    case 'room-charge':
                        include 'modules/adjustment/frontoffice/room_charge.php';
                        break;
                    case 'room-status':
                        include 'modules/adjustment/frontoffice/room_status.php';
                        break;
                    case 'upnormal-payment':
                        include 'modules/adjustment/frontoffice/upnormal_payment.php';
                        break;
                    
                    // Adjustment - Kos modules
                    case 'kos-payment':
                        include 'modules/adjustment/kos/payment.php';
                        break;
                    case 'kos-room-charge':
                        include 'modules/adjustment/kos/room_charge.php';
                        break;
                    
                    // Adjustment - Laundry modules
                    case 'laundry-transaction':
                        include 'modules/adjustment/laundry/laundry_transaction.php';
                        break;
                    
                    // Adjustment - Meeting Room modules
                    case 'meeting-room-deposit':
                        include 'modules/adjustment/meetingroom/meeting_room_deposit.php';
                        break;
                    case 'meeting-room-refund':
                        include 'modules/adjustment/meetingroom/meeting_room_refund.php';
                        break;
                    case 'meeting-room-trans':
                        include 'modules/adjustment/meetingroom/meeting_room_trans.php';
                        break;
                    
                    // Food & Beverage - Chart modules
                    case 'menu-fast-moving':
                        include 'modules/foodbeverage/chart/menu_fast_moving.php';
                        break;
                    case 'menu-slow-moving':
                        include 'modules/foodbeverage/chart/menu_slow_moving.php';
                        break;
                    case 'sales-chart':
                        include 'modules/foodbeverage/chart/sales_chart.php';
                        break;
                    case 'sales-by-category':
                        include 'modules/foodbeverage/chart/sales_by_category.php';
                        break;
                    
                    // Food & Beverage - Form modules
                    case 'direct-purchase':
                        include 'modules/foodbeverage/form/direct_purchase.php';
                        break;
                    case 'stock-request':
                        include 'modules/foodbeverage/form/stock_request.php';
                        break;
                    case 'external-guest':
                        include 'modules/foodbeverage/form/external_guest.php';
                        break;
                    case 'event-menu-setup':
                        include 'modules/foodbeverage/form/event_menu_setup.php';
                        break;
                    case 'sales-transaction':
                        include 'modules/foodbeverage/form/sales_transaction.php';
                        break;
                    case 'pending-transaction':
                        include 'modules/foodbeverage/form/pending_transaction.php';
                        break;
                    case 'item-usage':
                        include 'modules/foodbeverage/form/item_usage.php';
                        break;
                    case 'expired-damaged-items':
                        include 'modules/foodbeverage/form/expired_damaged_items.php';
                        break;
                    case 'restaurant-stock-taking':
                        include 'modules/foodbeverage/form/restaurant_stock_taking.php';
                        break;
                    
                    // Food & Beverage - Info modules
                    case 'stock-request-info':
                        include 'modules/foodbeverage/info/stock_request_info.php';
                        break;
                    case 'today-transaction':
                        include 'modules/foodbeverage/info/today_transaction.php';
                        break;
                    case 'room-service-request':
                        include 'modules/foodbeverage/info/room_service_request.php';
                        break;
                    case 'receivable-info':
                        include 'modules/foodbeverage/info/receivable_info.php';
                        break;
                    case 'item-stock-info':
                        include 'modules/foodbeverage/info/item_stock_info.php';
                        break;
                    case 'stock-card':
                        include 'modules/foodbeverage/info/stock_card.php';
                        break;
                    case 'banquet-receivable':
                        include 'modules/foodbeverage/info/banquet_receivable.php';
                        break;
                    
                    // Food & Beverage - Laporan modules
                    case 'night-audit-fnb':
                        include 'modules/foodbeverage/laporan/night_audit_fnb.php';
                        break;
                    case 'restaurant-sales-per-item':
                        include 'modules/foodbeverage/laporan/restaurant_sales_per_item.php';
                        break;
                    case 'restaurant-sales':
                        include 'modules/foodbeverage/laporan/restaurant_sales.php';
                        break;
                    case 'shift-report':
                        include 'modules/foodbeverage/laporan/shift_report.php';
                        break;
                    case 'restaurant-guest-report':
                        include 'modules/foodbeverage/laporan/restaurant_guest_report.php';
                        break;
                    case 'restaurant-stocktaking-history':
                        include 'modules/foodbeverage/laporan/restaurant_stocktaking_history.php';
                        break;
                    case 'restaurant-shift-report':
                        include 'modules/foodbeverage/laporan/restaurant_shift_report.php';
                        break;
                    
                    // Food & Beverage - Master Data modules
                    case 'master-discount':
                        include 'modules/foodbeverage/master/master_discount.php';
                        break;
                    case 'table-master':
                        include 'modules/foodbeverage/master/table_master.php';
                        break;
                    case 'restaurant-menu-master':
                        include 'modules/foodbeverage/master/restaurant_menu_master.php';
                        break;
                    case 'restaurant-menu-category':
                        include 'modules/foodbeverage/master/restaurant_menu_category.php';
                        break;
                    case 'restaurant-menu-type':
                        include 'modules/foodbeverage/master/restaurant_menu_type.php';
                        break;
                    
                    // Front Office - Chart modules
                    case 'monthly-room-chart':
                        include 'modules/frontoffice/chart/monthly_room_chart.php';
                        break;
                    case 'monthly-revenue-chart':
                        include 'modules/frontoffice/chart/monthly_revenue_chart.php';
                        break;
                    case 'occupancy-chart':
                        include 'modules/frontoffice/chart/occupancy_chart.php';
                        break;
                    case 'revenue-graph':
                        include 'modules/frontoffice/chart/revenue_graph.php';
                        break;
                    case 'analisa-market-segment':
                        include 'modules/frontoffice/chart/analisa_market_segment.php';
                        break;
                    case 'trend-booking':
                        include 'modules/frontoffice/chart/trend_booking.php';
                        break;
                    case 'perbandingan-tahun':
                        include 'modules/frontoffice/chart/perbandingan_tahun.php';
                        break;
                    
                    // Front Office - Form modules (Only 10 modules as per submenu)
                    case 'registration':
                        include 'modules/frontoffice/form/registration.php';
                        break;
                    case 'reservation':
                        include 'modules/frontoffice/form/reservation.php';
                        break;
                    case 'direct-purchase-fo':
                        include 'modules/frontoffice/form/direct_purchase_fo.php';
                        break;
                    case 'refresh-room-status':
                        include 'modules/frontoffice/form/refresh_room_status.php';
                        break;
                    case 'group-registration':
                        include 'modules/frontoffice/form/group_registration.php';
                        break;
                    case 'laundry-transaction':
                        include 'modules/frontoffice/form/laundry_transaction.php';
                        break;
                    case 'kost-registration':
                        include 'modules/frontoffice/form/kost_registration.php';
                        break;
                    case 'kost-reservation':
                        include 'modules/frontoffice/form/kost_reservation.php';
                        break;
                    case 'meeting-room-transaction':
                        include 'modules/frontoffice/form/meeting_room_transaction.php';
                        break;
                    case 'extrabill-form':
                        include 'modules/frontoffice/form/extrabill_form.php';
                        break;
                    
                    // Additional Front Office Form modules
                    case 'direct-purchase-fo':
                        include 'modules/frontoffice/form/direct_purchase_fo.php';
                        break;
                    case 'refresh-room-status':
                        include 'modules/frontoffice/form/refresh_room_status.php';
                        break;
                    case 'group-registration':
                        include 'modules/frontoffice/form/group_registration.php';
                        break;
                    case 'laundry-transaction':
                        include 'modules/frontoffice/form/laundry_transaction.php';
                        break;
                    case 'kost-registration':
                        include 'modules/frontoffice/form/kost_registration.php';
                        break;
                    case 'kost-reservation':
                        include 'modules/frontoffice/form/kost_reservation.php';
                        break;
                    case 'meeting-room-transaction':
                        include 'modules/frontoffice/form/meeting_room_transaction.php';
                        break;
                    case 'extrabill-form':
                        include 'modules/frontoffice/form/extrabill_form.php';
                        break;
                    
                    // Additional Front Office Form modules (non-existent files removed)
                    // Note: Several placeholder modules were referenced but files don't exist
                    
                    // Front Office - Info modules
                    case 'info-kamar-available':
                        include 'modules/frontoffice/info/room_availability_info.php';
                        break;
                    case 'info-tamu-inhouse':
                        include 'modules/frontoffice/info/inhouse_guest_info.php';
                        break;
                    case 'info-reservasi-hari-ini':
                        include 'modules/frontoffice/info/today_reservation_info.php';
                        break;
                    case 'info-checkout-hari-ini':
                        include 'modules/frontoffice/info/today_checkout_info.php';
                        break;
                    case 'info-pending-checkout':
                        include 'modules/frontoffice/info/pending_checkout_info.php';
                        break;
                    case 'room-status-realtime':
                        include 'modules/frontoffice/info/room_status_realtime.php';
                        break;
                    case 'guest-folio':
                        include 'modules/frontoffice/info/guest_folio.php';
                        break;
                    case 'guest-history':
                        include 'modules/frontoffice/info/guest_history.php';
                        break;
                    case 'blacklist-guest':
                        include 'modules/frontoffice/info/blacklist_guest.php';
                        break;
                    case 'vip-guest':
                        include 'modules/frontoffice/info/vip_guest.php';
                        break;
                    case 'walk-in-forecast':
                        include 'modules/frontoffice/info/walk_in_forecast.php';
                        break;
                    case 'no-show-report':
                        include 'modules/frontoffice/info/no_show_report.php';
                        break;
                    case 'late-checkout':
                        include 'modules/frontoffice/info/late_checkout.php';
                        break;
                    case 'credit-limit':
                        include 'modules/frontoffice/info/credit_limit.php';
                        break;
                    case 'group-reservation':
                        include 'modules/frontoffice/info/group_reservation.php';
                        break;
                    
                    // Front Office - Laporan modules
                    case 'actual-shift-report':
                        include 'modules/frontoffice/laporan/actual_shift_report.php';
                        break;
                    case 'night-audit-report':
                        include 'modules/frontoffice/laporan/night_audit_report.php';
                        break;
                    case 'room-revenue-report':
                        include 'modules/frontoffice/laporan/room_revenue_report.php';
                        break;
                    case 'occupancy-report':
                        include 'modules/frontoffice/laporan/occupancy_report.php';
                        break;
                    case 'adr-revpar-report':
                        include 'modules/frontoffice/laporan/adr_revpar_report.php';
                        break;
                    case 'cash-flow-report':
                        include 'modules/frontoffice/laporan/cash_flow_report.php';
                        break;
                    case 'deposit-report':
                        include 'modules/frontoffice/laporan/deposit_report.php';
                        break;
                    case 'ar-aging-report':
                        include 'modules/frontoffice/laporan/ar_aging_report.php';
                        break;
                    case 'guest-registration':
                        include 'modules/frontoffice/laporan/guest_registration.php';
                        break;
                    case 'police-report':
                        include 'modules/frontoffice/laporan/police_report.php';
                        break;
                    case 'city-ledger':
                        include 'modules/frontoffice/laporan/city_ledger.php';
                        break;
                    case 'complimentary-report':
                        include 'modules/frontoffice/laporan/complimentary_report.php';
                        break;
                    case 'house-use-report':
                        include 'modules/frontoffice/laporan/house_use_report.php';
                        break;
                    case 'room-statistics':
                        include 'modules/frontoffice/laporan/room_statistics.php';
                        break;
                    case 'forecasting-report':
                        include 'modules/frontoffice/laporan/forecasting_report.php';
                        break;
                    case 'market-segment-analysis':
                        include 'modules/frontoffice/laporan/market_segment_analysis.php';
                        break;
                    case 'source-business-report':
                        include 'modules/frontoffice/laporan/source_business_report.php';
                        break;
                    case 'nationality-report':
                        include 'modules/frontoffice/laporan/nationality_report.php';
                        break;
                    
                    // Front Office - Master modules
                    case 'master-kamar':
                        include 'modules/frontoffice/master/room_master.php';
                        break;
                    case 'master-rate-kamar':
                        include 'modules/frontoffice/master/room_rate_master.php';
                        break;
                    case 'master-tipe-kamar':
                        include 'modules/frontoffice/master/room_type_master.php';
                        break;
                    case 'master-guest':
                        include 'modules/frontoffice/master/master_guest.php';
                        break;
                    case 'master-company':
                        include 'modules/frontoffice/master/master_company.php';
                        break;
                    case 'master-travel-agent':
                        include 'modules/frontoffice/master/master_travel_agent.php';
                        break;
                    case 'master-nationality':
                        include 'modules/frontoffice/master/master_nationality.php';
                        break;
                    case 'master-title':
                        include 'modules/frontoffice/master/master_title.php';
                        break;
                    case 'master-city':
                        include 'modules/frontoffice/master/master_city.php';
                        break;
                    case 'master-country':
                        include 'modules/frontoffice/master/master_country.php';
                        break;
                    case 'master-id-type':
                        include 'modules/frontoffice/master/master_id_type.php';
                        break;
                    case 'master-payment-type':
                        include 'modules/frontoffice/master/master_payment_type.php';
                        break;
                    case 'master-charge-code':
                        include 'modules/frontoffice/master/master_charge_code.php';
                        break;
                    case 'master-package':
                        include 'modules/frontoffice/master/master_package.php';
                        break;
                    case 'master-voucher':
                        include 'modules/frontoffice/master/master_voucher.php';
                        break;
                    case 'room-amenities':
                        include 'modules/frontoffice/master/room_amenities.php';
                        break;
                    case 'blacklist-management':
                        include 'modules/frontoffice/master/blacklist_management.php';
                        break;
                    
                    // Front Office - Status modules
                    case 'room-maintenance-status':
                        include 'modules/frontoffice/status/room_maintenance_status.php';
                        break;
                    case 'housekeeping-status':
                        include 'modules/frontoffice/status/housekeeping_status.php';
                        break;
                    case 'room-block-status':
                        include 'modules/frontoffice/status/room_block_status.php';
                        break;
                    case 'front-desk-log':
                        include 'modules/frontoffice/status/front_desk_log.php';
                        break;
                    case 'shift-handover':
                        include 'modules/frontoffice/status/shift_handover.php';
                        break;
                    case 'daily-checklist':
                        include 'modules/frontoffice/status/daily_checklist.php';
                        break;
                    
                    // Housekeeping - Chart modules
                    case 'chart-room-cleaning':
                        include 'modules/housekeeping/chart/chart_room_cleaning.php';
                        break;
                    case 'chart-maintenance-request':
                        include 'modules/housekeeping/chart/chart_maintenance_request.php';
                        break;
                    case 'chart-laundry-volume':
                        include 'modules/housekeeping/chart/chart_laundry_volume.php';
                        break;
                    case 'productivity-chart':
                        include 'modules/housekeeping/chart/productivity_chart.php';
                        break;
                    case 'amenities-usage':
                        include 'modules/housekeeping/chart/amenities_usage.php';
                        break;
                    
                    // Housekeeping - Form modules
                    case 'room-assignment':
                        include 'modules/housekeeping/form/room_assignment.php';
                        break;
                    case 'cleaning-schedule':
                        include 'modules/housekeeping/form/cleaning_schedule.php';
                        break;
                    case 'maintenance-request-hk':
                        include 'modules/housekeeping/form/maintenance_request_hk.php';
                        break;
                    case 'lost-found-entry':
                        include 'modules/housekeeping/form/lost_found_entry.php';
                        break;
                    case 'inventory-request':
                        include 'modules/housekeeping/form/inventory_request.php';
                        break;
                    case 'amenities-restock':
                        include 'modules/housekeeping/form/amenities_restock.php';
                        break;
                    case 'laundry-order':
                        include 'modules/housekeeping/form/laundry_order.php';
                        break;
                    case 'linen-exchange':
                        include 'modules/housekeeping/form/linen_exchange.php';
                        break;
                    case 'deep-cleaning-schedule':
                        include 'modules/housekeeping/form/deep_cleaning_schedule.php';
                        break;
                    case 'pest-control-log':
                        include 'modules/housekeeping/form/pest_control_log.php';
                        break;
                    case 'room-inspection':
                        include 'modules/housekeeping/form/room_inspection.php';
                        break;
                    case 'public-area-cleaning':
                        include 'modules/housekeeping/form/public_area_cleaning.php';
                        break;
                    
                    // Housekeeping - Info modules
                    case 'room-status-hk':
                        include 'modules/housekeeping/info/room_status_hk.php';
                        break;
                    case 'cleaning-progress':
                        include 'modules/housekeeping/info/cleaning_progress.php';
                        break;
                    case 'maintenance-status':
                        include 'modules/housekeeping/info/maintenance_status.php';
                        break;
                    case 'lost-found-items':
                        include 'modules/housekeeping/info/lost_found_items.php';
                        break;
                    case 'inventory-level':
                        include 'modules/housekeeping/info/inventory_level.php';
                        break;
                    case 'staff-assignment':
                        include 'modules/housekeeping/info/staff_assignment.php';
                        break;
                    case 'room-discrepancy':
                        include 'modules/housekeeping/info/room_discrepancy.php';
                        break;
                    case 'amenities-stock':
                        include 'modules/housekeeping/info/amenities_stock.php';
                        break;
                    case 'linen-status':
                        include 'modules/housekeeping/info/linen_status.php';
                        break;
                    case 'equipment-status':
                        include 'modules/housekeeping/info/equipment_status.php';
                        break;
                    
                    // Housekeeping - Laporan modules (complete)
                    case 'amenities-consumption':
                        include 'modules/housekeeping/laporan/amenities_consumption.php';
                        break;
                    case 'laundry-report':
                        include 'modules/laundry/laporan/laundry_report.php';
                        break;
                    case 'linen-par-level':
                        include 'modules/housekeeping/laporan/linen_par_level.php';
                        break;
                    case 'staff-performance':
                        include 'modules/housekeeping/laporan/staff_performance.php';
                        break;
                    case 'room-productivity-report':
                        include 'modules/housekeeping/laporan/room_productivity_report.php';
                        break;
                    case 'maintenance-summary':
                        include 'modules/housekeeping/laporan/maintenance_summary.php';
                        break;
                    case 'daily-housekeeping-report':
                        include 'modules/housekeeping/laporan/daily_housekeeping_report.php';
                        break;
                    case 'lost-found-report':
                        include 'modules/housekeeping/laporan/lost_found_report.php';
                        break;
                    case 'inventory-usage-report':
                        include 'modules/housekeeping/laporan/inventory_usage_report.php';
                        break;
                    case 'room-cleaning-report':
                        include 'modules/housekeeping/laporan/room_cleaning_report.php';
                        break;
                    case 'room-maintenance-history':
                        include 'modules/housekeeping/laporan/room_maintenance_history.php';
                        break;
                    case 'extra-bed-history':
                        include 'modules/housekeeping/laporan/extra_bed_history.php';
                        break;
                    case 'inspection-report':
                        include 'modules/housekeeping/laporan/inspection_report.php';
                        break;
                    
                    // Laundry - Form modules
                    case 'linen-exchange':
                        include 'modules/laundry/form/linen_exchange.php';
                        break;
                    case 'laundry-order':
                        include 'modules/laundry/form/laundry_order.php';
                        break;
                    
                    // Laundry - Laporan modules
                    case 'linen-par-level':
                        include 'modules/laundry/laporan/linen_par_level.php';
                        break;
                    case 'laundry-report':
                        include 'modules/laundry/laporan/laundry_report.php';
                        break;
                    
                    // Laundry - Master Data modules  
                    // (Removed duplicates - use housekeeping versions instead)
                    
                    // HRD - Account Receivable modules
                    case 'laporan-pershift':
                        include 'modules/hrd/accountreceivable/laporan/shift_report.php';
                        break;
                    case 'laporan-night-audit':
                        include 'modules/hrd/accountreceivable/laporan/night_audit_report.php';
                        break;
                    
                    // HRD - Accounting modules
                    case 'laporan-global-accounting':
                        include 'modules/hrd/accounting/laporan/global_report.php';
                        break;
                    
                    // HRD - Administration modules
                    case 'profil-hotel':
                        include 'modules/hrd/administration/masterdata/hotel_profile.php';
                        break;

                    case 'dashboard':
                        // Default dashboard content
                        echo '<div class="content-card">
                                <h1 class="page-title">Eva Group Hotel Management System</h1>
                                <p>Welcome to Eva Group Hotel Management System. Your comprehensive solution for managing all hotel operations efficiently and effectively.</p>
                                <!-- Homepage dashboard content here -->
                              </div>';
                        break;
                    default:
                        // Generic module handler for modules without specific files
                        include 'modules/generic_module.php';
                        break;
                }
                ?>
            </main>
        </div>
    </div>

    <!-- ===== JAVASCRIPT SECTION ===== -->
    <script>
        /**
         * Eva Group Hotel Management System - Frontend Scripts
         * Handles sidebar navigation, module routing, and state management
         */
        
        // ===== CONFIGURATION =====
        
        // Get current module from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const currentModule = urlParams.get('module');
        
        // Define all submenu identifiers for comprehensive state management
        const allSubmenus = [
            // Main categories
            'operational',
            'adjustment',
            
            // Adjustment sub-categories
            'adjustmentfoodbeverage',
            'adjustmentfrontoffice', 
            'adjustmentkos',
            'adjustmentlaundry',
            'adjustmentmeetingroom',
            
            // Food & Beverage Department
            'foodbeverage',
            'foodbeveragechart',
            'foodbeverageform',
            'foodbeverageinfo',
            'foodbeveragelaporan',
            'foodbeveragemaster',
            
            // Front Office Department
            'frontoffice',
            'frontofficechart',
            'frontofficeform',
            'frontofficeinfo',
            'frontofficeinformasi',
            'frontofficeinformasitamu',
            'frontofficelaporan',
            'frontofficemasterdata',
            'frontofficestatuskamar',
            
            // Housekeeping Department
            'housekeeping',
            'housekeepingchart',
            'housekeepingform',
            'housekeepinginformasi',
            'housekeepinglaporan',
            'housekeepingmasterdata',
            'housekeepingstatuskamar',
            
            // Laundry Department
            'laundry',
            'laundryform',
            'laundrylaporan',
            'laundrymasterdata',
            
            // HRD Department
            'hrd',
            'accountreceivable',
            'ar-laporan',
            'accounting',
            'accounting-laporan',
            'administration',
            'admin-masterdata'
        ];
        
        // ===== CORE FUNCTIONS =====
        
        /**
         * Toggle submenu visibility with state persistence
         * @param {string} menuName - The submenu identifier to toggle
         */
        function toggleSubmenu(menuName) {
            const submenu = document.getElementById(menuName + '-submenu');
            const button = event.target.closest('.nav-group-header');
            const chevron = button.querySelector('.chevron-icon');
            
            if (!submenu || !button) return;
            
            // Toggle visual states
            submenu.classList.toggle('show');
            chevron.classList.toggle('rotated');
            button.classList.toggle('active');
            
            // Persist state to localStorage
            const isOpen = submenu.classList.contains('show');
            localStorage.setItem('submenu-' + menuName, isOpen);
        }
        
        // ==========================================
        // SIDEBAR STATE MANAGEMENT FUNCTIONS
        // ==========================================
        
        /**
         * Restore sidebar state from localStorage for all submenus
         * Called on page load to maintain user's sidebar preferences
         */
        function restoreSidebarState() {
            allSubmenus.forEach(submenuName => {
                const isOpen = localStorage.getItem('submenu-' + submenuName) === 'true';
                
                if (isOpen) {
                    const submenu = document.getElementById(submenuName + '-submenu');
                    const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
                    const chevron = button?.querySelector('.chevron-icon');
                    
                    if (submenu && button) {
                        submenu.classList.add('show');
                        button.classList.add('active');
                        if (chevron) {
                            chevron.classList.add('rotated');
                        }
                    }
                }
            });
        }
        
        /**
         * Clear all submenu states (utility function)
         * Used for resetting the sidebar to default state
         */
        function clearAllSubmenuStates() {
            // Clear localStorage for all submenus
            allSubmenus.forEach(submenuName => {
                localStorage.removeItem('submenu-' + submenuName);
            });
            
            // Reset all submenus to closed state visually
            allSubmenus.forEach(submenuName => {
                const submenu = document.getElementById(submenuName + '-submenu');
                const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
                const chevron = button?.querySelector('.chevron-icon');
                
                if (submenu && button) {
                    submenu.classList.remove('show');
                    button.classList.remove('active');
                    if (chevron) {
                        chevron.classList.remove('rotated');
                    }
                }
            });
        }
        
        // ==========================================
        // NAVIGATION ACTIVE STATE MANAGEMENT
        // ==========================================
        
        /**
         * Set active navigation item based on current module
         * Automatically highlights the correct menu item on page load
         */
        function setActiveNavByModule() {
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Set active based on current module
            if (currentModule) {
                // Find the link that contains the current module in its href
                const activeLink = document.querySelector(`a[href*="module=${currentModule}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // No module means we're on homepage - activate home button
                const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
                if (homeButton) {
                    homeButton.classList.add('active');
                }
            }
        }
        
        /**
         * Enhanced active state management for navigation
         * Handles click events on navigation items
         */
        function setActiveNavItem(clickedElement) {
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to clicked element
            if (clickedElement.classList.contains('nav-link')) {
                clickedElement.classList.add('active');
            }
        }
        
        /**
         * Reset sidebar and go to homepage - ONLY FOR HOME BUTTON
         * Special function that clears all states when returning to home
         */
        function resetSidebarAndGoHome() {
            // Clear all submenu states - ONLY when home button is clicked
            clearAllSubmenuStates();
            
            // Remove active class from all nav-links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Set home button as active
            const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
            if (homeButton) {
                homeButton.classList.add('active');
            }
            
            // Navigate to homepage (without any module parameter)
            window.location.href = 'home.php';
        }
        
        // ==========================================
        // PAGE INITIALIZATION & EVENT HANDLERS
        // ==========================================
        
        /**
         * Initialize the application on page load
         * Sets up sidebar state, navigation, and event listeners
         */
        document.addEventListener('DOMContentLoaded', function() {
            // ===== SAFETY CHECKS =====
            // Ensure sidebar buttons are clickable
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.style.pointerEvents = 'auto';
                sidebar.style.zIndex = '100';
            }
            
            // Restore sidebar state for all submenus
            restoreSidebarState();
            
            // Set active navigation item based on current module
            setActiveNavByModule();
            
            // Add click listeners to all nav-links for active state management
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    // Handle active state for module links and regular links
                    if (this.href.includes('module=') || !this.href.includes('home.php') || this.href === 'home.php') {
                        setActiveNavItem(this);
                    }
                });
            });
            
            // Optional: Add keyboard shortcuts for sidebar management
            document.addEventListener('keydown', function(e) {
                // Ctrl + Shift + C to clear all submenu states
                if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                    e.preventDefault();
                    clearAllSubmenuStates();
                    console.log('All submenu states cleared');
                }
            });
        });
        
        // ==========================================
        // DROPDOWN FUNCTIONALITY
        // ==========================================
        
        /**
         * Toggle admin dropdown menu
         * Handles opening/closing of user account dropdown
         */
        function toggleDropdown() {
            const dropdown = document.getElementById('adminDropdown');
            const dropdownContainer = dropdown.parentElement;
            
            dropdown.classList.toggle('show');
            dropdownContainer.classList.toggle('active');
        }
        
        /**
         * Close dropdown when clicking outside
         * Enhances UX by auto-closing dropdown on outside clicks
         */
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('adminDropdown');
            const dropdownBtn = document.querySelector('.dropdown-btn');
            
            if (!dropdownBtn.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
                dropdown.parentElement.classList.remove('active');
            }
        });

        // ==========================================
        // LOADING SYSTEM
        // ==========================================
        
        // Performance optimized loading configuration
        window.FastLoaderConfig = {
            duration: 300,        // Faster completion (300ms instead of 600ms)
            minDisplay: 50,       // Shorter minimum display time (50ms instead of 100ms)
            updateInterval: 8,    // More frequent updates (8ms instead of 16ms)
            fadeOutDuration: 100  // Faster fade out (100ms instead of 150ms)
        };
        
        // Loading system is now handled by fast-loader.js
        // Initialize loading for navigation links
        document.addEventListener('DOMContentLoaded', function() {
            // Add loading to all navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.fastLoader) {
                        window.fastLoader.show();
                    }
                });
            });
        });
    </script>
</body>
</html>