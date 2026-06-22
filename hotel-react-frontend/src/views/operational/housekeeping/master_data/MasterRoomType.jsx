import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
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

      <UnifiedTableHeader
        title="MASTER ROOM TYPE"
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
        hotels={hotelNames.map(name => ({ id: name, name }))}
        selectedHotel={selectedHotel}
        onHotelChange={setSelectedHotel}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showEntries={showEntries}
        onEntriesChange={setShowEntries}
      />

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
              <th className="align-right">Discount</th>
              <th>Photo</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="loading-spinner">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="error-message">{error}</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">No data available in table</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.category_code || '-'}</td>
                  <td>{item.category_name || '-'}</td>
                  <td className="align-right">{formatCurrency(item.normal_rate || 0)}</td>
                  <td className="align-right">{formatCurrency(item.weekend_rate || 0)}</td>
                  <td className="align-right">{item.six_hours_rate ? formatCurrency(item.six_hours_rate) : '-'}</td>
                  <td className="align-right">{item.discount_percentage ? `${item.discount_percentage}%` : '-'}</td>
                  <td>
                    {item.photo_url ? (
                      <img src={item.photo_url} alt={item.category_name} style={{ width: '50px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : '-'}
                  </td>
                  <td>
                    {canEdit() && (
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button 
                          className="btn-table-action"
                          style={{ background: '#ffc107', color: '#212529', padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-table-action"
                          style={{ background: '#dc3545', color: 'white', padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => handleDelete(item)}
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
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Code <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.category_code}
                onChange={(e) => setFormData({...formData, category_code: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.category_name}
                onChange={(e) => setFormData({...formData, category_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Normal Rate</label>
                <input
                  type="number"
                  value={formData.normal_rate}
                  onChange={(e) => setFormData({...formData, normal_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weekend Rate</label>
                  <input
                    type="number"
                    value={formData.weekend_rate}
                    onChange={(e) => setFormData({...formData, weekend_rate: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>6 Hours Rate</label>
                  <input
                    type="number"
                    value={formData.six_hours_rate}
                    onChange={(e) => setFormData({...formData, six_hours_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                placeholder="Tampil di website publik sebagai deskripsi kamar"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Photo URL</label>
              <input
                type="text"
                value={formData.photo_url}
                onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="https://... (foto kamar yang tampil di website)"
              />
              {formData.photo_url && (
                <img src={formData.photo_url} alt="preview" style={{ marginTop: '8px', width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }} />
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount untuk Website (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="0"
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
                onClick={showEditModal ? handleSaveEdit : handleAddSave}
                disabled={processing}
                style={{
                  padding: '8px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: showEditModal ? '#4CAF50' : '#007bff',
                  color: 'white',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Room Type')}
              </button>
            </div>
          </div>
        </div>
      )}    </Layout>
  );
};

export default MasterRoomType;