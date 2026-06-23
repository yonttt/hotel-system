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
            <Button variant="primary" size="sm" onClick={handleAddClick}>+ Add Rate</Button>
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
          <div className="alert alert--success">{successMessage}</div>
        )}

        {error && (
          <div className="alert alert--error">{error}</div>
        )}

        {/* Table Section */}
        <DataTable
          data={currentRates}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(rate) => rate.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '50px',
              render: (_r, i) => startIndex + i + 1 },
            { key: 'hotel', header: 'Hotel', render: (r) => r.hotel_name || '-' },
            { key: 'rate_name', header: 'Rate Name', render: (r) => r.rate_name },
            { key: 'room_type', header: 'Room Type', render: (r) => r.room_type },
            { key: 'room_rate', header: 'Room Rate', align: 'right', render: (r) => formatCurrencyIDR(r.room_rate) },
            { key: 'extrabed', header: 'Extrabed', align: 'right', render: (r) => formatCurrencyIDR(r.extrabed) },
            { key: 'date', header: 'Date', render: (r) => formatDate(r.effective_date) },
            ...(canEdit() ? [{
              key: 'action', header: 'Action', align: 'center', width: '160px',
              render: (r) => (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(r)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(r)}>Delete</Button>
                </div>
              )
            }] : [])
          ]}
        />

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
        <div className="app-modal-overlay">
          <div className="app-modal-card" style={{ maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              {showEditModal ? 'Edit Room Rate' : 'Add New Room Rate'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Hotel</label>
              <select
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                className="form-input"
              >
                {hotels.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Rate Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={formData.rate_name}
                onChange={(e) => setFormData({...formData, rate_name: e.target.value})}
                className="form-input"
                placeholder="e.g., Libur Keagamaan 2025"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Room Type <span style={{color: 'red'}}>*</span></label>
              <select
                value={formData.room_type}
                onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                className="form-input"
              >
                <option value="">Select Room Type</option>
                {roomTypes.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Room Rate</label>
                <input
                  type="number"
                  value={formData.room_rate}
                  onChange={(e) => setFormData({...formData, room_rate: e.target.value})}
                  className="form-input"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">Extrabed</label>
                <input
                  type="number"
                  value={formData.extrabed}
                  onChange={(e) => setFormData({...formData, extrabed: e.target.value})}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Effective Date</label>
              <input
                type="date"
                value={formData.effective_date}
                onChange={(e) => setFormData({...formData, effective_date: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant={showEditModal ? 'success' : 'primary'} onClick={showEditModal ? handleSaveEdit : handleAddSave} disabled={processing}>
                {processing ? 'Saving...' : (showEditModal ? 'Save Changes' : 'Add Rate')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MasterHargaKamar;
