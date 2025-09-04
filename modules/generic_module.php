<?php
// Generic module template for all menu items
$module_name = $_GET['module'] ?? 'unknown';
$page_title = $_GET['title'] ?? ucwords(str_replace('-', ' ', $module_name));

// Get category from module name
$category_parts = explode('-', $module_name);
$category = '';
if (count($category_parts) > 1) {
    $category = ucfirst($category_parts[0]) . ' > ' . ucfirst(str_replace('-', ' ', implode(' ', array_slice($category_parts, 1))));
} else {
    $category = 'General';
}
?>

<div class="module-container">
    <!-- Header Section -->
    <div class="module-header">
        <h1 class="module-title"><?= htmlspecialchars($page_title) ?></h1>
        <p class="module-subtitle"><?= htmlspecialchars($category) ?></p>
    </div>

    <!-- Main Content Area -->
    <div class="module-content">
        <!-- Icon and Main Info -->
        <div class="module-icon-section">
            <div class="module-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            </div>
            
            <h2 class="module-main-title"><?= htmlspecialchars($page_title) ?></h2>
            <p class="module-description">Process and manage <?= strtolower(htmlspecialchars($page_title)) ?> efficiently with this module.</p>
        </div>

        <!-- Module Information Card -->
        <div class="module-info-card">
            <h3 class="info-card-title">Module Information</h3>
            <div class="info-card-content">
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span class="info-value"><?= htmlspecialchars($category) ?></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge development">Development Ready</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Last Updated:</span>
                    <span class="info-value"><?= date('Y-m-d H:i:s') ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.module-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.module-header {
    text-align: left;
    margin-bottom: 40px;
}

.module-title {
    font-size: 28px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    line-height: 1.2;
}

.module-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
    font-weight: 400;
}

.module-content {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 60px 40px;
    text-align: center;
}

.module-icon-section {
    margin-bottom: 40px;
}

.module-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: #f3f4f6;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
}

.module-icon svg {
    width: 40px;
    height: 40px;
}

.module-main-title {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 12px 0;
    line-height: 1.3;
}

.module-description {
    font-size: 16px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.module-info-card {
    background: #f9fafb;
    border-radius: 8px;
    padding: 24px;
    text-align: left;
    max-width: 400px;
    margin: 0 auto;
}

.info-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
    text-align: center;
}

.info-card-content {
    space-y: 12px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
}

.info-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.info-label {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
}

.info-value {
    font-size: 14px;
    color: #374151;
    font-weight: 400;
}

.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.status-badge.development {
    background-color: #fef3c7;
    color: #d97706;
}

.status-badge.ready {
    background-color: #d1fae5;
    color: #065f46;
}

.status-badge.active {
    background-color: #dbeafe;
    color: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 768px) {
    .module-container {
        padding: 20px 15px;
    }
    
    .module-content {
        padding: 40px 20px;
    }
    
    .module-title {
        font-size: 24px;
    }
    
    .module-main-title {
        font-size: 20px;
    }
    
    .module-icon {
        width: 60px;
        height: 60px;
    }
    
    .module-icon svg {
        width: 30px;
        height: 30px;
    }
}
</style>
