import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const UbahStatusKamar = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState('HOTEL NEW IDOLA');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [processing, setProcessing] = useState(false);

  // Room status options
  const statusOptions = [
    { code: 'VR', name: 'Vacant Ready' },
    { code: 'VC', name: 'Vacant Clean' },
    { code: 'VD', name: 'Vacant Dirty' },
    { code: 'VU', name: 'Vacant Uncheck' },
    { code: 'OR', name: 'Occupied Ready' },
    { code: 'OC', name: 'Occupied Clean' },
    { code: 'OD', name: 'Occupied Dirty' },
    { code: 'CO', name: 'Checkout' },
    { code: 'GC', name: 'General Cleaning' },
    { code: 'OO', name: 'Out Of Order' },
    { code: 'AR', name: 'Arrival' },
    { code: 'IC', name: 'Incognito' },
    { code: 'DND', name: 'DND (Do Not Disturb)' },
    { code: 'MU', name: 'Makeup Room' },
    { code: 'HU', name: 'House Use' },
    { code: 'SO', name: 'Sleep Out' },
    { code: 'SK', name: 'Skipper' },
    { code: 'ED', name: 'Expected Departure' }
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, selectedHotel, searchTerm]);

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

  const filterRooms = () => {
    let filtered = rooms;

    // Filter by hotel
    if (selectedHotel !== 'ALL') {
      filtered = filtered.filter(room => room.hotel_name === selectedHotel);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(room => 
        room.room_number?.toLowerCase().includes(search) ||
        room.room_type?.toLowerCase().includes(search) ||
        room.status?.toLowerCase().includes(search) ||
        String(room.floor_number).includes(search)
      );
    }

    setFilteredRooms(filtered);
    setCurrentPage(1);
  };

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

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  // Handle edit click
  const handleEditClick = (room) => {
    setEditingRoom(room);
    setEditStatus(getStatusCode(room.status));
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editStatus) {
      alert('Please select a status');
      return;
    }

    try {
      setProcessing(true);
      await apiService.updateHotelRoom(editingRoom.room_number, {
        status: editStatus
      });
      
      alert(`Room ${editingRoom.room_number} status updated to ${getStatusDisplayName(editStatus)}`);
      setShowEditModal(false);
      setEditingRoom(null);
      await fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingRoom(null);
    setEditStatus('');
  };

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="ubah-status-kamar-container">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-row">
            <label>Filter :</label>
            <select 
              value={selectedHotel} 
              onChange={(e) => setSelectedHotel(e.target.value)}
              className="hotel-filter"
            >
              <option value="ALL">ALL HOTELS</option>
              <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
            </select>
          </div>
        </div>

        {/* Search and Entries Section */}
        <div className="search-entries-section">
          <div className="search-box">
            <label>Search :</label>
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="entries-controls">
            <label>Show entries:</label>
            <select 
              value={entriesPerPage} 
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="entries-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <button className="btn-print" onClick={handlePrint} title="Print">
              Print
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-message">Loading rooms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table className="ubah-status-table">
              <thead>
                <tr>
                  <th className="col-no">No</th>
                  <th className="col-hotel">NAMA HOTEL</th>
                  <th className="col-type">Type</th>
                  <th className="col-room">Room No</th>
                  <th className="col-floor">Floor</th>
                  <th className="col-vip">VIP</th>
                  <th className="col-smoking">Smoking</th>
                  <th className="col-status">Status</th>
                  <th className="col-hit">Hit</th>
                  <th className="col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRooms.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="no-data">No rooms found</td>
                  </tr>
                ) : (
                  currentRooms.map((room, index) => (
                    <tr key={room.id}>
                      <td className="col-no">{startIndex + index + 1}</td>
                      <td className="col-hotel">{room.hotel_name || 'HOTEL NEW IDOLA'}</td>
                      <td className="col-type">{room.room_type}</td>
                      <td className="col-room">{room.room_number}</td>
                      <td className="col-floor">{room.floor_number}</td>
                      <td className="col-vip">{room.is_vip ? 'Yes' : ''}</td>
                      <td className="col-smoking">{room.is_smoking ? 'Yes' : 'No'}</td>
                      <td className="col-status">{getStatusDisplayName(room.status)}</td>
                      <td className="col-hit">{room.hit_count || 0}</td>
                      <td className="col-action">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditClick(room)}
                          title="Edit Status"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-section">
          <div className="showing-info">
            Showing {filteredRooms.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} entries
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button 
              className="page-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getPageNumbers().map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="page-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button 
              className="page-btn"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingRoom && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Room Status - {editingRoom.room_number}</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Hotel:</label>
                  <input 
                    type="text" 
                    value={editingRoom.hotel_name || 'HOTEL NEW IDOLA'} 
                    disabled 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Room Type:</label>
                  <input 
                    type="text" 
                    value={editingRoom.room_type} 
                    disabled 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Room Number:</label>
                  <input 
                    type="text" 
                    value={editingRoom.room_number} 
                    disabled 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Floor:</label>
                  <input 
                    type="text" 
                    value={editingRoom.floor_number} 
                    disabled 
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Status: <span className="required">*</span></label>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="">-- Select Status --</option>
                    {statusOptions.map(opt => (
                      <option key={opt.code} value={opt.code}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button 
                  className="btn-save" 
                  onClick={handleSaveEdit}
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ubah-status-kamar-container {
          padding: 20px;
          background: #fff;
          min-height: calc(100vh - 60px);
        }

        .filter-section {
          margin-bottom: 15px;
          padding: 10px 15px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .filter-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-row label {
          font-weight: 500;
          color: #333;
        }

        .hotel-filter {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          min-width: 200px;
          font-size: 14px;
        }

        .search-entries-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-box label {
          font-weight: 500;
          color: #333;
        }

        .search-input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 200px;
          font-size: 14px;
        }

        .entries-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .entries-controls label {
          font-weight: 500;
          color: #333;
        }

        .entries-select {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .btn-print {
          padding: 8px 16px;
          background: #17a2b8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-print:hover {
          background: #138496;
        }

        .table-container {
          overflow-x: auto;
          margin-bottom: 15px;
        }

        .ubah-status-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .ubah-status-table th,
        .ubah-status-table td {
          padding: 10px 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .ubah-status-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          white-space: nowrap;
        }

        .ubah-status-table tbody tr:hover {
          background: #f5f5f5;
        }

        .ubah-status-table tbody tr:nth-child(even) {
          background: #fafafa;
        }

        .col-no { width: 50px; text-align: center; }
        .col-hotel { min-width: 150px; }
        .col-type { width: 80px; }
        .col-room { width: 80px; }
        .col-floor { width: 60px; text-align: center; }
        .col-vip { width: 50px; text-align: center; }
        .col-smoking { width: 80px; text-align: center; }
        .col-status { min-width: 120px; }
        .col-hit { width: 50px; text-align: center; }
        .col-action { width: 70px; text-align: center; }

        .btn-edit {
          padding: 4px 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }

        .btn-edit:hover {
          transform: scale(1.2);
        }

        .no-data {
          text-align: center;
          padding: 30px !important;
          color: #666;
        }

        .loading-message,
        .error-message {
          text-align: center;
          padding: 30px;
          color: #666;
        }

        .error-message {
          color: #dc3545;
        }

        .pagination-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .showing-info {
          color: #17a2b8;
          font-size: 14px;
        }

        .pagination-controls {
          display: flex;
          gap: 5px;
        }

        .page-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          font-size: 14px;
          border-radius: 3px;
        }

        .page-btn:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .page-btn.active {
          background: #17a2b8;
          color: white;
          border-color: #17a2b8;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group .required {
          color: #dc3545;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-input:disabled {
          background: #f5f5f5;
          color: #666;
        }

        .form-select {
          cursor: pointer;
        }

        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        .btn-save {
          padding: 10px 20px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-save:hover:not(:disabled) {
          background: #218838;
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media print {
          .filter-section,
          .search-entries-section,
          .pagination-section,
          .col-action,
          .btn-edit {
            display: none !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default UbahStatusKamar;
