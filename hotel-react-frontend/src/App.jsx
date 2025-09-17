import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

// Operational - Front Office
import RegistrasiPage from './pages/operational/frontoffice/form_transaksi/registrasi';
import ReservasiPage from './pages/operational/frontoffice/form_transaksi/reservasi';

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
            
            {/* --- CORRECTED ROUTES --- */}
            {/* Specific route for Registrasi */}
            <Route 
              path="/operational/frontoffice/form-transaksi/registrasi" 
              element={
                <ProtectedRoute>
                  <RegistrasiPage />
                </ProtectedRoute>
              } 
            />
            {/* Specific route for Reservasi */}
            <Route 
              path="/operational/frontoffice/form-transaksi/reservasi" 
              element={
                <ProtectedRoute>
                  <ReservasiPage />
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
