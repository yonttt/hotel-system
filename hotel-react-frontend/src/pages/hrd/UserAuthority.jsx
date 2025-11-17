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

  useEffect(() => {
    // Load saved authorities from localStorage
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

  const handleSaveAuthorities = () => {
    localStorage.setItem('userAuthorities', JSON.stringify(authorities));
    setSuccessMessage('Otoritas berhasil disimpan!');
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleResetAuthorities = () => {
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
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'frontoffice':
        return '#007bff'; // blue
      case 'housekeeping':
        return '#28a745'; // green
      case 'staff':
        return '#6c757d'; // gray
      default:
        return '#6c757d';
    }
  };

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

  // Check if user is admin or manager
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <Layout>
        <div className="content-wrapper">
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="content-wrapper">
        <h1 style={{ marginBottom: '24px' }}>Otoritas Pengguna</h1>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '24px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleResetAuthorities}
            style={{
              padding: '10px 20px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Reset to Default
          </button>
          <button
            onClick={handleSaveAuthorities}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Save Changes
          </button>
        </div>

        {/* Authority Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {Object.keys(authorities).map((role) => (
            <div 
              key={role}
              style={{
                background: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              {/* Role Header */}
              <div style={{ 
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '2px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'inline-block',
                  background: getRoleBadgeColor(role),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {roleLabels[role]}
                </div>
              </div>

              {/* Permissions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(authorities[role]).map(permission => (
                  <label 
                    key={permission}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={authorities[role][permission]}
                      onChange={() => handlePermissionChange(role, permission)}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ 
                      fontSize: '14px',
                      flex: 1
                    }}>
                      {permissionLabels[permission]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '24px',
          background: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>ℹ️</span>
            <div style={{ flex: 1 }}>
              <strong style={{ 
                display: 'block', 
                marginBottom: '8px'
              }}>
                Informasi Otoritas
              </strong>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '20px', 
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                <li>
                  <strong>Lihat Data:</strong> Dapat melihat/membaca data
                </li>
                <li>
                  <strong>Buat Data Baru:</strong> Dapat membuat entry baru
                </li>
                <li>
                  <strong>Edit Data:</strong> Dapat mengubah data yang ada
                </li>
                <li>
                  <strong>Hapus Data:</strong> Dapat menghapus data
                </li>
              </ul>
              <p style={{ 
                margin: '12px 0 0 0', 
                fontSize: '13px', 
                fontStyle: 'italic'
              }}>
                <strong>⚠️ Catatan:</strong> Perubahan otoritas akan berlaku untuk semua pengguna dengan role tersebut
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAuthority;
