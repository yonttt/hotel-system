import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../../state/AuthContext';
import useHotels from '../../../../logic/useHotels';
import usePaginatedTable from '../../../../logic/usePaginatedTable';
import { formatCurrencyIDR } from '../../../../utils/formatters';

const MasterHargaKamar = () => {
  const { user } = useAuth();
  const { defaultHotel, hotels } = useHotels();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    hotel_name: '',
    rate_name: '',
    room_type: '',
    room_rate: 0,
    extrabed: 0,
    effective_date: ''
  });
  const [processing, setProcessing] = useState(false);

  // Master data
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetchMasterData();
    fetchRates();
  }, []);

  const fetchMasterData = async () => {
    try {
      const roomTypesResponse = await apiService.getRoomTypesLookup();
      setRoomTypes(roomTypesResponse.data || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoomRates(0, 1000);
      setRates(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch room rates: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching room rates:', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredRates, currentData: currentRates,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(rates, {
    searchFields: ['rate_name', 'room_type', 'room_rate', 'effective_date']
  });

  // Format date to Indonesian format
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Check if user has edit permission (admin and manager only)
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  const resetForm = () => {
    setFormData({
      hotel_name: defaultHotel,
      rate_name: '',
      room_type: '',
      room_rate: 0,
      extrabed: 0,
      effective_date: ''
    });
  };

  // Handle add click
  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle add save
  const handleAddSave = async () => {
    if (!formData.rate_name || !formData.room_type) {
      alert('Please fill in Rate Name and Room Type');
      return;
    }
    try {
      setProcessing(true);
      await apiService.createRoomRate({
        ...formData,
        room_rate: parseFloat(formData.room_rate) || 0,
        extrabed: parseFloat(formData.extrabed) || 0
      });
      setSuccessMessage(`Rate "${formData.rate_name}" added successfully`);
      setShowAddModal(false);
      resetForm();
      await fetchRates();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error adding rate:', err);
      alert('Failed to add rate: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle edit click
  const handleEditClick = (rate) => {
    if (!canEdit()) return;
    setEditingRate(rate);
    setFormData({
      hotel_name: rate.hotel_name || defaultHotel,
      rate_name: rate.rate_name || '',
      room_type: rate.room_type || '',
      room_rate: rate.room_rate || 0,
      extrabed: rate.extrabed || 0,
      effective_date: rate.effective_date || ''
    });
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!formData.rate_name || !formData.room_type) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setProcessing(true);
      await apiService.updateRoomRate(editingRate.id, {
        ...formData,
        room_rate: parseFloat(formData.room_rate) || 0,
        extrabed: parseFloat(formData.extrabed) || 0
      });
      setSuccessMessage(`Rate "${formData.rate_name}" updated successfully`);
      setShowEditModal(false);
      setEditingRate(null);
      await fetchRates();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating rate:', err);
      alert('Failed to update rate: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (rate) => {
    if (!window.confirm(`Are you sure you want to delete rate "${rate.rate_name}"?`)) return;
    try {
      await apiService.deleteRoomRate(rate.id);
      setSuccessMessage(`Rate "${rate.rate_name}" deleted successfully`);
      await fetchRates();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting rate:', err);
      alert('Failed to delete rate: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingRate(null);
    resetForm();
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="MASTER HARGA KAMAR"
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
              <col style={{ width: '180px' }} />  {/* Hotel */}
              <col style={{ width: '200px' }} />  {/* Rate Name */}
              <col style={{ width: '120px' }} />  {/* Room Type */}
              <col style={{ width: '120px' }} />  {/* Room Rate */}
              <col style={{ width: '100px' }} />  {/* Extrabed */}
              <col style={{ width: '150px' }} />  {/* Date */}
              <col style={{ width: '80px' }} />   {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Hotel</th>
                <th>Rate Name</th>
                <th>Room Type</th>
                <th>Room Rate</th>
                <th>Extrabed</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="no-data">Loading...</td>
                </tr>
              ) : currentRates.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentRates.map((rate, index) => (
                  <tr key={rate.id}>
                    <td style={{ textAlign: 'center' }}>{startIndex + index + 1}</td>
                    <td>{rate.hotel_name || '-'}</td>
                    <td>{rate.rate_name}</td>
                    <td>{rate.room_type}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrencyIDR(rate.room_rate)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrencyIDR(rate.extrabed)}</td>
                    <td>{formatDate(rate.effective_date)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {canEdit() && (
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn-table-action"
                            style={{ background: '#ffc107', color: '#212529', padding: '4px 10px', fontSize: '12px' }}
                            onClick={() => handleEditClick(rate)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-table-action"
                            style={{ background: '#dc3545', color: 'white', padding: '4px 10px', fontSize: '12px' }}
                            onClick={() => handleDelete(rate)}
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
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredRates.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPageNumbers
          pageWindowSize={5}
          extraInfo={searchTerm && ` (filtered from ${rates.length} total entries)`}
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
              {showEditModal ? 'Edit Room Rate' : 'Add New Room Rate'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel</label>
              <select
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rate Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.rate_name}
                onChange={(e) => setFormData({...formData, rate_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="e.g., Libur Keagamaan 2025"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Type <span style={{color: 'red'}}>*</span></label>
              <select
                value={formData.room_type}
                onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Rate</label>
                <input
                  type="number"
                  value={formData.room_rate}
                  onChange={(e) => setFormData({...formData, room_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Extrabed</label>
                <input
                  type="number"
                  value={formData.extrabed}
                  onChange={(e) => setFormData({...formData, extrabed: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Effective Date</label>
              <input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({...formData, effective_date: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
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
                {processing ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Rate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MasterHargaKamar;
