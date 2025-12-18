import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
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
import RegistrasiPage from './pages/operational/frontoffice/form_transaksi/registrasi';
import ReservasiPage from './pages/operational/frontoffice/form_transaksi/reservasi';
import GroupBooking from './pages/operational/frontoffice/form_transaksi/GroupBooking';
import GroupBookingList from './pages/operational/frontoffice/informasi_group_booking/GroupBookingList';
import GroupBookingRooms from './pages/operational/frontoffice/informasi_group_booking/GroupBookingRooms';

// Operational - Other
import AdjustmentPage from './pages/operational/AdjustmentPage';
import FoodBeveragePage from './pages/operational/FoodBeveragePage';
import LaundryPage from './pages/operational/LaundryPage';

// Operational - Food & Beverage - Master Data
import MasterMeja from './pages/operational/foodbeverage/master_data/MasterMeja';
import KategoriMenuResto from './pages/operational/foodbeverage/master_data/KategoriMenuResto';

// Operational - Front Office - Informasi Reservasi
import AllReservationPage from './pages/operational/frontoffice/informasi_reservasi/AllReservationPage';
import ReservasiDeposit from './pages/operational/frontoffice/informasi_reservasi/ReservasiDeposit';
import ReservasiToday from './pages/operational/frontoffice/informasi_reservasi/ReservasiToday';

// Operational - Front Office - Informasi Tamu
import CheckinToday from './pages/operational/frontoffice/informasi_tamu/CheckinToday';
import GuestHistory from './pages/operational/frontoffice/informasi_tamu/GuestHistory';
import InhouseGuest from './pages/operational/frontoffice/informasi_tamu/InhouseGuest';

// Operational - Housekeeping - Master Data
import MasterRoomType from './pages/operational/housekeeping/master_data/MasterRoomType';
import ManagementRoom from './pages/operational/housekeeping/master_data/ManagementRoom';
import StatusKamarHP from './pages/operational/housekeeping/statuskamarhp/StatusKamarHP';

// Operational - Front Office - Status Kamar FO
import StatusKamarFO from './pages/operational/frontoffice/statuskamarfo/StatusKamarFO';

// Operational - Front Office - Master Data
import UbahStatusKamar from './pages/operational/frontoffice/master_data/UbahStatusKamar';
import MasterHargaKamar from './pages/operational/frontoffice/master_data/MasterHargaKamar';

// HRD
import AccountReceivablePage from './pages/hrd/AccountReceivablePage';
import AccountingPage from './pages/hrd/AccountingPage';
import AdministrationPage from './pages/hrd/AdministrationPage';
import UserManagement from './pages/hrd/UserManagement';
import UserList from './pages/hrd/UserList';
import UserAuthority from './pages/hrd/UserAuthority';
import LaporanGlobal from './pages/hrd/LaporanGlobal';

// Profile Page
import ProfilePage from './pages/ProfilePage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
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
            {/* --- END OF CORRECTION --- */}

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
