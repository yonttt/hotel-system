import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const UserAuthority = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPermissions, setUserPermissions] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchUsers();
    }
  }, [user]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      const allUsers = response.data || [];
      setUsers(allUsers);
      
      // Load saved permissions from localStorage
      const savedPermissions = localStorage.getItem('userPermissions');
      if (savedPermissions) {
        setUserPermissions(JSON.parse(savedPermissions));
      } else {
        // Initialize default permissions for all users
        const defaultPerms = {};
        allUsers.forEach(usr => {
          defaultPerms[usr.id] = {
            canView: true,
            canCreate: usr.role !== 'staff',
            canEdit: usr.role !== 'staff',
            canDelete: usr.role === 'admin' || usr.role === 'manager'
          };
        });
        setUserPermissions(defaultPerms);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (userId, permission) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permission]: !prev[userId]?.[permission]
      }
    }));
  };

  const handleSavePermissions = () => {
    localStorage.setItem('userPermissions', JSON.stringify(userPermissions));
    setSuccessMessage('Permissions berhasil disimpan!');
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleResetPermissions = () => {
    const defaultPerms = {};
    users.forEach(usr => {
      defaultPerms[usr.id] = {
        canView: true,
        canCreate: usr.role !== 'staff',
        canEdit: usr.role !== 'staff',
        canDelete: usr.role === 'admin' || usr.role === 'manager'
      };
    });
    setUserPermissions(defaultPerms);
    localStorage.setItem('userPermissions', JSON.stringify(defaultPerms));
    setSuccessMessage('Permissions berhasil direset ke default!');
    
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const filteredUsers = users.filter(usr =>
    usr.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
      case 'staff':
        return '#6c757d'; // gray
      default:
        return '#6c757d';
    }
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
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>OTORITAS PENGGUNA</span>
              </div>
            </div>
            <div className="unified-header-right">
              <div className="hotel-select">
                <label>Hotel :</label>
                <select className="header-hotel-select">
                  <option>ALL</option>
                </select>
              </div>
            </div>
          </div>
          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search :</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="unified-header-right">
              <button
                onClick={handleResetPermissions}
                className="btn-table-action"
                style={{
                  background: '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  marginRight: '10px'
                }}
              >
                Reset to Default
              </button>
              <button
                onClick={handleSavePermissions}
                className="btn-table-action"
                style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  marginRight: '10px'
                }}
              >
                Save Changes
              </button>
              <div className="entries-control">
                <span className="entries-label">Show entries:</span>
                <select
                  className="entries-select"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

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

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '80px' }} />   {/* ID */}
              <col style={{ width: '180px' }} />  {/* Username */}
              <col style={{ width: '220px' }} />  {/* Email */}
              <col style={{ width: '130px' }} />  {/* Role */}
              <col style={{ width: '120px' }} />  {/* View */}
              <col style={{ width: '120px' }} />  {/* Create */}
              <col style={{ width: '120px' }} />  {/* Edit */}
              <col style={{ width: '120px' }} />  {/* Delete */}
            </colgroup>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>View</th>
                <th>Create</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="no-data">Loading...</td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentUsers.map((usr, index) => (
                  <tr key={usr.id}>
                    <td>{startIndex + index + 1}</td>
                    <td title={usr.username} style={{ fontWeight: '500' }}>{usr.username}</td>
                    <td title={usr.email || 'N/A'}>{usr.email || 'N/A'}</td>
                    <td>
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
                    <td className="align-center">
                      <input
                        type="checkbox"
                        checked={userPermissions[usr.id]?.canView || false}
                        onChange={() => handlePermissionChange(usr.id, 'canView')}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td className="align-center">
                      <input
                        type="checkbox"
                        checked={userPermissions[usr.id]?.canCreate || false}
                        onChange={() => handlePermissionChange(usr.id, 'canCreate')}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td className="align-center">
                      <input
                        type="checkbox"
                        checked={userPermissions[usr.id]?.canEdit || false}
                        onChange={() => handlePermissionChange(usr.id, 'canEdit')}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                    <td className="align-center">
                      <input
                        type="checkbox"
                        checked={userPermissions[usr.id]?.canDelete || false}
                        onChange={() => handlePermissionChange(usr.id, 'canDelete')}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer'
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="unified-pagination">
          <div className="unified-pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
            {searchTerm && ` (filtered from ${users.length} total entries)`}
          </div>
          <div className="unified-pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          marginTop: '20px',
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
                  <strong>View:</strong> Dapat melihat/membaca data
                </li>
                <li>
                  <strong>Create:</strong> Dapat membuat entry baru
                </li>
                <li>
                  <strong>Edit:</strong> Dapat mengubah data yang ada
                </li>
                <li>
                  <strong>Delete:</strong> Dapat menghapus data
                </li>
              </ul>
              <p style={{ 
                margin: '12px 0 0 0', 
                fontSize: '13px', 
                fontStyle: 'italic'
              }}>
                <strong>⚠️ Catatan:</strong> Centang checkbox untuk memberikan permission kepada user tertentu
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAuthority;
