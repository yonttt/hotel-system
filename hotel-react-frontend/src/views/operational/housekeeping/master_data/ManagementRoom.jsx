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

const ManagementRoom = () => {
  const { user } = useAuth();
  const { hotelNames, defaultHotel } = useHotels();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hotel_name: '',
    room_number: '',
    room_type: '',
    floor_number: '',
    vip_status: 'NO',
    smoking_allowed: 'No',
    tax_status: 'TIDAK'
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

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredData, currentData: currentItems,
    totalPages, startIndex: indexOfFirstItem, endIndex: indexOfLastItem
  } = usePaginatedTable(rooms, {
    searchFields: ['room_number', 'room_type', 'hotel_name']
  });

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  const resetForm = () => {
    setFormData({
      hotel_name: defaultHotel,
      room_number: '',
      room_type: '',
      floor_number: '',
      vip_status: 'NO',
      smoking_allowed: 'No',
      tax_status: 'TIDAK'
    });
  };

  // Handle add click
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle add save
  const handleAddSave = async () => {
    if (!formData.room_number || !formData.room_type) {
      alert('Please fill in Room Number and Room Type');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createHotelRoom({
        hotel_name: formData.hotel_name,
        room_number: formData.room_number,
        room_type: formData.room_type,
        floor_number: parseInt(formData.floor_number) || 1,
        is_vip: formData.vip_status === 'YES',
        smoking_allowed: formData.smoking_allowed === 'Yes',
        tax_status: formData.tax_status
      });
      setSuccessMessage(`Room "${formData.room_number}" added successfully`);
      setShowAddModal(false);
      resetForm();
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
  const handleEditClick = (item) => {
    if (!canEdit()) return;
    setEditingItem(item);
    setFormData({
      hotel_name: item.hotel_name || defaultHotel,
      room_number: item.room_number || '',
      room_type: item.room_type || '',
      floor_number: item.floor_number || item.floor || '',
      vip_status: item.vip_status || (item.is_vip ? 'YES' : 'NO'),
      smoking_allowed: item.smoking_allowed ? 'Yes' : 'No',
      tax_status: item.tax_status || 'TIDAK'
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!formData.room_type) {
      alert('Please select a room type');
      return;
    }
    try {
      setProcessing(true);
      await apiService.updateHotelRoom(editingItem.room_number, {
        hotel_name: formData.hotel_name,
        room_type: formData.room_type,
        floor_number: parseInt(formData.floor_number) || editingItem.floor_number,
        vip_status: formData.vip_status,
        smoking_allowed: formData.smoking_allowed,
        tax_status: formData.tax_status
      });
      setSuccessMessage(`Room "${editingItem.room_number}" updated successfully`);
      setShowEditModal(false);
      setEditingItem(null);
      await fetchRooms();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete room "${item.room_number}"?`)) return;
    try {
      await apiService.deleteHotelRoom(item.room_number);
      setSuccessMessage(`Room "${item.room_number}" deleted successfully`);
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
    setEditingItem(null);
    resetForm();
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert--success">{successMessage}</div>
      )}

      <UnifiedTableHeader
        title="MANAGEMENT ROOM"
        actions={canEdit() && (
          <Button variant="primary" size="sm" onClick={handleAddClick}>+ Add Room</Button>
        )}
        hotels={hotelNames.map(name => ({ id: name, name }))}
        selectedHotel={selectedHotel}
        onHotelChange={setSelectedHotel}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showEntries={showEntries}
        onEntriesChange={setShowEntries}
      />

      {/* Table */}
      <DataTable
        data={currentItems}
        loading={loading}
        error={error}
        emptyText="No data available in table"
        rowKey={(item) => item.id || item.room_number}
        columns={[
          { key: 'no', header: 'No', align: 'center', width: '60px',
            render: (_i, idx) => indexOfFirstItem + idx + 1 },
          { key: 'hotel', header: 'Nama Hotel', render: (i) => i.hotel_name || '-' },
          { key: 'type', header: 'Type', render: (i) => i.room_type || '-' },
          { key: 'room_no', header: 'Room No', render: (i) => i.room_number || '-' },
          { key: 'floor', header: 'Floor', align: 'center', render: (i) => i.floor || '-' },
          { key: 'vip', header: 'VIP', align: 'center', render: (i) => i.is_vip ? 'YES' : 'NO' },
          { key: 'smoking', header: 'Smoking', align: 'center', render: (i) => i.smoking_allowed ? 'Yes' : 'No' },
          { key: 'tax', header: 'Status Pajak', align: 'center', render: (i) => i.tax_status || 'TIDAK' },
          { key: 'hit', header: 'Hit', align: 'center', render: (i) => i.hit_count || 0 },
          ...(canEdit() ? [{
            key: 'action', header: 'Action', align: 'center', width: '160px',
            render: (i) => (
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(i)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(i)}>Delete</Button>
              </div>
            )
          }] : [])
        ]}
      />

      <UnifiedTableFooter
        startIndex={indexOfFirstItem}
        endIndex={indexOfLastItem}
        total={filteredData.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showPageNumbers
      />
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div style={{
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
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              {showEditModal ? `Edit Room: ${editingItem?.room_number}` : 'Add New Room'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Hotel</label>
              <select
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                className="form-input"
              >
                <option value="">Select Hotel</option>
                {hotelNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {showAddModal && (
              <div style={{ marginBottom: '15px' }}>
                <label className="field-label">Room Number <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  value={formData.room_number}
                  onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                  className="form-input"
                  placeholder="e.g., 101"
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Room Type <span style={{color: 'red'}}>*</span></label>
              <select
                value={formData.room_type}
                onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                className="form-input"
              >
                <option value="">Select Room Type</option>
                {roomTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Floor</label>
              <input
                type="number"
                value={formData.floor_number}
                onChange={(e) => setFormData({...formData, floor_number: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">VIP Status</label>
                <select
                  value={formData.vip_status}
                  onChange={(e) => setFormData({...formData, vip_status: e.target.value})}
                  className="form-input"
                >
                  <option value="NO">NO</option>
                  <option value="YES">YES</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Smoking</label>
                <select
                  value={formData.smoking_allowed}
                  onChange={(e) => setFormData({...formData, smoking_allowed: e.target.value})}
                  className="form-input"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Status Pajak</label>
              <select
                value={formData.tax_status}
                onChange={(e) => setFormData({...formData, tax_status: e.target.value})}
                className="form-input"
              >
                <option value="TIDAK">TIDAK</option>
                <option value="YA">YA</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant={showEditModal ? 'success' : 'primary'} onClick={showEditModal ? handleSaveEdit : handleAddSave} disabled={processing}>
                {processing ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Room')}
              </Button>
            </div>
          </div>
        </div>
      )}    </Layout>
  );
};

export default ManagementRoom;