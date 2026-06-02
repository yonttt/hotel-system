import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import LoginPage from './views/LoginPage';
import DashboardPage from './views/DashboardPage';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          margin: '1rem',
          color: '#dc2626'
        }}>
          <h2>Something went wrong with this page</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            <summary>Error Details (click to expand)</summary>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Component Stack:</strong></p>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Operational - Front Office
import RegistrasiPage from './views/operational/frontoffice/form_transaksi/registrasi';
import ReservasiPage from './views/operational/frontoffice/form_transaksi/reservasi';
import GroupBooking from './views/operational/frontoffice/form_transaksi/GroupBooking';
import GroupBookingList from './views/operational/frontoffice/informasi_group_booking/GroupBookingList';
import GroupBookingRooms from './views/operational/frontoffice/informasi_group_booking/GroupBookingRooms';

// Operational - Other
import AdjustmentPage from './views/operational/AdjustmentPage';
import FoodBeveragePage from './views/operational/FoodBeveragePage';
import LaundryPage from './views/operational/LaundryPage';

// Operational - Adjustment
import CheckInToday from './views/operational/adjustment/CheckInToday';
import CheckOutToday from './views/operational/adjustment/CheckOutToday';
import NightAudit from './views/operational/adjustment/NightAudit';
import AdjFoodBeverage from './views/operational/adjustment/AdjFoodBeverage';
import AdjInventory from './views/operational/adjustment/AdjInventory';
import AdjKos from './views/operational/adjustment/AdjKos';
import AdjLaundry from './views/operational/adjustment/AdjLaundry';
import AdjMeetingRoom from './views/operational/adjustment/AdjMeetingRoom';
import AdjPettyCash from './views/operational/adjustment/AdjPettyCash';

// Operational - Food & Beverage - Master Data
import MasterMeja from './views/operational/foodbeverage/master_data/MasterMeja';
import KategoriMenuResto from './views/operational/foodbeverage/master_data/KategoriMenuResto';

// Operational - Front Office - Informasi Reservasi
import AllReservationPage from './views/operational/frontoffice/informasi_reservasi/AllReservationPage';
import ReservasiDeposit from './views/operational/frontoffice/informasi_reservasi/ReservasiDeposit';
import ReservasiToday from './views/operational/frontoffice/informasi_reservasi/ReservasiToday';

// Operational - Front Office - Informasi Tamu
import CheckinToday from './views/operational/frontoffice/informasi_tamu/CheckinToday';
import GuestHistory from './views/operational/frontoffice/informasi_tamu/GuestHistory';
import InhouseGuest from './views/operational/frontoffice/informasi_tamu/InhouseGuest';

// Operational - Housekeeping - Master Data
import MasterRoomType from './views/operational/housekeeping/master_data/MasterRoomType';
import ManagementRoom from './views/operational/housekeeping/master_data/ManagementRoom';
import StatusKamarHP from './views/operational/housekeeping/statuskamarhp/StatusKamarHP';

// Operational - Front Office - Status Kamar FO
import StatusKamarFO from './views/operational/frontoffice/statuskamarfo/StatusKamarFO';

// Operational - Front Office - Master Data
import UbahStatusKamar from './views/operational/frontoffice/master_data/UbahStatusKamar';
import MasterHargaKamar from './views/operational/frontoffice/master_data/MasterHargaKamar';

// HRD
import AccountReceivablePage from './views/hrd/AccountReceivablePage';
import AccountingPage from './views/hrd/AccountingPage';
import AdministrationPage from './views/hrd/AdministrationPage';
import UserManagement from './views/hrd/UserManagement';
import UserList from './views/hrd/UserList';
import UserAuthority from './views/hrd/UserAuthority';
import LaporanGlobal from './views/hrd/LaporanGlobal';
import WebsiteEditor from './views/WebsiteEditor';
import PropertyList from './views/hrd/master_data/PropertyList';

// Profile Page
import ProfilePage from './views/ProfilePage';

import ProtectedRoute from './ui/ProtectedRoute';
import TopProgressBar from './ui/TopProgressBar';

