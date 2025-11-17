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
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0',
          paddingBottom: '0'
        }}>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'users' ? '#0d6efd' : 'transparent',
                color: activeTab === 'users' ? 'white' : '#666',
                border: 'none',
                borderBottom: activeTab === 'users' ? '3px solid #0d6efd' : 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              👥 User List
            </button>
          )}
          <button
            onClick={() => setActiveTab('authorities')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'authorities' ? '#0d6efd' : 'transparent',
              color: activeTab === 'authorities' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'authorities' ? '3px solid #0d6efd' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s'
            }}
          >
            ⚙️ Otoritas Pengguna
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="unified-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th style={{ width: '150px' }}>Role</th>
                <th style={{ width: '180px' }}>Created Date</th>
                <th style={{ width: '120px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading-spinner">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No users found</td>
                </tr>
              ) : (
                users.map((usr) => (
                  <tr key={usr.id}>
                    <td>{usr.id}</td>
                    <td style={{ fontWeight: '500' }}>{usr.username}</td>
                    <td>{usr.email || 'N/A'}</td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'white',
                        background: getRoleBadgeColor(usr.role),
                        textTransform: 'uppercase'
                      }}>
                        {usr.role}
                      </span>
                    </td>
                    <td>{new Date(usr.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td>
                      {usr.id !== user.id && (
                        <button 
                          className="btn-table-action"
                          onClick={() => handleDeleteUser(usr.id, usr.username)}
                          style={{ background: '#dc3545', borderColor: '#dc3545' }}
                        >
                          Delete
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
                      background: getRoleBadgeColor(role),
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
