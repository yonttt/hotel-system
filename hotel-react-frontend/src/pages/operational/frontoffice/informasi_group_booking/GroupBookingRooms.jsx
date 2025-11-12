import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';
import { useAuth } from '../../../../context/AuthContext';

const GroupBookingRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGroupBookingRooms();
  }, []);

  const fetchGroupBookingRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGroupBookingRooms();
      console.log('Group Booking Rooms Response:', response.data);
      setRooms(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch group booking rooms: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching group booking rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search
  const filteredRooms = rooms.filter(room => 
    room.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * showEntries;
  const indexOfFirstItem = indexOfLastItem - showEntries;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / showEntries);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager', 'frontoffice'].includes(user?.role);
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <h2 className="header-title">GROUP BOOKING ROOMS</h2>
            </div>
          </div>

          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search:</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by group name, guest, room number..."
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
        <div className="table-container">
          <table className="unified-table">
            <colgroup>
              <col style={{ width: '50px' }} /> {/* No */}
              <col style={{ width: '120px' }} /> {/* Group ID */}
              <col style={{ width: '180px' }} /> {/* Group Name */}
              <col style={{ width: '120px' }} /> {/* Reservation No */}
              <col style={{ width: '100px' }} /> {/* Room Number */}
              <col style={{ width: '120px' }} /> {/* Room Type */}
              <col style={{ width: '180px' }} /> {/* Guest Name */}
              <col style={{ width: '130px' }} /> {/* Mobile Phone */}
              <col style={{ width: '100px' }} /> {/* Check In */}
              <col style={{ width: '100px' }} /> {/* Check Out */}
              <col style={{ width: '70px' }} /> {/* Nights */}
              <col style={{ width: '80px' }} /> {/* Guests */}
              <col style={{ width: '130px' }} /> {/* Rate */}
              <col style={{ width: '130px' }} /> {/* Discount */}
              <col style={{ width: '130px' }} /> {/* Subtotal */}
              <col style={{ width: '100px' }} /> {/* Status */}
              <col style={{ width: '100px' }} /> {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Group ID</th>
                <th>Group Name</th>
                <th>Reservation No</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Guest Name</th>
                <th>Mobile Phone</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Nights</th>
                <th>Guests</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Subtotal</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="17" className="no-data">Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="17" className="no-data">{error}</td>
                </tr>
              ) : currentRooms.length === 0 ? (
                <tr>
                  <td colSpan="17" className="no-data">No group booking rooms found</td>
                </tr>
              ) : (
                currentRooms.map((room, index) => (
                  <tr key={room.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td style={{ fontWeight: '500' }}>{room.group_booking_id || 'N/A'}</td>
                    <td style={{ fontWeight: '500' }}>{room.group_name || 'N/A'}</td>
                    <td>{room.reservation_no || 'N/A'}</td>
                    <td className="align-center">{room.room_number || 'N/A'}</td>
                    <td>{room.room_type || 'N/A'}</td>
                    <td>{room.guest_name || 'N/A'}</td>
                    <td>{room.mobile_phone || 'N/A'}</td>
                    <td>{formatDate(room.check_in_date)}</td>
                    <td>{formatDate(room.check_out_date)}</td>
                    <td className="align-center">{room.nights || 0}</td>
                    <td className="align-center">
                      M:{room.guest_count_male || 0} F:{room.guest_count_female || 0} C:{room.guest_count_child || 0}
                    </td>
                    <td className="align-right">{formatCurrency(room.rate)}</td>
                    <td className="align-right">{formatCurrency(room.discount)}</td>
                    <td className="align-right">{formatCurrency(room.subtotal)}</td>
                    <td>
                      <span className={`status-badge status-${room.room_status?.toLowerCase().replace(' ', '-')}`}>
                        {room.room_status || 'Reserved'}
                      </span>
                    </td>
                    <td className="align-center">
                      {canEdit() && (
                        <button className="btn-table-action" title="Edit Details">Edit</button>
                      )}
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
            {`Showing ${filteredRooms.length > 0 ? indexOfFirstItem + 1 : 0} to ${Math.min(indexOfLastItem, filteredRooms.length)} of ${filteredRooms.length} entries`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum}>...</span>;
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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

export default GroupBookingRooms;
