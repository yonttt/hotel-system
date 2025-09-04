<?php
/**
 * HRD Module - Administration - Master Data - Profil Hotel
 * 
 * This module handles hotel profile management
 * 
 * @author Eva Group Hotel System
 * @version 1.0
 */

// No database connection needed for this module yet
// require_once '../../../../config/database.php';

?>

<div class="module-container">
    <!-- Header Section -->
    <div class="module-header">
        <h1 class="module-title">Profil Hotel</h1>
        <p class="module-subtitle">HRD > Administration > Master Data</p>
    </div>

    <!-- Main Content Area -->
    <div class="module-content">
        <!-- Icon and Main Info -->
        <div class="module-icon-section">
            <div class="module-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
            </div>
            
            <h2 class="module-main-title">Profil Hotel</h2>
            <p class="module-description">Manage and configure hotel profile information and settings.</p>
        </div>

        <!-- Hotel Profile Form -->
        <div class="profile-form-container">
            <form id="hotelProfileForm" class="profile-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="hotel_name" class="form-label">Hotel Name</label>
                        <input type="text" id="hotel_name" name="hotel_name" class="form-input" placeholder="Enter hotel name" value="Eva Group Hotel">
                    </div>
                    
                    <div class="form-group">
                        <label for="hotel_category" class="form-label">Hotel Category</label>
                        <select id="hotel_category" name="hotel_category" class="form-input">
                            <option value="">Select Category</option>
                            <option value="3" selected>3 Star</option>
                            <option value="4">4 Star</option>
                            <option value="5">5 Star</option>
                        </select>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="hotel_address" class="form-label">Address</label>
                        <textarea id="hotel_address" name="hotel_address" class="form-input" rows="3" placeholder="Enter hotel address">Jl. Hotel Street No. 123, Jakarta</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="hotel_phone" class="form-label">Phone Number</label>
                        <input type="text" id="hotel_phone" name="hotel_phone" class="form-input" placeholder="Enter phone number" value="+62 21 1234567">
                    </div>
                    
                    <div class="form-group">
                        <label for="hotel_email" class="form-label">Email</label>
                        <input type="email" id="hotel_email" name="hotel_email" class="form-input" placeholder="Enter email address" value="info@evagroup.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="hotel_website" class="form-label">Website</label>
                        <input type="url" id="hotel_website" name="hotel_website" class="form-input" placeholder="Enter website URL" value="https://www.evagroup.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="total_rooms" class="form-label">Total Rooms</label>
                        <input type="number" id="total_rooms" name="total_rooms" class="form-input" placeholder="Number of rooms" value="150">
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="reset" class="btn btn-secondary">Reset</button>
                </div>
            </form>
        </div>

        <!-- Module Information Card -->
        <div class="module-info-card">
            <h3 class="info-card-title">Module Information</h3>
            <div class="info-card-content">
                <div class="info-row">
                    <span class="info-label">Category:</span>
                    <span class="info-value">HRD > Administration > Master Data</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge active">Active</span>
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
    margin: 0 0 40px 0;
    line-height: 1.5;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.profile-form-container {
    margin-bottom: 40px;
}

.profile-form {
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.form-input {
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    color: #111827;
    background: #ffffff;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
    background: #f9fafb;
    color: #6b7280;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
}

.btn-secondary:hover {
    background: #e5e7eb;
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
    
    .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .form-actions {
        flex-direction: column;
    }
}
</style>

<style>
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: block;
}

.form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-actions {
    margin-top: 1.5rem;
}

.btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.info-box {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
    border: 1px solid #dee2e6;
}

.action-list {
    list-style: none;
    padding: 0;
}

.action-list li {
    margin-bottom: 0.5rem;
}

.action-link {
    color: #007bff;
    text-decoration: none;
}

.action-link:hover {
    text-decoration: underline;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-weight: 500;
}

.stat-value {
    font-weight: 600;
    color: #007bff;
}
</style>
