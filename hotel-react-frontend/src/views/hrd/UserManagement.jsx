import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../../api/api';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import DataTable from '../../ui/DataTable';
import { useAuth } from '../../state/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const location = useLocation();
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
    // Check URL parameter for tab selection
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'users' || tabParam === 'authorities') {
      setActiveTab(tabParam);
    } else if (user?.role === 'manager') {
      // Manager defaults to authorities tab
      setActiveTab('authorities');
    }
  }, [location.search, user]);

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
            <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
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
                <Button variant="success" size="sm" onClick={() => setShowAddModal(true)}>+ Add New User</Button>
              )}
              {activeTab === 'authorities' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="secondary" size="sm" onClick={handleResetAuthorities}>Reset ke Default</Button>
                  <Button variant="success" size="sm" onClick={handleSaveAuthorities}>💾 Simpan Perubahan</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
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
                borderBottom: activeTab === 'users' ? '3px solid #0d6efd' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                borderRadius: '4px 4px 0 0'
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
              borderBottom: activeTab === 'authorities' ? '3px solid #0d6efd' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s',
              borderRadius: '4px 4px 0 0'
            }}
          >
            ⚙️ Otoritas Pengguna
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert alert--success">{successMessage}</div>
        )}

        {error && (
          <div className="alert alert--error">{error}</div>
        )}

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <DataTable
            data={users}
            loading={loading}
            emptyText="No users found"
            rowKey={(usr) => usr.id}
            columns={[
              { key: 'id', header: 'ID', render: (u) => u.id },
              { key: 'username', header: 'Username',
                render: (u) => <span style={{ fontWeight: 500 }}>{u.username}</span> },
              { key: 'email', header: 'Email', render: (u) => u.email || 'N/A' },
              { key: 'role', header: 'Role',
                render: (u) => (
                  <span className="status-pill" style={{ color: 'white', background: getRoleBadgeColor(u.role) }}>{u.role}</span>
                ) },
              { key: 'created', header: 'Created Date',
                render: (u) => new Date(u.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) },
              { key: 'action', header: 'Action', align: 'center', width: '100px',
                render: (u) => u.id !== user.id
                  ? <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id, u.username)}>Delete</Button>
                  : null }
            ]}
          />
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
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <div className="app-modal-overlay">
            <div className="app-modal-card" style={{ maxWidth: '500px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Add New User</h3>

              {submitError && (
                <div className="alert alert--error">{submitError}</div>
              )}

              <form onSubmit={handleAddUser}>
                <div style={{ marginBottom: '15px' }}>
                  <label className="field-label">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter username"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label className="field-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter email (optional)"
                  />
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label className="field-label">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter password"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="field-label">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="frontoffice">Front Office</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="secondary"
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="success" disabled={submitLoading}>
                    {submitLoading ? 'Adding...' : 'Add User'}
                  </Button>
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
