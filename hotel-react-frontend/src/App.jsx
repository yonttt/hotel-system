import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

// Operational - Front Office
import RegistrasiPage from './pages/operational/frontoffice/form_transaksi/registrasi'
import ReservasiPage from './pages/operational/frontoffice/form_transaksi/reservasi'
import InfoReservasiPage from './pages/operational/frontoffice/info_reservasi/all_reservation'
import InformasiTamuPage from './pages/operational/frontoffice/informasi_tamu/guest_history'
import StatusKamarPage from './pages/operational/frontoffice/status kamar/status_kamar_fo'

// Operational - Other
import AdjustmentPage from './pages/operational/adjustment/AdjustmentPage'
import FoodBeveragePage from './pages/operational/foodbeverage/FoodBeveragePage'
import HousekeepingPage from './pages/operational/housekeeping/HousekeepingPage'
import LaundryPage from './pages/operational/laundry/LaundryPage'

// HRD
import AccountReceivablePage from './pages/hrd/accountingreceivable/AccountReceivablePage'
import AccountingPage from './pages/hrd/accounting/AccountingPage'
import AdministrationPage from './pages/hrd/administration/AdministrationPage'

import ProtectedRoute from './components/ProtectedRoute'

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
            {/* Operational - Front Office */}
            <Route 
              path="/operational/frontoffice/form-transaksi" 
              element={
                <ProtectedRoute>
                  <RegistrasiPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/form-transaksi/registrasi" 
              element={
                <ProtectedRoute>
                  <RegistrasiPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/form-transaksi/reservasi" 
              element={
                <ProtectedRoute>
                  <ReservasiPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/info-reservasi" 
              element={
                <ProtectedRoute>
                  <InfoReservasiPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/informasi-tamu" 
              element={
                <ProtectedRoute>
                  <InformasiTamuPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/operational/frontoffice/status-kamar" 
              element={
                <ProtectedRoute>
                  <StatusKamarPage />
                </ProtectedRoute>
              } 
            />

            {/* Operational - Other */}
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
            <Route 
              path="/operational/housekeeping" 
              element={
                <ProtectedRoute>
                  <HousekeepingPage />
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

            {/* HRD */}
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
