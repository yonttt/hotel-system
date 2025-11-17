import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const UserAuthority = () => {
  const { user } = useAuth();
  const [authorities, setAuthorities] = useState({
    frontoffice: {
      canEdit: true,
      canDelete: false,
      canCreate: true,
      canView: true
    },
    housekeeping: {
      canEdit: true,
      canDelete: false,
      canCreate: true,
      canView: true
    },
    staff: {
      canEdit: false,
      canDelete: false,
      canCreate: false,
      canView: true
    }
  });
  const [successMessage, setSuccessMessage] = useState(null);

  // Load saved authorities from localStorage on mount
  useEffect(() => {
    const savedAuthorities = localStorage.getItem('userAuthorities');
    if (savedAuthorities) {
      setAuthorities(JSON.parse(savedAuthorities));
    }
  }, []);

  const handlePermissionChange = (role, permission) => {
    setAuthorities(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission]
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('userAuthorities', JSON.stringify(authorities));
    setSuccessMessage('Otoritas pengguna berhasil disimpan!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua otoritas ke default?')) {
      const defaultAuthorities = {
        frontoffice: {
          canEdit: true,
          canDelete: false,
          canCreate: true,
          canView: true
        },
        housekeeping: {
          canEdit: true,
          canDelete: false,
          canCreate: true,
          canView: true
        },
        staff: {
          canEdit: false,
          canDelete: false,
          canCreate: false,
          canView: true
        }
      };
      setAuthorities(defaultAuthorities);
      localStorage.setItem('userAuthorities', JSON.stringify(defaultAuthorities));
      setSuccessMessage('Otoritas berhasil direset ke default!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  if (user?.role !== 'manager' && user?.role !== 'admin') {
    return (
      <Layout>
        <div className="page-container">
          <div className="content-card">
            <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const roleLabels = {
    frontoffice: 'Front Office',
    housekeeping: 'Housekeeping',
    staff: 'Staff'
  };

  const permissionLabels = {
    canView: 'Lihat Data',
    canCreate: 'Buat Data Baru',
    canEdit: 'Edit Data',
    canDelete: 'Hapus Data'
  };

  const getRoleColor = (role) => {
    const colors = {
      frontoffice: '#0d6efd',
      housekeeping: '#198754',
      staff: '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <h2 className="header-title">OTORITAS PENGGUNA</h2>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                Kelola hak akses untuk setiap role pengguna
              </p>
            </div>
            <div className="unified-header-right" style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-add-new"
                onClick={handleReset}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Reset ke Default
              </button>
              <button 
                className="btn-add-new"
                onClick={handleSave}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                💾 Simpan Perubahan
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>✓</span> {successMessage}
          </div>
        )}

        {/* Authority Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {Object.keys(authorities).map(role => (
            <div 
              key={role}
              style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {/* Role Header */}
              <div style={{ 
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid #eee'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: getRoleColor(role),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {roleLabels[role]}
                </div>
              </div>

              {/* Permissions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.keys(authorities[role]).map(permission => (
                  <label 
                    key={permission}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px',
                      background: authorities[role][permission] ? '#f0f8ff' : '#f8f9fa',
                      border: `1px solid ${authorities[role][permission] ? '#b3d9ff' : '#dee2e6'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      ':hover': {
                        background: '#e9ecef'
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={authorities[role][permission]}
                      onChange={() => handlePermissionChange(role, permission)}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: getRoleColor(role)
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px',
                      fontWeight: authorities[role][permission] ? '500' : '400',
                      color: authorities[role][permission] ? '#000' : '#666',
                      flex: 1
                    }}>
                      {permissionLabels[permission]}
                    </span>
                    {authorities[role][permission] && (
                      <span style={{ 
                        fontSize: '12px',
                        color: '#28a745',
                        fontWeight: '600'
                      }}>
                        ✓ Aktif
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '30px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          padding: '15px 20px'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '20px' }}>ℹ️</span>
            <div>
              <strong style={{ display: 'block', marginBottom: '5px', color: '#856404' }}>
                Informasi Otoritas
              </strong>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404', fontSize: '14px' }}>
                <li><strong>Lihat Data:</strong> Dapat melihat/membaca data</li>
                <li><strong>Buat Data Baru:</strong> Dapat membuat entry baru</li>
                <li><strong>Edit Data:</strong> Dapat mengubah data yang ada</li>
                <li><strong>Hapus Data:</strong> Dapat menghapus data</li>
              </ul>
              <p style={{ margin: '10px 0 0 0', fontSize: '13px', fontStyle: 'italic' }}>
                * Perubahan otoritas akan berlaku untuk semua pengguna dengan role tersebut
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAuthority;
