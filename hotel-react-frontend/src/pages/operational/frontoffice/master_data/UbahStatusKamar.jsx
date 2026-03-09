import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';
import useHotels from '../../../../hooks/useHotels';

const UbahStatusKamar = () => {
  const { user } = useAuth();
  const { hotelNames, defaultHotel, hotels } = useHotels();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [addFormData, setAddFormData] = useState({
    hotel_name: '',
    room_number: '',
    room_type: '',
    floor_number: 1,
    status: 'VR'
  });

  // Master data from database
  const [statusOptions, setStatusOptions] = useState([]);

  // Fetch room types for add modal
  const [roomTypeOptions, setRoomTypeOptions] = useState([]);

  useEffect(() => {
    fetchMasterData();
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, selectedHotel, searchTerm]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel]);

  const fetchMasterData = async () => {
    try {
      // Fetch room statuses from database
      const statusResponse = await apiService.getRoomStatuses();
      setStatusOptions(statusResponse.data || []);

      // Fetch room types
      const roomTypesResponse = await apiService.getRoomTypesLookup();
      setRoomTypeOptions(roomTypesResponse.data || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHotelRooms(0, 1000);
      setRooms(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = rooms;

    // Filter by hotel
    if (selectedHotel !== 'ALL') {
      filtered = filtered.filter(room => room.hotel_name === selectedHotel);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(room => 
        room.room_number?.toLowerCase().includes(search) ||
        room.room_type?.toLowerCase().includes(search) ||
        room.status?.toLowerCase().includes(search) ||
        String(room.floor_number).includes(search)
      );
    }

    setFilteredRooms(filtered);
  };

  // Get status display name
  const getStatusDisplayName = (status) => {
    if (!status) return 'Vacant Ready';
    
    const statusUpper = status.toUpperCase().trim();
    
    // Check if it's a short code
    const found = statusOptions.find(opt => opt.code === statusUpper);
    if (found) return found.name;
    
    // Check if it's already a full name
    const foundByName = statusOptions.find(opt => 
      opt.name.toLowerCase() === status.toLowerCase()
    );
    if (foundByName) return foundByName.name;
    
    return status;
  };

  // Get status code from name or code
  const getStatusCode = (status) => {
    if (!status) return 'VR';
    
    const statusUpper = status.toUpperCase().trim();
    
    // Check if it's already a code
    const found = statusOptions.find(opt => opt.code === statusUpper);
    if (found) return found.code;
    
    // Check if it's a full name
    const foundByName = statusOptions.find(opt => 
      opt.name.toLowerCase() === status.toLowerCase()
    );
    if (foundByName) return foundByName.code;
    
    return statusUpper;
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  // Check if user can edit
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle add click
  const handleAddClick = () => {
    setAddFormData({
      hotel_name: selectedHotel !== 'ALL' ? selectedHotel : defaultHotel,
      room_number: '',
      room_type: '',
      floor_number: 1,
      status: 'VR'
    });
    setShowAddModal(true);
  };

  // Handle add save
  const handleAddSave = async () => {
    if (!addFormData.room_number || !addFormData.room_type) {
      alert('Please fill in Room Number and Room Type');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createHotelRoom({
        hotel_name: addFormData.hotel_name,
        room_number: addFormData.room_number,
        room_type: addFormData.room_type,
        floor_number: parseInt(addFormData.floor_number) || 1,
        status: addFormData.status
      });
      setSuccessMessage(`Room "${addFormData.room_number}" added successfully`);
      setShowAddModal(false);
      await fetchRooms();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding room:', err);
      alert('Failed to add room: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle edit click
  const handleEditClick = (room) => {
    setEditingRoom(room);
    setEditStatus(getStatusCode(room.status));
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editStatus) {
      alert('Please select a status');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateHotelRoom(editingRoom.room_number, {
        status: editStatus
      });
      
      setSuccessMessage(`Room ${editingRoom.room_number} status updated to ${getStatusDisplayName(editStatus)}`);
      setShowEditModal(false);
      setEditingRoom(null);
      await fetchRooms();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (room) => {
    if (!window.confirm(`Are you sure you want to delete room "${room.room_number}"?`)) return;
    try {
      await apiService.deleteHotelRoom(room.room_number);
      setSuccessMessage(`Room "${room.room_number}" deleted successfully`);
      await fetchRooms();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting room:', err);
      alert('Failed to delete room: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingRoom(null);
    setEditStatus('');
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>UBAH STATUS KAMAR</span>
              </div>
              {canEdit() && (
                <button
                  onClick={handleAddClick}
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
            </div>
            <div className="unified-header-right">
              <div className="hotel-select">
                <label>Filter :</label>
                <select 
                  className="header-hotel-select"
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                >
                  <option value="ALL">ALL HOTELS</option>
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                  ))}
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

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '50px' }} />   {/* No */}
              <col style={{ width: '180px' }} />  {/* NAMA HOTEL */}
              <col style={{ width: '80px' }} />   {/* Type */}
              <col style={{ width: '80px' }} />   {/* Room No */}
              <col style={{ width: '60px' }} />   {/* Floor */}
              <col style={{ width: '50px' }} />   {/* VIP */}
              <col style={{ width: '80px' }} />   {/* Smoking */}
              <col style={{ width: '150px' }} />  {/* Status */}
              <col style={{ width: '50px' }} />   {/* Hit */}
              <col style={{ width: '80px' }} />   {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>NAMA HOTEL</th>
                <th>Type</th>
                <th>Room No</th>
                <th>Floor</th>
                <th>VIP</th>
                <th>Smoking</th>
                <th>Status</th>
                <th>Hit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="no-data">Loading...</td>
                </tr>
              ) : currentRooms.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentRooms.map((room, index) => (
                  <tr key={room.id}>
                    <td style={{ textAlign: 'center' }}>{startIndex + index + 1}</td>
                    <td>{room.hotel_name || '-'}</td>
                    <td>{room.room_type}</td>
                    <td>{room.room_number}</td>
                    <td style={{ textAlign: 'center' }}>{room.floor_number}</td>
                    <td style={{ textAlign: 'center' }}>{room.is_vip ? 'Yes' : ''}</td>
                    <td style={{ textAlign: 'center' }}>{room.is_smoking ? 'Yes' : 'No'}</td>
                    <td>{getStatusDisplayName(room.status)}</td>
                    <td style={{ textAlign: 'center' }}>{room.hit_count || 0}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditClick(room)}
                          className="btn-table-action"
                          style={{ background: '#ffc107', color: '#212529', padding: '4px 10px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        {canEdit() && (
                          <button
                            onClick={() => handleDelete(room)}
                            className="btn-table-action"
                            style={{ background: '#dc3545', color: 'white', padding: '4px 10px', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
            Showing {filteredRooms.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} entries
            {searchTerm && ` (filtered from ${rooms.length} total entries)`}
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
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'active' : ''}
                  style={currentPage === pageNum ? {
                    background: '#17a2b8',
                    color: 'white',
                    borderColor: '#17a2b8'
                  } : {}}
                >
                  {pageNum}
                </button>
              );
            })}
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

        {/* Edit Modal */}
        {showEditModal && editingRoom && (
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
              maxWidth: '450px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Room Status - {editingRoom.room_number}</h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Hotel
                </label>
                <input
                  type="text"
                  value={editingRoom.hotel_name || defaultHotel}
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Room Type
                </label>
                <input
                  type="text"
                  value={editingRoom.room_type}
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Room Number
                </label>
                <input
                  type="text"
                  value={editingRoom.room_number}
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Floor
                </label>
                <input
                  type="text"
                  value={editingRoom.floor_number}
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    color: '#666'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Status <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">-- Select Status --</option>
                  {statusOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={processing}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: processing ? '#6c757d' : '#28a745',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {processing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
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
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Room</h2>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Hotel</label>
                <select
                  value={addFormData.hotel_name}
                  onChange={(e) => setAddFormData({...addFormData, hotel_name: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Room Number <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  value={addFormData.room_number}
                  onChange={(e) => setAddFormData({...addFormData, room_number: e.target.value})}
                  placeholder="e.g., 101"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                  Room Type <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  value={addFormData.room_type}
                  onChange={(e) => setAddFormData({...addFormData, room_type: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Room Type</option>
                  {roomTypeOptions.map(rt => (
                    <option key={rt} value={rt}>{rt}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Floor</label>
                <input
                  type="number"
                  value={addFormData.floor_number}
                  onChange={(e) => setAddFormData({...addFormData, floor_number: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Initial Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({...addFormData, status: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                  type="button"
                  onClick={handleAddSave}
                  disabled={processing}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: processing ? '#6c757d' : '#007bff',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {processing ? 'Saving...' : 'Add Room'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UbahStatusKamar;
