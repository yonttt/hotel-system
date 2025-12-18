import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const MasterMeja = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [hotels, setHotels] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hotel_id: 1,
    hotel_name: 'HOTEL NEW IDOLA',
    no_meja: '',
    lantai: 1,
    kursi: 4,
    status: 'Tersedia',
    description: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTables();
    fetchHotels();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMasterMeja();
      setTables(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tables: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await apiService.getMasterMejaHotels();
      setHotels(response.data || []);
    } catch (err) {
      console.error('Error fetching hotels:', err);
    }
  };

  // Filter data based on search and hotel
  const filteredTables = tables.filter(table => {
    const matchesSearch = 
      table.no_meja?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = selectedHotel === 'ALL' || table.hotel_name === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentTables = filteredTables.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTables.length / showEntries);

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle add new table
  const handleAddClick = () => {
    setFormData({
      hotel_id: 1,
      hotel_name: 'HOTEL NEW IDOLA',
      no_meja: '',
      lantai: 1,
      kursi: 4,
      status: 'Tersedia',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = async () => {
    if (!formData.no_meja) {
      alert('No Meja is required');
      return;
    }
    setProcessing(true);
    try {
      await apiService.createMasterMeja(formData);
      setSuccessMessage('Table added successfully!');
      setShowAddModal(false);
      fetchTables();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to add table: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle edit
  const handleEditClick = (table) => {
    if (!canEdit()) return;
    setEditingItem(table);
    setFormData({
      hotel_id: table.hotel_id || 1,
      hotel_name: table.hotel_name || 'HOTEL NEW IDOLA',
      no_meja: table.no_meja || '',
      lantai: table.lantai || 1,
      kursi: table.kursi || 4,
      status: table.status || 'Tersedia',
      description: table.description || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!formData.no_meja) {
      alert('No Meja is required');
      return;
    }
    setProcessing(true);
    try {
      await apiService.updateMasterMeja(editingItem.id, formData);
      setSuccessMessage('Table updated successfully!');
      setShowEditModal(false);
      setEditingItem(null);
      fetchTables();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (table) => {
    if (!canEdit()) return;
    if (!confirm(`Are you sure you want to delete table ${table.no_meja}?`)) return;
    
    try {
      await apiService.deleteMasterMeja(table.id);
      setSuccessMessage('Table deleted successfully!');
      fetchTables();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'tersedia': return 'status-available';
      case 'terpakai': return 'status-occupied';
      case 'reserved': return 'status-reserved';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              {canEdit() && (
                <button 
                  onClick={handleAddClick}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  New Table
                </button>
              )}
              <div className="hotel-select" style={{ marginLeft: '15px' }}>
                <label>Filter :</label>
                <select 
                  className="header-hotel-select"
                  value={selectedHotel}
                  onChange={(e) => {
                    setSelectedHotel(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="ALL">ALL</option>
                  {hotels.map(hotel => (
                    <option key={hotel.hotel_id} value={hotel.hotel_name}>
                      {hotel.hotel_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search:</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="unified-header-right">
              <div className="entries-control">
                <span className="entries-label">Show entries:</span>
                <select
                  className="entries-select"
                  value={showEntries}
                  onChange={(e) => {
                    setShowEntries(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
              <col style={{ width: '60px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '120px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>No meja</th>
                <th>Lantai</th>
                <th>Kursi</th>
                <th>Status</th>
                <th>Hit</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="no-data">{error}</td>
                </tr>
              ) : currentTables.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No data available in table</td>
                </tr>
              ) : (
                currentTables.map((table, index) => (
                  <tr key={table.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td style={{ fontWeight: '500', color: '#1976D2' }}>{table.no_meja}</td>
                    <td style={{ color: '#1976D2' }}>{table.lantai}</td>
                    <td style={{ color: '#1976D2' }}>{table.kursi}</td>
                    <td>
                      <span className={getStatusClass(table.status)}>
                        {table.status}
                      </span>
                    </td>
                    <td style={{ color: '#1976D2' }}>{table.hit}</td>
                    <td>
                      {canEdit() && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            className="btn-table-action" 
                            onClick={() => handleEditClick(table)}
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-table-action" 
                            onClick={() => handleDelete(table)}
                            title="Delete"
                            style={{ backgroundColor: '#f44336', color: 'white' }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="unified-footer">
          <div className="entries-info">
            {`Showing ${filteredTables.length > 0 ? indexOfFirstItem + 1 : 0} to ${Math.min(indexOfLastItem, filteredTables.length)} of ${filteredTables.length} entries`}
          </div>
          <div className="pagination">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
            
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '4px',
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {successMessage}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            width: '450px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Add New Table
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel</label>
              <input
                type="text"
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>No Meja *</label>
              <input
                type="text"
                value={formData.no_meja}
                onChange={(e) => setFormData({...formData, no_meja: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="e.g., 01, 02, 03..."
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lantai</label>
                <input
                  type="number"
                  value={formData.lantai}
                  onChange={(e) => setFormData({...formData, lantai: parseInt(e.target.value) || 1})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  min="1"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kursi</label>
                <input
                  type="number"
                  value={formData.kursi}
                  onChange={(e) => setFormData({...formData, kursi: parseInt(e.target.value) || 1})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  min="1"
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Terpakai">Terpakai</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                disabled={processing}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Saving...' : 'Add Table'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            width: '450px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Table: {editingItem.no_meja}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel</label>
              <input
                type="text"
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>No Meja *</label>
              <input
                type="text"
                value={formData.no_meja}
                onChange={(e) => setFormData({...formData, no_meja: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Lantai</label>
                <input
                  type="number"
                  value={formData.lantai}
                  onChange={(e) => setFormData({...formData, lantai: parseInt(e.target.value) || 1})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  min="1"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kursi</label>
                <input
                  type="number"
                  value={formData.kursi}
                  onChange={(e) => setFormData({...formData, kursi: parseInt(e.target.value) || 1})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  min="1"
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Terpakai">Terpakai</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <button
                onClick={handleCloseModal}
                style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f5f5f5', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={processing}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MasterMeja;