function App() {
  return (
    <AuthProvider>
      <Router basename="/admin">
        <TopProgressBar />
        <div className="app-wrapper">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Profile Page */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* --- CORRECTED ROUTES --- */}
            {/* Specific route for Registrasi */}
            <Route 
              path="/operational/frontoffice/form-transaksi/registrasi" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <RegistrasiPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            {/* Specific route for Reservasi */}
            <Route 
              path="/operational/frontoffice/form-transaksi/reservasi" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ReservasiPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            {/* Specific route for Group Booking */}
            <Route 
              path="/operational/frontoffice/form-transaksi/group-booking" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <GroupBooking />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/informasi-group-booking" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <GroupBookingList />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/group-booking-rooms" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <GroupBookingRooms />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Operational - Other Routes */}
            <Route 
              path="/operational/adjustment" 
              element={
                <ProtectedRoute>
                  <AdjustmentPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Front Office - Check In */}
            <Route 
              path="/operational/adjustment/front-office/checkin" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <CheckInToday />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Front Office - Checkout */}
            <Route 
              path="/operational/adjustment/front-office/checkout" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <CheckOutToday />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Front Office - Night Audit */}
            <Route 
              path="/operational/adjustment/front-office/night-audit" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <NightAudit />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Food & Beverage */}
            <Route 
              path="/operational/adjustment/food-beverage" 
              element={
                <ProtectedRoute>
                  <AdjFoodBeverage />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Inventory */}
            <Route 
              path="/operational/adjustment/inventory" 
              element={
                <ProtectedRoute>
                  <AdjInventory />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Kos */}
            <Route 
              path="/operational/adjustment/kos" 
              element={
                <ProtectedRoute>
                  <AdjKos />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Laundry */}
            <Route 
              path="/operational/adjustment/laundry" 
              element={
                <ProtectedRoute>
                  <AdjLaundry />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Meeting Room */}
            <Route 
              path="/operational/adjustment/meeting-room" 
              element={
                <ProtectedRoute>
                  <AdjMeetingRoom />
                </ProtectedRoute>
              } 
            />
            
            {/* Adjustment - Petty Cash */}
            <Route 
              path="/operational/adjustment/petty-cash" 
              element={
                <ProtectedRoute>
                  <AdjPettyCash />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/operational/foodbeverage" 
              element={
                <ProtectedRoute>
                  <FoodBeveragePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Food & Beverage - Master Data */}
            <Route 
              path="/operational/foodbeverage/master-data-fb/master-meja" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MasterMeja />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/foodbeverage/master-data-fb/kategori-menu-resto" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <KategoriMenuResto />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/operational/laundry" 
              element={
                <ProtectedRoute>
                  <LaundryPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Front Office - Status Kamar FO */}
            <Route 
              path="/operational/frontoffice/status-kamar-fo" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <StatusKamarFO />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Front Office - Master Data */}
            <Route 
              path="/operational/frontoffice/master-data-fo/ubah-status-kamar" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <UbahStatusKamar />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/master-data-fo/master-harga-kamar" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MasterHargaKamar />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Housekeeping Routes */}
            <Route 
              path="/operational/housekeeping/status-kamar-hp" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <StatusKamarHP />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/housekeeping/master-data/room-type" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <MasterRoomType />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/housekeeping/master-data/management-room" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ManagementRoom />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Front Office - Other Routes */}
            <Route 
              path="/operational/frontoffice/info-reservasi/all" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AllReservationPage />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/info-reservasi/deposit" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ReservasiDeposit />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/info-reservasi/today" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ReservasiToday />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* Front Office - Informasi Tamu Routes */}
            <Route 
              path="/operational/frontoffice/informasi-tamu/check-in-today" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <CheckinToday />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/informasi-tamu/guest-history" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <GuestHistory />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/informasi-tamu/in-house-guest" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <InhouseGuest />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
            
            {/* HRD Routes */}
            <Route 
              path="/hrd/account-receivable" 
              element={
                <ProtectedRoute>
                  <AccountReceivablePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/accounting" 
              element={
                <ProtectedRoute>
                  <AccountingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/administration" 
              element={
                <ProtectedRoute>
                  <AdministrationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/user-management" 
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/user-list" 
              element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/user-authority" 
              element={
                <ProtectedRoute>
                  <UserAuthority />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/laporan-global" 
              element={
                <ProtectedRoute>
                  <LaporanGlobal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hrd/profil-hotel" 
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PropertyList />
                  </ErrorBoundary>
                </ProtectedRoute>
              } 
            />
                        <Route 
              path="/website-editor" 
              element={
                <ProtectedRoute>
                  <WebsiteEditor />
                </ProtectedRoute>
              } 
            />
            {/* --- END OF CORRECTION --- */}

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

