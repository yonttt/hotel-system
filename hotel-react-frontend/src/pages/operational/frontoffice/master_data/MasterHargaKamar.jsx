import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const MasterHargaKamar = () => {
  const { user } = useAuth();
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('HOTEL NEW IDOLA');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  const [successMessage, setSuccessMessage] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [editFormData, setEditFormData] = useState({
    hotel_name: '',
    rate_name: '',
    room_type: '',
    room_rate: 0,
    extrabed: 0,
    effective_date: ''
  });
  const [processing, setProcessing] = useState(false);

  // Master data
  const [hotelOptions, setHotelOptions] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    fetchMasterData();
    fetchRates();
  }, []);

  useEffect(() => {
    filterRates();
  }, [rates, selectedHotel, searchTerm]);

  // Reset to first page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries, selectedHotel]);

  const fetchMasterData = async () => {
    try {
      const hotelResponse = await apiService.getHotels();
      setHotelOptions(hotelResponse.data || []);
      
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

  const filterRates = () => {
    let filtered = rates;

    // Filter by hotel
    if (selectedHotel !== 'ALL') {
      filtered = filtered.filter(rate => rate.hotel_name === selectedHotel);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(rate => 
        rate.rate_name?.toLowerCase().includes(search) ||
        rate.room_type?.toLowerCase().includes(search) ||
        String(rate.room_rate).includes(search) ||
        rate.effective_date?.includes(search)
      );
    }

    setFilteredRates(filtered);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return new Intl.NumberFormat('id-ID').format(amount);
  };

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

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRates.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentRates = filteredRates.slice(startIndex, endIndex);

  // Check if user has edit permission (admin and manager only)
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle edit click
  const handleEditClick = (rate) => {
    if (!canEdit()) return;
    setEditingRate(rate);
    setEditFormData({
      hotel_name: rate.hotel_name || 'HOTEL NEW IDOLA',
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
    if (!editFormData.rate_name || !editFormData.room_type) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateRoomRate(editingRate.id, {
        ...editFormData,
        room_rate: parseFloat(editFormData.room_rate) || 0,
        extrabed: parseFloat(editFormData.extrabed) || 0
      });
      
      setSuccessMessage(`Rate "${editFormData.rate_name}" updated successfully`);
      setShowEditModal(false);
      setEditingRate(null);
      await fetchRates();
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating rate:', err);
      alert('Failed to update rate: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingRate(null);
    setEditFormData({
      hotel_name: '',
      rate_name: '',
      room_type: '',
      room_rate: 0,
      extrabed: 0,
      effective_date: ''
    });
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>MASTER HARGA KAMAR</span>
              </div>
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
                  {hotelOptions.map(hotel => (
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
                    <td>{rate.hotel_name || 'HOTEL NEW IDOLA'}</td>
                    <td>{rate.rate_name}</td>
                    <td>{rate.room_type}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(rate.room_rate)}</td>
                    <td style={{ textAlign: 'right' }}>{formatCurrency(rate.extrabed)}</td>
                    <td>{formatDate(rate.effective_date)}</td>
                    <td style={{ textAlign: 'center' }}>
                      {canEdit() && (
                        <button
                          className="btn-table-action"
                          title="Edit Rate"
                          onClick={() => handleEditClick(rate)}
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

        {/* Pagination */}
        <div className="unified-footer">
          <div className="entries-info">
            Showing {filteredRates.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredRates.length)} of {filteredRates.length} entries
            {searchTerm && ` (filtered from ${rates.length} total entries)`}
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
              Edit Room Rate
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hotel</label>
              <select
                value={editFormData.hotel_name}
                onChange={(e) => setEditFormData({...editFormData, hotel_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                {hotelOptions.map(hotel => (
                  <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rate Name <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                value={editFormData.rate_name}
                onChange={(e) => setEditFormData({...editFormData, rate_name: e.target.value})}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                placeholder="e.g., Libur Keagamaan 2025"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Room Type <span style={{color: 'red'}}>*</span></label>
              <select
                value={editFormData.room_type}
                onChange={(e) => setEditFormData({...editFormData, room_type: e.target.value})}
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
                  value={editFormData.room_rate}
                  onChange={(e) => setEditFormData({...editFormData, room_rate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Extrabed</label>
                <input
                  type="number"
                  value={editFormData.extrabed}
                  onChange={(e) => setEditFormData({...editFormData, extrabed: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Effective Date</label>
              <input
                type="date"
                value={editFormData.effective_date}
                onChange={(e) => setEditFormData({...editFormData, effective_date: e.target.value})}
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
      )}
    </Layout>
  );
};

export default MasterHargaKamar;
