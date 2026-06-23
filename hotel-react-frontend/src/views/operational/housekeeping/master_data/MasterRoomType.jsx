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

const MasterRoomType = () => {
  const { user } = useAuth();
  const { hotelNames } = useHotels();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category_code: '',
    category_name: '',
    normal_rate: 0,
    weekend_rate: 0,
    six_hours_rate: 0,
    description: '',
    photo_url: '',
    discount_percentage: 0
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

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems, currentData: currentItems,
    totalPages, startIndex: indexOfFirstItem, endIndex: indexOfLastItem
  } = usePaginatedTable(roomTypes, {
    searchFields: ['category_code', 'category_name']
  });

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

  const resetForm = () => {
    setFormData({
      category_code: '',
      category_name: '',
      normal_rate: 0,
      weekend_rate: 0,
      six_hours_rate: 0,
      description: '',
      photo_url: '',
      discount_percentage: 0
    });
  };

  // Handle add click
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle add save
  const handleAddSave = async () => {
    if (!formData.category_code || !formData.category_name) {
      alert('Please fill in Code and Type Name');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createRoomCategory({
        ...formData,
        normal_rate: parseFloat(formData.normal_rate) || 0,
        weekend_rate: parseFloat(formData.weekend_rate) || 0,
        six_hours_rate: parseFloat(formData.six_hours_rate) || null,
        discount_percentage: parseFloat(formData.discount_percentage) || 0
      });
      setSuccessMessage(`Room type "${formData.category_name}" added successfully`);
      setShowAddModal(false);
      resetForm();
      await fetchRoomTypes();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding room type:', err);
      alert('Failed to add room type: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle edit click
  const handleEditClick = (item) => {
    if (!canEdit()) return;
    setEditingItem(item);
    setFormData({
      category_code: item.category_code || '',
      category_name: item.category_name || '',
      normal_rate: item.normal_rate || 0,
      weekend_rate: item.weekend_rate || 0,
      six_hours_rate: item.six_hours_rate || 0,
      description: item.description || '',
      photo_url: item.photo_url || '',
      discount_percentage: item.discount_percentage || 0
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!formData.category_code || !formData.category_name) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setProcessing(true);
      await apiService.updateRoomCategory(editingItem.id, {
        ...formData,
        normal_rate: parseFloat(formData.normal_rate) || 0,
        weekend_rate: parseFloat(formData.weekend_rate) || 0,
        six_hours_rate: parseFloat(formData.six_hours_rate) || null,
        discount_percentage: parseFloat(formData.discount_percentage) || 0
      });
      setSuccessMessage(`Room type "${formData.category_name}" updated successfully`);
      setShowEditModal(false);
      setEditingItem(null);
      await fetchRoomTypes();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating room type:', err);
      alert('Failed to update room type: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete room type "${item.category_name}"?`)) return;
    try {
      await apiService.deleteRoomCategory(item.id);
      setSuccessMessage(`Room type "${item.category_name}" deleted successfully`);
      await fetchRoomTypes();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting room type:', err);
      alert('Failed to delete room type: ' + (err.response?.data?.detail || err.message));
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
        title="MASTER ROOM TYPE"
        actions={canEdit() && (
          <Button variant="primary" size="sm" onClick={handleAddClick}>+ Add Room Type</Button>
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
        rowKey={(item) => item.id}
        columns={[
          { key: 'no', header: 'No', align: 'center', width: '60px',
            render: (_i, idx) => indexOfFirstItem + idx + 1 },
          { key: 'code', header: 'Code', render: (i) => i.category_code || '-' },
          { key: 'type', header: 'Type', render: (i) => i.category_name || '-' },
          { key: 'normal', header: 'Normal Rate', align: 'right', render: (i) => formatCurrency(i.normal_rate || 0) },
          { key: 'weekend', header: 'Weekend Rate', align: 'right', render: (i) => formatCurrency(i.weekend_rate || 0) },
          { key: 'six', header: '6 Hours', align: 'right', render: (i) => i.six_hours_rate ? formatCurrency(i.six_hours_rate) : '-' },
          { key: 'disc', header: 'Discount', align: 'right', render: (i) => i.discount_percentage ? `${i.discount_percentage}%` : '-' },
          { key: 'photo', header: 'Photo', align: 'center',
            render: (i) => i.photo_url
              ? <img src={i.photo_url} alt={i.category_name} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
              : '-' },
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
        total={filteredItems.length}
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
              {showEditModal ? 'Edit Room Type' : 'Add New Room Type'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Code <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.category_code}
                onChange={(e) => setFormData({...formData, category_code: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Type Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.category_name}
                onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Normal Rate</label>
                <input
                  type="number"
                  value={formData.normal_rate}
                  onChange={(e) => setFormData({...formData, normal_rate: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Weekend Rate</label>
                  <input
                    type="number"
                    value={formData.weekend_rate}
                    onChange={(e) => setFormData({...formData, weekend_rate: e.target.value})}
                    className="form-input"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="field-label">6 Hours Rate</label>
                  <input
                    type="number"
                    value={formData.six_hours_rate}
                    onChange={(e) => setFormData({...formData, six_hours_rate: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                style={{ minHeight: '80px' }}
                placeholder="Tampil di website publik sebagai deskripsi kamar"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Photo URL</label>
              <input
                type="text"
                value={formData.photo_url}
                onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                className="form-input"
                placeholder="https://... (foto kamar yang tampil di website)"
              />
              {formData.photo_url && (
                <img src={formData.photo_url} alt="preview" style={{ marginTop: '8px', width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Discount untuk Website (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                className="form-input"
                placeholder="0"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant={showEditModal ? 'success' : 'primary'} onClick={showEditModal ? handleSaveEdit : handleAddSave} disabled={processing}>
                {processing ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Room Type')}
              </Button>
            </div>
          </div>
        </div>
      )}    </Layout>
  );
};

export default MasterRoomType;