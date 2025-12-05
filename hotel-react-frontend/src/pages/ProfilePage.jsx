import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import {
  UserCircleIcon,
  KeyIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon
} from '@heroicons/react/24/solid';

const ProfilePage = () => {
  const { user } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Semua field harus diisi' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru dan konfirmasi tidak cocok' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter' });
      return;
    }

    setLoading(true);
    try {
      // First verify current password by trying to login
      const loginResponse = await apiService.login(user.username, currentPassword);
      
      if (loginResponse.data.access_token) {
        // Current password is correct, now update to new password
        await apiService.updateCurrentUser({ password: newPassword });
        
        setMessage({ type: 'success', text: 'Password berhasil diubah!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: 'Password saat ini salah' });
      } else {
        setMessage({ type: 'error', text: 'Gagal mengubah password. Silakan coba lagi.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'Administrator',
      'manager': 'Manager',
      'staff': 'Staff',
      'frontoffice': 'Front Office',
      'housekeeping': 'Housekeeping'
    };
    return roleLabels[role] || role;
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        <div className="unified-header-controls">
          <h2>PROFIL PENGGUNA</h2>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <ExclamationCircleIcon className="w-4 h-4" />
            )}
            {message.text}
          </div>
        )}

        {/* Profile Card with Avatar and Info */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            {/* Small Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <UserCircleIcon style={{ width: '70px', height: '70px', color: '#6c757d' }} />
            </div>

            {/* User Info Grid */}
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 16px 0', 
                color: '#343a40',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {user?.username?.toUpperCase()}
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '12px 24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EnvelopeIcon style={{ width: '16px', height: '16px', color: '#6c757d' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>Email</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#343a40' }}>
                      {user?.email || '-'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheckIcon style={{ width: '16px', height: '16px', color: '#6c757d' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>Role</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#343a40' }}>
                      {getRoleLabel(user?.role)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BuildingOfficeIcon style={{ width: '16px', height: '16px', color: '#6c757d' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>Hotel</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#343a40' }}>
                      {user?.hotel_name || 'HOTEL NEW IDOLA'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserIcon style={{ width: '16px', height: '16px', color: '#6c757d' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>Nama Lengkap</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#343a40' }}>
                      {user?.full_name || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: '#343a40',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <KeyIcon style={{ width: '18px', height: '18px', color: '#28a745' }} />
            Keamanan Akun
          </h3>

          {!showChangePassword ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#6c757d', margin: 0, fontSize: '14px' }}>
                Untuk menjaga keamanan akun, disarankan untuk mengganti password secara berkala.
              </p>
              <button
                onClick={() => setShowChangePassword(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                <KeyIcon style={{ width: '14px', height: '14px' }} />
                Ubah Password
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#343a40'
                  }}>
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Password saat ini"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#343a40'
                  }}>
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Password baru"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '6px', 
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#343a40'
                  }}>
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Konfirmasi password"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setMessage({ type: '', text: '' });
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
