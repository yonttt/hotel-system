import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const MasterRoomType = () => {
  const { user } = useAuth();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [successMessage, setSuccessMessage] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category_code: '',
    category_name: '',
    normal_rate: 0,
    weekend_rate: 0,
    description: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoomCategories();
      console.log('Room Categories Response:', response.data);
      setRoomTypes(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch room types: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching room types:', err);
      console.error('Error details:', err.response);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = roomTypes.filter(item => {
    const matchesSearch = 
      item.category_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Note: room_categories table doesn't have hotel_name, so we show all for now
    // If you need hotel filtering, the table needs to be updated
    const matchesHotel = selectedHotel === 'ALL' || true;
    
    return matchesSearch && matchesHotel;
  });

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / showEntries);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle edit click
  const handleEditClick = (item) => {
    if (!canEdit()) return;
    setEditingItem(item);
    setEditFormData({
      category_code: item.category_code || '',
      category_name: item.category_name || '',
      normal_rate: item.normal_rate || 0,
      weekend_rate: item.weekend_rate || 0,
      description: item.description || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.category_code || !editFormData.category_name) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateRoomCategory(editingItem.id, {
        ...editFormData,
        normal_rate: parseFloat(editFormData.normal_rate) || 0,
        weekend_rate: parseFloat(editFormData.weekend_rate) || 0
      });
      
      setSuccessMessage(`Room type "${editFormData.category_name}" updated successfully`);
      setShowEditModal(false);
      setEditingItem(null);
      await fetchRoomTypes();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating room type:', err);
      alert('Failed to update room type: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditFormData({
      category_code: '',
      category_name: '',
      normal_rate: 0,
      weekend_rate: 0,
      description: ''
    });
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
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

      {/* Header Controls */}
      <div className="unified-header-controls">
        {/* Top Row - Title and Hotel Filter */}
        <div className="header-row header-row-top">
          <div className="unified-header-left">
            <h2 className="header-title">MASTER ROOM TYPE</h2>
          </div>
          <div className="unified-header-right">
            <div className="hotel-select">
              <label>Filter Hotel:</label>
              <select 
                className="header-hotel-select"
                value={selectedHotel}
                onChange={(e) => {
                  setSelectedHotel(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">ALL</option>
                <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
                <option value="HOTEL IDOLA">HOTEL IDOLA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row - Search and Entries */}
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

      {/* Table */}
      <div className="unified-table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Code</th>
              <th>Type</th>
              <th className="align-right">Normal Rate</th>
              <th className="align-right">Weekend Rate</th>
              <th className="align-right">6 Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-spinner">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="error-message">{error}</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No data available in table</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.category_code || '-'}</td>
                  <td>{item.category_name || '-'}</td>
                  <td className="align-right">{formatCurrency(item.normal_rate || 0)}</td>
                  <td className="align-right">{formatCurrency(item.weekend_rate || 0)}</td>
                  <td className="align-right">-</td>
                  <td>
                    {canEdit() && (
                      <button 
                        className="btn-table-action"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
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
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Room Type
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Code <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={editFormData.category_code}
                onChange={(e) => setEditFormData({...editFormData, category_code: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={editFormData.category_name}
                onChange={(e) => setEditFormData({...editFormData, category_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Normal Rate</label>
                <input
                  type="number"
                  value={editFormData.normal_rate}
                  onChange={(e) => setEditFormData({...editFormData, normal_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weekend Rate</label>
                <input
                  type="number"
                  value={editFormData.weekend_rate}
                  onChange={(e) => setEditFormData({...editFormData, weekend_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
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
      )}    </Layout>
  );
};

export default MasterRoomType;