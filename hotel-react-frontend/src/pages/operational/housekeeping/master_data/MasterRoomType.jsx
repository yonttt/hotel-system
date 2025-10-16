import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const MasterRoomType = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoomCategories();
      setRoomTypes(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch room types');
      console.error('Error fetching room types:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = roomTypes.filter(item => {
    const matchesSearch = 
      item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesHotel = selectedHotel === 'ALL' || item.hotel_name === selectedHotel;
    
    return matchesSearch && matchesHotel;
  });

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / showEntries);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
      {/* Header Controls */}
      <div className="unified-header-controls">
        {/* Top Row - Title and Hotel Filter */}
        <div className="header-row header-row-top">
          <div className="unified-header-left">
            <h2 className="header-title">MASTER ROOM TYPE</h2>
          </div>
          <div className="unified-header-right">
            <div className="hotel-select">
              <label>Filter Hotel:</label>
              <select 
                className="header-hotel-select"
                value={selectedHotel}
                onChange={(e) => {
                  setSelectedHotel(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">ALL</option>
                <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
                <option value="HOTEL IDOLA">HOTEL IDOLA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Row - Search and Entries */}
        <div className="header-row header-row-bottom">
          <div className="unified-header-left">
            <div className="search-section">
              <label>Search:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="unified-header-right">
            <div className="entries-control">
              <span className="entries-label">Show entries:</span>
              <select 
                className="entries-select" 
                value={showEntries} 
                onChange={(e) => {
                  setShowEntries(Number(e.target.value));
                  setCurrentPage(1);
                }}
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

      {/* Table */}
      <div className="unified-table-wrapper">
        <table className="reservation-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Code</th>
              <th>Type</th>
              <th>Normal Rate</th>
              <th>Weekend Rate</th>
              <th>6 Hours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-spinner">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="error-message">{error}</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No data available in table</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.code || '-'}</td>
                  <td>{item.type || '-'}</td>
                  <td className="align-right">{formatCurrency(item.normal_rate || 0)}</td>
                  <td className="align-right">{formatCurrency(item.weekend_rate || 0)}</td>
                  <td className="align-right">{formatCurrency(item.six_hours_rate || 0)}</td>
                  <td>
                    <button className="btn-table-action">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="unified-footer">
        <div className="entries-info">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
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

export default MasterRoomType;
