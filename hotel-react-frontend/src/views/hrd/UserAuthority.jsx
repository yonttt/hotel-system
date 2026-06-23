import { useState, useEffect } from 'react';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import DataTable from '../../ui/DataTable';
import UnifiedTableFooter from '../../ui/UnifiedTableFooter';
import { useAuth } from '../../state/AuthContext';
import { apiService } from '../../api/api';

const ModernSwitch = ({ checked, onChange }) => (
  <label style={{
    position: 'relative',
    display: 'inline-block',
    width: '44px',
    height: '22px',
    margin: '0 auto',
    cursor: 'pointer'
  }}>
    <input 
      type="checkbox" 
      checked={checked} 
      onChange={onChange} 
      style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} 
    />
    <span style={{
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: checked ? '#10b981' : '#e5e7eb',
      transition: '0.3s',
      borderRadius: '22px',
      border: checked ? '1px solid #10b981' : '1px solid #d1d5db',
    }}></span>
    <span style={{
      position: 'absolute',
      height: '16px',
      width: '16px',
      left: checked ? '23px' : '2px',
      bottom: '2px',
      backgroundColor: 'white',
      transition: '0.3s',
      borderRadius: '50%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      pointerEvents: 'none'
    }}></span>
  </label>
);

const UserAuthority = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolePermissions, setRolePermissions] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>OTORITAS PENGGUNA</span>
              </div>
            </div>
            <div className="unified-header-right">
              <Button variant="success" size="sm" onClick={handleSavePermissions}>Save Changes</Button>
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
          <div className="alert alert--success">{successMessage}</div>
        )}

        {/* Table Section */}
        <DataTable
          data={currentRoles}
          emptyText="No data available in table"
          rowKey={(roleItem) => roleItem.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '60px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'level', header: 'Level', render: (r) => r.label },
            { key: 'view', header: 'View', align: 'center',
              render: (r) => <ModernSwitch checked={rolePermissions[r.role]?.canView || false} onChange={() => handlePermissionChange(r.role, 'canView')} /> },
            { key: 'create', header: 'Create', align: 'center',
              render: (r) => <ModernSwitch checked={rolePermissions[r.role]?.canCreate || false} onChange={() => handlePermissionChange(r.role, 'canCreate')} /> },
            { key: 'edit', header: 'Edit', align: 'center',
              render: (r) => <ModernSwitch checked={rolePermissions[r.role]?.canEdit || false} onChange={() => handlePermissionChange(r.role, 'canEdit')} /> },
            { key: 'delete', header: 'Delete', align: 'center',
              render: (r) => <ModernSwitch checked={rolePermissions[r.role]?.canDelete || false} onChange={() => handlePermissionChange(r.role, 'canDelete')} /> }
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRoles.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          extraInfo={searchTerm && ` (filtered from ${systemRoles.length} total entries)`}
        />
      </div>
    </Layout>
  );
};

export default UserAuthority;
