import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'frontoffice'
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

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
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'frontoffice'
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage(null);
        fetchUsers(); // Refresh the list
      }, 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await apiService.deleteUser(userId);
        setSuccessMessage(`User "${username}" deleted successfully!`);
        fetchUsers();
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } catch (err) {
        setError('Failed to delete user: ' + (err.response?.data?.detail || err.message));
        console.error('Error deleting user:', err);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return '#dc3545'; // red
      case 'manager':
        return '#6f42c1'; // purple
      case 'frontoffice':
        return '#007bff'; // blue
      case 'housekeeping':
        return '#28a745'; // green
      default:
        return '#6c757d'; // gray
    }
  };

  // Check if user is admin
  if (!user || user.role !== 'admin') {
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
        <h1 style={{ marginBottom: '24px' }}>User List</h1>

        {/* Success/Error Messages */}
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

        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Users Table */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0 }}>Users</h2>
            <button
              onClick={() => setShowAddModal(true)}
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
              + Add User
            </button>
          </div>

          <table className="reservation-table" style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                background: '#f8f9fa',
                borderBottom: '2px solid #dee2e6'
              }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Created Date</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ 
                    padding: '40px', 
                    textAlign: 'center'
                  }}>
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ 
                    padding: '40px', 
                    textAlign: 'center',
                    color: '#6c757d'
                  }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((usr, index) => (
                  <tr key={usr.id} style={{
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <td style={{ padding: '12px' }}>{usr.id}</td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{usr.username}</td>
                    <td style={{ padding: '12px' }}>{usr.email || 'N/A'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getRoleBadgeColor(usr.role)
                      }}>
                        {usr.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{new Date(usr.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {usr.id !== user.id && (
                        <button 
                          className="btn-table-action"
                          onClick={() => handleDeleteUser(usr.id, usr.username)}
                          style={{ 
                            background: '#dc3545', 
                            border: 'none',
                            color: 'white',
                            padding: '6px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
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

        {/* Add User Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New User</h2>

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

export default UserList;
