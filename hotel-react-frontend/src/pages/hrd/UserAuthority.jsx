import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const UserAuthority = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolePermissions, setRolePermissions] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define roles from the system
  const systemRoles = [
    { id: 1, role: 'admin', label: 'Admin' },
    { id: 2, role: 'manager', label: 'Manager' },
    { id: 3, role: 'frontoffice', label: 'Front Office' },
    { id: 4, role: 'housekeeping', label: 'Housekeeping' },
    { id: 5, role: 'staff', label: 'Staff' }
  ];

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserPermissions();
      const permissions = {};
      response.data.forEach(perm => {
        permissions[perm.role] = {
          canView: perm.can_view,
          canCreate: perm.can_create,
          canEdit: perm.can_edit,
          canDelete: perm.can_delete
        };
      });
      setRolePermissions(permissions);
      setError(null);
    } catch (err) {
      setError('Failed to fetch permissions: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching permissions:', err);
      
      // Fallback to default permissions if fetch fails
      const defaultPerms = {};
      systemRoles.forEach(r => {
        defaultPerms[r.role] = {
          canView: true,
          canCreate: r.role !== 'staff',
          canEdit: r.role !== 'staff',
          canDelete: r.role === 'admin' || r.role === 'manager'
        };
      });
      setRolePermissions(defaultPerms);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (role, permission) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role]?.[permission]
      }
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Update permissions for each role
      const updatePromises = Object.entries(rolePermissions).map(([role, perms]) => 
        apiService.updateUserPermission(role, {
          can_view: perms.canView,
          can_create: perms.canCreate,
          can_edit: perms.canEdit,
          can_delete: perms.canDelete
        })
      );
      
      await Promise.all(updatePromises);
      
      setSuccessMessage('Permissions berhasil disimpan!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save permissions: ' + (err.response?.data?.detail || err.message));
      console.error('Error saving permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = systemRoles.filter(r =>
    r.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

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
              <button
                onClick={handleSavePermissions}
                className="btn-table-action"
                style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '6px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Save Changes
              </button>
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
              <col style={{ width: '60px' }} />   {/* No */}
              <col style={{ width: '200px' }} />  {/* Role */}
              <col style={{ width: '100px' }} />  {/* View */}
              <col style={{ width: '100px' }} />  {/* Create */}
              <col style={{ width: '100px' }} />  {/* Edit */}
              <col style={{ width: '100px' }} />  {/* Delete */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Level</th>
                <th style={{ textAlign: 'center' }}>View</th>
                <th style={{ textAlign: 'center' }}>Create</th>
                <th style={{ textAlign: 'center' }}>Edit</th>
                <th style={{ textAlign: 'center' }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentRoles.map((roleItem, index) => (
                  <tr key={roleItem.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{roleItem.label}</td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={rolePermissions[roleItem.role]?.canView || false}
                        onChange={() => handlePermissionChange(roleItem.role, 'canView')}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          margin: '0'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={rolePermissions[roleItem.role]?.canCreate || false}
                        onChange={() => handlePermissionChange(roleItem.role, 'canCreate')}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          margin: '0'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={rolePermissions[roleItem.role]?.canEdit || false}
                        onChange={() => handlePermissionChange(roleItem.role, 'canEdit')}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          margin: '0'
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={rolePermissions[roleItem.role]?.canDelete || false}
                        onChange={() => handlePermissionChange(roleItem.role, 'canDelete')}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          verticalAlign: 'middle',
                          margin: '0'
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
        <div className="unified-footer">
          <div className="entries-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredRoles.length)} of {filteredRoles.length} entries
            {searchTerm && ` (filtered from ${systemRoles.length} total entries)`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAuthority;
