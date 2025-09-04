<?php
include 'includes/auth.php';
include 'config/database.php';

// Set timezone
date_default_timezone_set('Asia/Jakarta');

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $transaction_date = $_POST['transaction_date'];
    $guest_name = $_POST['guest_name'];
    $room_number = $_POST['room_number'];
    $laundry_items = $_POST['laundry_items'];
    $quantity = $_POST['quantity'];
    $price_per_item = $_POST['price_per_item'];
    $total_amount = $_POST['total_amount'];
    $pickup_date = $_POST['pickup_date'];
    $status = $_POST['status'];
    $notes = $_POST['notes'];

    $sql = "INSERT INTO laundry_transactions (transaction_date, guest_name, room_number, laundry_items, quantity, price_per_item, total_amount, pickup_date, status, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssiidsss", $transaction_date, $guest_name, $room_number, $laundry_items, $quantity, $price_per_item, $total_amount, $pickup_date, $status, $notes);
    
    if ($stmt->execute()) {
        echo "<script>alert('Laundry transaction recorded successfully!'); window.location.href='home.php?module=laundry-transaction&title=Laundry Transaction';</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laundry Transaction Form</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-bold text-center mb-6 text-purple-800">LAUNDRY TRANSACTION FORM</h1>
        
        <form method="POST" action="" onsubmit="return validateForm()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Transaction Information -->
                <div class="space-y-4">
                    <h3 class="font-semibold text-lg text-purple-700 border-b border-purple-200 pb-2">Transaction Information</h3>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Date</label>
                        <input type="date" name="transaction_date" id="transaction_date" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                        <input type="text" name="guest_name" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                               placeholder="Enter guest name">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                        <input type="text" name="room_number" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                               placeholder="e.g., 101, 201A">
                    </div>
                </div>
                
                <!-- Laundry Details -->
                <div class="space-y-4">
                    <h3 class="font-semibold text-lg text-purple-700 border-b border-purple-200 pb-2">Laundry Details</h3>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Laundry Items</label>
                        <select name="laundry_items" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">Select Item Type</option>
                            <option value="Shirt">Shirt</option>
                            <option value="Pants">Pants</option>
                            <option value="Dress">Dress</option>
                            <option value="Suit">Suit</option>
                            <option value="Underwear">Underwear</option>
                            <option value="Socks">Socks</option>
                            <option value="Bed Sheets">Bed Sheets</option>
                            <option value="Towels">Towels</option>
                            <option value="Blanket">Blanket</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="number" name="quantity" min="1" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                               placeholder="Enter quantity" onchange="calculateTotal()">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Price per Item (IDR)</label>
                        <input type="number" name="price_per_item" step="0.01" min="0" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                               placeholder="Enter price per item" onchange="calculateTotal()">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount (IDR)</label>
                        <input type="number" name="total_amount" step="0.01" min="0" readonly
                               class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                               placeholder="Auto-calculated">
                    </div>
                </div>
                
                <!-- Service Information -->
                <div class="space-y-4">
                    <h3 class="font-semibold text-lg text-purple-700 border-b border-purple-200 pb-2">Service Information</h3>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                        <input type="date" name="pickup_date" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select name="status" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                            <option value="">Select Status</option>
                            <option value="Received">Received</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Ready">Ready</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea name="notes" rows="4"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  placeholder="Special instructions or notes"></textarea>
                    </div>
                </div>
            </div>
            
            <div class="flex justify-center mt-6">
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    RECORD TRANSACTION
                </button>
            </div>
        </form>
    </div>

    <script>
        // Set today's date as default
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transaction_date').value = today;
            
            // Set pickup date to 2 days from today
            const pickupDate = new Date();
            pickupDate.setDate(pickupDate.getDate() + 2);
            document.querySelector('input[name="pickup_date"]').value = pickupDate.toISOString().split('T')[0];
        });

        function calculateTotal() {
            const quantity = parseFloat(document.querySelector('input[name="quantity"]').value) || 0;
            const pricePerItem = parseFloat(document.querySelector('input[name="price_per_item"]').value) || 0;
            const total = quantity * pricePerItem;
            document.querySelector('input[name="total_amount"]').value = total.toFixed(2);
        }

        function validateForm() {
            const transactionDate = document.querySelector('input[name="transaction_date"]').value;
            const pickupDate = document.querySelector('input[name="pickup_date"]').value;
            
            if (new Date(pickupDate) <= new Date(transactionDate)) {
                alert('Pickup date must be after transaction date!');
                return false;
            }
            
            const total = parseFloat(document.querySelector('input[name="total_amount"]').value);
            if (total <= 0) {
                alert('Total amount must be greater than 0!');
                return false;
            }
            
            return confirm('Are you sure you want to record this laundry transaction?');
        }
    </script>
</body>
</html>
