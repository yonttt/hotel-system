import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const ManagementRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState('ALL');

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

  // Filter data
  const filteredData = rooms.filter(item => {
    const matchesSearch = 
      item.room_number?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  return (
    <Layout>
      <div className="unified-reservation-container">
      {/* Header Controls */}
      <div className="unified-header-controls">
        {/* Top Row - Title and Hotel Filter */}
        <div className="header-row header-row-top">
          <div className="unified-header-left">
            <h2 className="header-title">MANAGEMENT ROOM</h2>
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
              <th>NAMA HOTEL</th>
              <th>Type</th>
              <th>Room No</th>
              <th>Floor</th>
              <th>VIP</th>
              <th>Smoking</th>
              <th>Status Pajak</th>
              <th>Hit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="loading-spinner">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="error-message">{error}</td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No data available in table</td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.hotel_name || '-'}</td>
                  <td>{item.room_type || '-'}</td>
                  <td>{item.room_number || '-'}</td>
                  <td>{item.floor || '-'}</td>
                  <td>{item.is_vip ? 'YES' : 'NO'}</td>
                  <td>{item.smoking_allowed ? 'Yes' : 'No'}</td>
                  <td>{item.tax_status || 'TIDAK'}</td>
                  <td>{item.hit_count || 0}</td>
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

export default ManagementRoom;
