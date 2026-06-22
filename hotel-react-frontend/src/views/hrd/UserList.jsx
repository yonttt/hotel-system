import { useState, useEffect } from 'react';
import { apiService } from '../../api/api';
import Layout from '../../ui/Layout';
import UnifiedTableHeader from '../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../ui/UnifiedTableFooter';
import { useAuth } from '../../state/AuthContext';
import useHotels from '../../logic/useHotels';
import usePaginatedTable from '../../logic/usePaginatedTable';
import { useNotification } from '../../state/NotificationContext';

const UserList = () => {
  const { user } = useAuth();
  const { hotelNames } = useHotels();
  const { showNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterJabatan, setFilterJabatan] = useState('');
  const [filterLevelAkses, setFilterLevelAkses] = useState('');
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

  // Get unique jabatan (titles) and level akses (roles) from users
  const uniqueJabatan = [...new Set(users.map(usr => {
    if (usr.role === 'admin') return 'Admin Hotel';
    if (usr.role === 'manager') return 'Finance Hotel';
    if (usr.role === 'frontoffice') return 'Operational Front Office';
    if (usr.role === 'housekeeping') return 'Leader Housekeeping';
    return usr.role;
  }))].sort();

  const uniqueLevelAkses = [...new Set(users.map(usr => usr.role))].sort();

  const matchesJabatanLevel = (usr) => {
    const jabatanTitle = usr.role === 'admin' ? 'Admin Hotel' :
                        usr.role === 'manager' ? 'Finance Hotel' :
                        usr.role === 'frontoffice' ? 'Operational Front Office' :
                        usr.role === 'housekeeping' ? 'Leader Housekeeping' :
                        usr.role;

    const matchesJabatan = !filterJabatan || jabatanTitle === filterJabatan;
    const matchesLevel = !filterLevelAkses || usr.role === filterLevelAkses;
    return matchesJabatan && matchesLevel;
  };

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredUsers, currentData: currentUsers,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(users, {
    searchFields: ['username', 'email', 'role'],
    hotelField: (usr, hotel) => usr.hotel_name === hotel || usr.hotel === hotel,
    extraFilter: matchesJabatanLevel
  });

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterJabatan, filterLevelAkses]);

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
      showNotification('success', `User "${formData.username}" added successfully!`);
      
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
        fetchUsers(); // Refresh the list
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to add user';
      setSubmitError(errorMessage);
      showNotification('error', 'Error adding user: ' + errorMessage);
      console.error('Error adding user:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await apiService.deleteUser(userId);
        showNotification('success', `User "${username}" deleted successfully!`);
        fetchUsers();
      } catch (err) {
        showNotification('error', `Error deleting user "${username}"`);
        console.error('Error deleting user:', err);
      }
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
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="MASTER USER"
          actions={(
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-table-action"
              style={{
                background: '#007bff',
                color: 'white',
                padding: '6px 16px',
                marginLeft: '20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ADD
            </button>
          )}
          hotels={hotelNames.map(name => ({ id: name, name }))}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          topRightExtra={(
            <>
              <div className="hotel-select" style={{ marginLeft: '10px' }}>
                <label>Jabatan :</label>
                <select
                  className="header-hotel-select"
                  value={filterJabatan}
                  onChange={(e) => setFilterJabatan(e.target.value)}
                >
                  <option value="">---Semua Jabatan---</option>
                  {uniqueJabatan.map((jabatan, idx) => (
                    <option key={idx} value={jabatan}>{jabatan}</option>
                  ))}
                </select>
              </div>
              <div className="hotel-select" style={{ marginLeft: '10px' }}>
                <label>Level Akses :</label>
                <select
                  className="header-hotel-select"
                  value={filterLevelAkses}
                  onChange={(e) => setFilterLevelAkses(e.target.value)}
                >
                  <option value="">---Semua Level---</option>
                  {uniqueLevelAkses.map((level, idx) => (
                    <option key={idx} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        {/* Error Messages */}
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

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '150px' }} />  {/* Hotel Name */}
              <col style={{ width: '100px' }} />  {/* User Code */}
              <col style={{ width: '150px' }} />  {/* Username */}
              <col style={{ width: '180px' }} />  {/* Name */}
              <col style={{ width: '180px' }} />  {/* Title */}
              <col style={{ width: '150px' }} />  {/* Access */}
              <col style={{ width: '80px' }} />   {/* Blokir */}
              <col style={{ width: '180px' }} />  {/* Last Login */}
              <col style={{ width: '150px' }} />  {/* Account Type */}
              <col style={{ width: '100px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Hotel Name</th>
                <th>User Code</th>
                <th>Username</th>
                <th>Name</th>
                <th>Title</th>
                <th>Acces</th>
                <th>Blokir</th>
                <th>Last Login</th>
                <th>Account Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="11" className="no-data">Loading...</td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentUsers.map((usr, index) => (
                  <tr key={usr.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{usr.hotel_name || '-'}</td>
                    <td>{usr.id}</td>
                    <td title={usr.username}>{usr.username}</td>
                    <td>{usr.full_name || usr.username.toUpperCase()}</td>
                    <td>{usr.title || (usr.role === 'admin' ? 'Admin Hotel' : 
                        usr.role === 'manager' ? 'Finance Hotel' : 
                        usr.role === 'frontoffice' ? 'Operational Front Office' :
                        usr.role === 'housekeeping' ? 'Leader Housekeeping' : 
                        usr.role)}</td>
                    <td>{usr.role}</td>
                    <td>{usr.is_blocked ? 'Y' : 'N'}</td>
                    <td>
                      {usr.last_login ? 
                        new Date(usr.last_login).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false
                        }).replace(/\//g, '-').replace(',', '') : 
                        '0000-00-00 00:00:00'}
                    </td>
                    <td>{usr.account_type || (usr.role === 'admin' || usr.role === 'manager' ? 'Management' : 'Non Management')}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(usr.id, usr.username)}
                        className="btn-table-action"
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          padding: '4px 12px',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredUsers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          extraInfo={searchTerm && ` (filtered from ${users.length} total entries)`}
        />

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
