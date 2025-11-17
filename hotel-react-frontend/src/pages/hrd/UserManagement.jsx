import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'authorities'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'frontoffice'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      if (activeTab === 'users') {
        fetchUsers();
      }
    }
    // Load saved authorities from localStorage
    const savedAuthorities = localStorage.getItem('userAuthorities');
    if (savedAuthorities) {
      setAuthorities(JSON.parse(savedAuthorities));
    }
  }, [user, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      await apiService.registerUser(formData);
      setSuccessMessage(`User "${formData.username}" added successfully!`);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'frontoffice'
      });
      setShowAddModal(false);
      fetchUsers(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      setSuccessMessage(`User "${username}" deleted successfully!`);
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: '#dc3545',
      manager: '#fd7e14',
      frontoffice: '#0d6efd',
      housekeeping: '#198754',
      staff: '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

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
    setSuccessMessage('Otoritas pengguna berhasil disimpan!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleResetAuthorities = () => {
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

  if (user?.role !== 'admin' && user?.role !== 'manager') {
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

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <h2 className="header-title">USER MANAGEMENT</h2>
            </div>
            <div className="unified-header-right">
              {activeTab === 'users' && user?.role === 'admin' && (
                <button 
                  className="btn-add-new"
                  onClick={() => setShowAddModal(true)}
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
                  + Add New User
                </button>
              )}
              {activeTab === 'authorities' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-add-new"
                    onClick={handleResetAuthorities}
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
                    onClick={handleSaveAuthorities}
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
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '2px', 
          marginBottom: '24px',
          borderBottom: '3px solid #f0f0f0',
          paddingBottom: '0',
          background: '#fafafa',
          borderRadius: '8px 8px 0 0',
          padding: '4px 4px 0 4px'
        }}>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '14px 28px',
                background: activeTab === 'users' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#666',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'users' ? '0 -2px 10px rgba(102, 126, 234, 0.3)' : 'none',
                transform: activeTab === 'users' ? 'translateY(-2px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>👥</span> User List
            </button>
          )}
          <button
            onClick={() => setActiveTab('authorities')}
            style={{
              padding: '14px 28px',
              background: activeTab === 'authorities' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'authorities' ? 'white' : '#666',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'authorities' ? '0 -2px 10px rgba(102, 126, 234, 0.3)' : 'none',
              transform: activeTab === 'authorities' ? 'translateY(-2px)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>⚙️</span> Otoritas Pengguna
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
            border: '2px solid #28a745',
            color: '#155724',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '15px',
            fontWeight: '500',
            animation: 'slideInDown 0.4s ease-out'
          }}>
            <span style={{ fontSize: '24px' }}>✓</span>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
            border: '2px solid #dc3545',
            color: '#721c24',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(220, 53, 69, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            {error}
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e8e8e8'
          }}>
          <table className="reservation-table" style={{
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}>
                <th style={{ width: '80px', color: 'white', padding: '16px' }}>ID</th>
                <th style={{ color: 'white', padding: '16px' }}>Username</th>
                <th style={{ color: 'white', padding: '16px' }}>Email</th>
                <th style={{ width: '150px', color: 'white', padding: '16px' }}>Role</th>
                <th style={{ width: '180px', color: 'white', padding: '16px' }}>Created Date</th>
                <th style={{ width: '120px', color: 'white', padding: '16px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-spinner" style={{ 
                    padding: '40px', 
                    textAlign: 'center',
                    fontSize: '16px',
                    color: '#667eea'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <div style={{ 
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #667eea',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data" style={{ 
                    padding: '40px', 
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '15px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((usr, index) => (
                  <tr key={usr.id} style={{
                    background: index % 2 === 0 ? '#fafafa' : 'white',
                    transition: 'all 0.2s',
                    ':hover': { background: '#f0f0f0' }
                  }}>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#667eea' }}>{usr.id}</td>
                    <td style={{ padding: '16px', fontWeight: '600', color: '#333' }}>{usr.username}</td>
                    <td style={{ padding: '16px', color: '#666' }}>{usr.email || 'N/A'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getRoleBadgeColor(usr.role),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: `0 2px 8px ${getRoleBadgeColor(usr.role)}40`
                      }}>
                        {usr.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#666', fontSize: '13px' }}>{new Date(usr.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {usr.id !== user.id && (
                        <button 
                          className="btn-table-action"
                          onClick={() => handleDeleteUser(usr.id, usr.username)}
                          style={{ 
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', 
                            border: 'none',
                            color: 'white',
                            padding: '8px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            transition: 'all 0.3s',
                            boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
                          }}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}

        {/* Authorities Tab Content */}
        {activeTab === 'authorities' && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '24px',
              marginTop: '8px'
            }}>
              {Object.keys(authorities).map((role, index) => (
                <div 
                  key={role}
                  style={{
                    background: 'white',
                    border: '2px solid #e8e8e8',
                    borderRadius: '16px',
                    padding: '28px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* Role Header */}
                  <div style={{ 
                    marginBottom: '24px',
                    paddingBottom: '20px',
                    borderBottom: '3px solid #f0f0f0'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      background: `linear-gradient(135deg, ${getRoleBadgeColor(role)} 0%, ${getRoleBadgeColor(role)}dd 100%)`,
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '30px',
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
                          transition: 'all 0.2s'
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
                            accentColor: getRoleBadgeColor(role)
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
              marginTop: '32px',
              background: 'linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%)',
              border: '2px solid #ffc107',
              borderRadius: '16px',
              padding: '24px 28px',
              boxShadow: '0 4px 16px rgba(255, 193, 7, 0.15)'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '32px', lineHeight: 1 }}>ℹ️</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ 
                    display: 'block', 
                    marginBottom: '12px', 
                    color: '#856404',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    Informasi Otoritas
                  </strong>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: '24px', 
                    color: '#856404', 
                    fontSize: '15px',
                    lineHeight: '1.8'
                  }}>
                    <li style={{ marginBottom: '8px' }}>
                      <strong>Lihat Data:</strong> Dapat melihat/membaca data
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <strong>Buat Data Baru:</strong> Dapat membuat entry baru
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      <strong>Edit Data:</strong> Dapat mengubah data yang ada
                    </li>
                    <li>
                      <strong>Hapus Data:</strong> Dapat menghapus data
                    </li>
                  </ul>
                  <p style={{ 
                    margin: '16px 0 0 0', 
                    fontSize: '14px', 
                    fontStyle: 'italic',
                    color: '#856404',
                    background: 'rgba(255,255,255,0.5)',
                    padding: '12px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #ffc107'
                  }}>
                    <strong>⚠️ Catatan:</strong> Perubahan otoritas akan berlaku untuk semua pengguna dengan role tersebut
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '500px',
              maxWidth: '90%'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Add New User</h3>
              
              {submitError && (
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  color: '#721c24',
                  padding: '10px',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleAddUser}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Enter username"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Enter email (optional)"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    placeholder="Enter password"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  >
                    <option value="frontoffice">Front Office</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSubmitError(null);
                      setFormData({
                        username: '',
                        email: '',
                        password: '',
                        role: 'frontoffice'
                      });
                    }}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      background: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      background: submitLoading ? '#6c757d' : '#28a745',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: submitLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {submitLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
