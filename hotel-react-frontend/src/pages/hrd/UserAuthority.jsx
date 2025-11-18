import { useState } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';

const UserAuthority = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Define authority levels based on roles
  const authorityLevels = [
    { id: 1, level: 'RECEPTION RESTO HK' },
    { id: 10, level: 'Pembangunan Staff' },
    { id: 11, level: 'Leader Housekeeping' },
    { id: 12, level: 'Laporan Night Audit' },
    { id: 13, level: 'RECEPTION RESTO' },
    { id: 14, level: 'Rekap Bil Kamar Pajak' },
    { id: 15, level: 'Storekeeper' },
    { id: 16, level: 'RECEPTION' },
    { id: 17, level: 'Pajak' },
    { id: 18, level: 'AdminCctv' }
  ];

  const filteredLevels = authorityLevels.filter(lvl =>
    lvl.level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLevels.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentLevels = filteredLevels.slice(startIndex, endIndex);

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
                <span>LEVEL AKSES</span>
              </div>
            </div>
            <div className="unified-header-right">
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

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '100px' }} />  {/* No */}
              <col style={{ width: 'auto' }} />   {/* Level */}
              <col style={{ width: '150px' }} />  {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Level</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentLevels.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentLevels.map((level, index) => (
                  <tr key={level.id}>
                    <td>{level.id}</td>
                    <td style={{ color: '#007bff', cursor: 'pointer' }}>
                      {level.level}
                    </td>
                    <td>
                      {/* Action buttons can be added here if needed */}
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
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLevels.length)} of {filteredLevels.length} entries
            {searchTerm && ` (filtered from ${authorityLevels.length} total entries)`}
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
