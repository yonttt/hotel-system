import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const ManagementRoom = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
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
    hotel_name: '',
    room_type: '',
    floor_number: '',
    vip_status: '',
    smoking_allowed: '',
    tax_status: ''
  });
  const [processing, setProcessing] = useState(false);

  // Room type options
  const roomTypeOptions = ['STD', 'SPR', 'DLX', 'EXE', 'BIS', 'APT'];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHotelRooms(0, 1000);
      setRooms(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = rooms.filter(item => {
    const matchesSearch = 
      item.room_number?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = selectedHotel === 'ALL' || item.hotel_name === selectedHotel;
    
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

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle edit click
  const handleEditClick = (item) => {
    if (!canEdit()) return;
    setEditingItem(item);
    setEditFormData({
      hotel_name: item.hotel_name || 'HOTEL NEW IDOLA',
      room_type: item.room_type || '',
      floor_number: item.floor_number || item.floor || '',
      vip_status: item.vip_status || (item.is_vip ? 'YES' : 'NO'),
      smoking_allowed: item.smoking_allowed || (item.smoking_allowed ? 'Yes' : 'No'),
      tax_status: item.tax_status || 'TIDAK'
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editFormData.room_type) {
      alert('Please select a room type');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateHotelRoom(editingItem.room_number, {
        hotel_name: editFormData.hotel_name,
        room_type: editFormData.room_type,
        floor_number: parseInt(editFormData.floor_number) || editingItem.floor_number,
        vip_status: editFormData.vip_status,
        smoking_allowed: editFormData.smoking_allowed,
        tax_status: editFormData.tax_status
      });
      
      setSuccessMessage(`Room "${editingItem.room_number}" updated successfully`);
      setShowEditModal(false);
      setEditingItem(null);
      await fetchRooms();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
    setEditFormData({
      hotel_name: '',
      room_type: '',
      floor_number: '',
      vip_status: '',
      smoking_allowed: '',
      tax_status: ''
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
            <h2 className="header-title">MANAGEMENT ROOM</h2>
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
              <th>NAMA HOTEL</th>
              <th>Type</th>
              <th>Room No</th>
              <th>Floor</th>
              <th>VIP</th>
              <th>Smoking</th>
              <th>Status Pajak</th>
              <th>Hit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="loading-spinner">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="error-message">{error}</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No data available in table</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.hotel_name || '-'}</td>
                  <td>{item.room_type || '-'}</td>
                  <td>{item.room_number || '-'}</td>
                  <td>{item.floor || '-'}</td>
                  <td>{item.is_vip ? 'YES' : 'NO'}</td>
                  <td>{item.smoking_allowed ? 'Yes' : 'No'}</td>
                  <td>{item.tax_status || 'TIDAK'}</td>
                  <td>{item.hit_count || 0}</td>
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
              Edit Room: {editingItem?.room_number}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel</label>
              <select
                value={editFormData.hotel_name}
                onChange={(e) => setEditFormData({...editFormData, hotel_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
                <option value="HOTEL IDOLA">HOTEL IDOLA</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Type <span style={{color: 'red'}}>*</span></label>
              <select
                value={editFormData.room_type}
                onChange={(e) => setEditFormData({...editFormData, room_type: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Room Type</option>
                {roomTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Floor</label>
              <input
                type="number"
                value={editFormData.floor_number}
                onChange={(e) => setEditFormData({...editFormData, floor_number: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>VIP Status</label>
                <select
                  value={editFormData.vip_status}
                  onChange={(e) => setEditFormData({...editFormData, vip_status: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="NO">NO</option>
                  <option value="YES">YES</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Smoking</label>
                <select
                  value={editFormData.smoking_allowed}
                  onChange={(e) => setEditFormData({...editFormData, smoking_allowed: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status Pajak</label>
              <select
                value={editFormData.tax_status}
                onChange={(e) => setEditFormData({...editFormData, tax_status: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="TIDAK">TIDAK</option>
                <option value="YA">YA</option>
              </select>
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

export default ManagementRoom;