import { useState, useEffect } from 'react';
import { apiService } from '../../api/api';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import DataTable from '../../ui/DataTable';
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
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
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
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>+ Add User</Button>
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
          <div className="alert alert--error">{error}</div>
        )}

        {/* Table Section */}
        <DataTable
          data={currentUsers}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(usr) => usr.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_u, i) => startIndex + i + 1 },
            { key: 'hotel', header: 'Hotel Name', render: (u) => u.hotel_name || '-' },
            { key: 'code', header: 'User Code', render: (u) => u.id },
            { key: 'username', header: 'Username', render: (u) => u.username },
            { key: 'name', header: 'Name', render: (u) => u.full_name || u.username.toUpperCase() },
            { key: 'title', header: 'Title',
              render: (u) => u.title || (u.role === 'admin' ? 'Admin Hotel' :
                u.role === 'manager' ? 'Finance Hotel' :
                u.role === 'frontoffice' ? 'Operational Front Office' :
                u.role === 'housekeeping' ? 'Leader Housekeeping' : u.role) },
            { key: 'access', header: 'Acces', render: (u) => u.role },
            { key: 'blokir', header: 'Blokir', align: 'center', render: (u) => u.is_blocked ? 'Y' : 'N' },
            { key: 'last_login', header: 'Last Login',
              render: (u) => u.last_login
                ? new Date(u.last_login).toLocaleString('en-GB', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                  }).replace(/\//g, '-').replace(',', '')
                : '0000-00-00 00:00:00' },
            { key: 'account_type', header: 'Account Type',
              render: (u) => u.account_type || (u.role === 'admin' || u.role === 'manager' ? 'Management' : 'Non Management') },
            { key: 'action', header: 'Action', align: 'center', width: '100px',
              render: (u) => <Button variant="danger" size="sm" onClick={() => handleDeleteUser(u.id, u.username)}>Delete</Button> }
          ]}
        />

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
          <div className="app-modal-overlay">
            <div className="app-modal-card" style={{ maxWidth: '500px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New User</h2>

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

export default UserList;
