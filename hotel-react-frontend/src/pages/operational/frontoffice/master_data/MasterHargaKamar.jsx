import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const MasterHargaKamar = () => {
  const [rates, setRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('HOTEL NEW IDOLA');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEntries, setShowEntries] = useState(10);
  const [successMessage, setSuccessMessage] = useState(null);

  // Master data
  const [hotelOptions, setHotelOptions] = useState([]);

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
                      <button
                        className="btn-table-action"
                        title="Edit Rate"
                      >
                        Edit
                      </button>
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
    </Layout>
  );
};

export default MasterHargaKamar;
