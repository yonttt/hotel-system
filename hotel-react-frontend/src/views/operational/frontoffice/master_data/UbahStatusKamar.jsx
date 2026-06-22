import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../../state/AuthContext';
import useHotels from '../../../../logic/useHotels';
import usePaginatedTable from '../../../../logic/usePaginatedTable';
import { useNotification } from '../../../../state/NotificationContext';

const UbahStatusKamar = () => {
  const { user } = useAuth();
  const { defaultHotel, hotels } = useHotels();
  const { showNotification } = useNotification();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [processing, setProcessing] = useState(false);
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

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredRooms, currentData: currentRooms,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(rooms, {
    searchFields: ['room_number', 'room_type', 'status', 'floor_number']
  });

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
      showNotification('error', 'Please fill in Room Number and Room Type');
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
      showNotification('success', `Room "${addFormData.room_number}" added successfully`);
      setShowAddModal(false);
      await fetchRooms();
    } catch (err) {
      console.error('Error adding room:', err);
      showNotification('error', 'Failed to add room: ' + (err.response?.data?.detail || err.message));
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
      showNotification('error', 'Please select a status');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateHotelRoom(editingRoom.room_number, {
        status: editStatus
      });
      
      showNotification('success', `Room ${editingRoom.room_number} status updated to ${getStatusDisplayName(editStatus)}`);
      setShowEditModal(false);
      setEditingRoom(null);
      await fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
      showNotification('error', 'Failed to update room status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (room) => {
    if (!window.confirm(`Are you sure you want to delete room "${room.room_number}"?`)) return;
    try {
      await apiService.deleteHotelRoom(room.room_number);
      showNotification('success', `Room "${room.room_number}" deleted successfully`);
      await fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
      showNotification('error', 'Failed to delete room: ' + (err.response?.data?.detail || err.message));
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
        <UnifiedTableHeader
          title="UBAH STATUS KAMAR"
          actions={canEdit() && (
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
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
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

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRooms.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPageNumbers
          pageWindowSize={5}
          extraInfo={searchTerm && ` (filtered from ${rooms.length} total entries)`}
        />

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
