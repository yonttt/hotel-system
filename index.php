<?php
require_once 'includes/auth.php';

$auth = new Auth();
$error = '';
$success = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Please fill in all fields';
    } elseif (empty($recaptchaResponse)) {
        $error = 'Please complete the reCAPTCHA verification';
    } else {
        // Verify reCAPTCHA
        $secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
        $verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
        $response = file_get_contents($verifyURL . '?secret=' . $secretKey . '&response=' . $recaptchaResponse);
        $responseData = json_decode($response);
        
        if ($responseData->success) {
            if ($auth->login($username, $password)) {
                $success = 'Login successful! Redirecting...';
                echo "<script>setTimeout(() => window.location.href = 'home.php', 1500);</script>";
            } else {
                $error = 'Invalid username or password';
            }
        } else {
            $error = 'reCAPTCHA verification failed. Please try again.';
        }
    }
}

// Redirect if already logged in
if ($auth->isLoggedIn()) {
    header('Location: home.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eva Group Hotel Management System - Login</title>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
    <script src="js/fast-loader.js" defer></script>
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-wrapper">
            <!-- Logo Section -->
            <div class="logo-section text-center">
                <img src="images/eva-group-logo.png" alt="Eva Group Hotel Logo" class="logo-image mx-auto mb-3">
                <h1 class="text-2xl font-bold text-gray-800">
                    Eva Group Hotel Management
                </h1>
            </div>

            <!-- Login Form -->
            <div class="login-card mt-4">
                <div id="message-container">
                    <?php if ($error): ?>
                        <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
                    <?php endif; ?>
                    <?php if ($success): ?>
                        <div class="success-message"><?php echo htmlspecialchars($success); ?></div>
                    <?php endif; ?>
                </div>

                <form id="login-form" method="POST" action="">
                    <div class="space-y-4">
                        <div class="space-y-1">
                            <h2 class="text-lg font-semibold text-black text-center">
                                Authorized Access
                            </h2>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Username"
                                class="login-input"
                                required
                                value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
                            />
                        </div>

                        <div class="space-y-2">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                class="login-input"
                                required
                            />
                        </div>

                        <!-- Google reCAPTCHA -->
                        <div class="recaptcha-container">
                            <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
                        </div>

                        <button type="submit" class="login-button">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        // Form validation and handling
        document.getElementById('login-form').addEventListener('submit', function(e) {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const recaptchaResponse = grecaptcha.getResponse();
            
            if (!username.trim() || !password.trim()) {
                e.preventDefault();
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            if (!recaptchaResponse) {
                e.preventDefault();
                showMessage('Please complete the reCAPTCHA verification', 'error');
                return;
            }
        });

        // Show message function
        function showMessage(message, type = 'info') {
            const messageContainer = document.getElementById('message-container');
            if (!messageContainer) return;
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `${type}-message`;
            messageDiv.textContent = message;
            
            messageContainer.innerHTML = '';
            messageContainer.appendChild(messageDiv);
            
            // Auto-hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 300);
            }, 5000);
        }

        // Focus management - fast loader will handle loading screen
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('username').focus();
        });

        // Fast loader will automatically handle form submissions
        // No additional loading code needed here
    </script>
</body>
</html>
