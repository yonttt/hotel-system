import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import Button from '../../../../ui/Button';
import DataTable from '../../../../ui/DataTable';
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
            <Button variant="primary" size="sm" onClick={handleAddClick}>+ Add Room</Button>
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
          <div className="alert alert--error">{error}</div>
        )}

        {/* Table Section */}
        <DataTable
          data={currentRooms}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(room) => room.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '50px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'hotel', header: 'Nama Hotel', render: (r) => r.hotel_name || '-' },
            { key: 'type', header: 'Type', render: (r) => r.room_type },
            { key: 'room_no', header: 'Room No', render: (r) => r.room_number },
            { key: 'floor', header: 'Floor', align: 'center', render: (r) => r.floor_number },
            { key: 'vip', header: 'VIP', align: 'center', render: (r) => r.is_vip ? 'Yes' : '' },
            { key: 'smoking', header: 'Smoking', align: 'center', render: (r) => r.is_smoking ? 'Yes' : 'No' },
            { key: 'status', header: 'Status', render: (r) => getStatusDisplayName(r.status) },
            { key: 'hit', header: 'Hit', align: 'center', render: (r) => r.hit_count || 0 },
            { key: 'action', header: 'Action', align: 'center', width: '160px',
              render: (r) => (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>
                  {canEdit() && <Button variant="danger" size="sm" onClick={() => handleDelete(r)}>Delete</Button>}
                </div>
              ) }
          ]}
        />

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
          <div className="app-modal-overlay">
            <div className="app-modal-card" style={{ maxWidth: '450px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Room Status - {editingRoom.room_number}</h2>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Hotel
                </label>
                <input
                  type="text"
                  value={editingRoom.hotel_name || defaultHotel}
                  disabled
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Room Type
                </label>
                <input
                  type="text"
                  value={editingRoom.room_type}
                  disabled
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Room Number
                </label>
                <input
                  type="text"
                  value={editingRoom.room_number}
                  disabled
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Floor
                </label>
                <input
                  type="text"
                  value={editingRoom.floor_number}
                  disabled
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="field-label">
                  Status <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="form-input"
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
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button type="button" variant="success" onClick={handleSaveEdit} disabled={processing}>
                  {processing ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="app-modal-overlay">
            <div className="app-modal-card" style={{ maxWidth: '500px' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Room</h2>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">Hotel</label>
                <select
                  value={addFormData.hotel_name}
                  onChange={(e) => setAddFormData({...addFormData, hotel_name: e.target.value})}
                  className="form-input"
                >
                  {hotels.map(hotel => (
                    <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Room Number <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  value={addFormData.room_number}
                  onChange={(e) => setAddFormData({...addFormData, room_number: e.target.value})}
                  placeholder="e.g., 101"
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">
                  Room Type <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  value={addFormData.room_type}
                  onChange={(e) => setAddFormData({...addFormData, room_type: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select Room Type</option>
                  {roomTypeOptions.map(rt => (
                    <option key={rt} value={rt}>{rt}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">Floor</label>
                <input
                  type="number"
                  value={addFormData.floor_number}
                  onChange={(e) => setAddFormData({...addFormData, floor_number: e.target.value})}
                  className="form-input"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="field-label">Initial Status</label>
                <select
                  value={addFormData.status}
                  onChange={(e) => setAddFormData({...addFormData, status: e.target.value})}
                  className="form-input"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.code} value={opt.code}>{opt.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                <Button type="button" variant="primary" onClick={handleAddSave} disabled={processing}>
                  {processing ? 'Saving...' : 'Add Room'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UbahStatusKamar;
