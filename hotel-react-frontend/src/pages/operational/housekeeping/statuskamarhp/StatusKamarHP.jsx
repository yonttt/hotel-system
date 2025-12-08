import { useState, useEffect } from 'react';
import { apiService } from '../../../../services/api';
import Layout from '../../../../components/Layout';

const StatusKamarHP = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'description'
  const [selectedHotel, setSelectedHotel] = useState('HOTEL NEW IDOLA');
  const [selectedType, setSelectedType] = useState('All Type');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalRoomStatus, setModalRoomStatus] = useState('');
  const [modalRoomBoy, setModalRoomBoy] = useState('');
  const [roomBoys, setRoomBoys] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Master data from database
  const [statusOptions, setStatusOptions] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);

  useEffect(() => {
    fetchMasterData();
    fetchRooms();
    fetchRoomBoys();
  }, []);

  const fetchMasterData = async () => {
    try {
      // Fetch room statuses from database
      const statusResponse = await apiService.getRoomStatuses();
      setStatusOptions(statusResponse.data || []);
      
      // Fetch hotels from database
      const hotelResponse = await apiService.getHotels();
      setHotelOptions(hotelResponse.data || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHotelRooms(0, 1000);
      console.log('Rooms Response:', response.data);
      setRooms(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomBoys = async () => {
    try {
      const response = await apiService.getUsersByRole('housekeeping');
      console.log('Room Boys Response:', response.data);
      setRoomBoys(response.data || []);
    } catch (err) {
      console.error('Error fetching room boys:', err);
      // Set default if fetch fails
      setRoomBoys([]);
    }
  };

  // Room status descriptions - derived from database statusOptions
  const roomStatusDescriptions = statusOptions.map((status, index) => ({
    no: index + 1,
    status: status.name,
    statusCode: status.code,
    color: status.color || '#6c757d',
    description: status.description || ''
  }));

  // All available room status codes from database
  const allStatusCodes = statusOptions.map(s => s.code);

  // Get room status color based on status code
  const getStatusColor = (status) => {
    const statusMap = {
      'co': '#000000',      // Checkout - black
      'c o': '#000000',     // Checkout - black
      'checkout': '#000000',
      'gc': '#808080',      // General Cleaning - gray
      'oo': '#ff0000',      // Out of Order - red
      'vd': '#ff8c00',      // Vacant Dirty - dark orange
      'vc': '#90ee90',      // Vacant Clean - light green
      'vr': '#008000',      // Vacant Ready - green
      'v r': '#008000',     // Vacant Ready - green
      'vacant ready': '#008000',  // Vacant Ready - green
      'vu': '#e6e6fa',      // Vacant Uncheck - lavender
      'ar': '#87ceeb',      // Arrival - sky blue
      'arrival': '#87ceeb', // Arrival - sky blue
      'available': '#008000', // Available - treated as Vacant Ready - green
      'ic': '#008080',      // Incognito - teal
      'dnd': '#0000ff',     // DND - blue
      'od': '#9acd32',      // Occupied Dirty - yellow green
      'mu': '#800080',      // Makeup Room - purple
      'oc': '#ff8c00',      // Occupied Clean - dark orange
      'or': '#1e90ff',      // Occupied Ready - dodger blue
      'occupied ready': '#1e90ff',  // Occupied Ready - dodger blue
      'hu': '#d3d3d3',      // House Use - light gray
      'so': '#ff69b4',      // Sleep Out - hot pink
      'sk': '#ffffff',      // Skipper - white
      'ed': '#ffff00',      // Expected Departure - yellow
    };
    
    const statusLower = (status || '').toLowerCase().trim();
    return statusMap[statusLower] || '#008000'; // Default to Vacant Ready green
  };

  // Get short status code from full status name
  const getShortStatus = (status) => {
    if (!status) return 'CO';
    
    const statusLower = status.toLowerCase().trim();
    
    // Check if it's already a short code (2-3 characters)
    if (status.length <= 3) {
      return status.toUpperCase();
    }
    
    // Map full status names to short codes
    const statusToCode = {
      'checkout': 'CO',
      'general cleaning': 'GC',
      'out of order': 'OO',
      'vacant dirty': 'VD',
      'vacant clean': 'VC',
      'vacant ready': 'VR',
      'vacant uncheck': 'VU',
      'arrival': 'AR',
      'available': 'VR',  // Map available to Vacant Ready
      'incognito': 'IC',
      'do not disturb': 'DND',
      'occupied dirty': 'OD',
      'makeup room': 'MU',
      'occupied clean': 'OC',
      'occupied ready': 'OR',
      'house use': 'HU',
      'sleep out': 'SO',
      'skipper': 'SK',
      'expected departure': 'ED'  
    };
    
    return statusToCode[statusLower] || status.toUpperCase();
  };

  // Get unique room types for filter
  const roomTypes = ['All Type', ...new Set(rooms.map(r => r.room_type).filter(Boolean))];
  
  // Get room statuses for filter - use all available status codes
  const roomStatuses = ['All Status', ...allStatusCodes];
  
  // Filter rooms first
  const filteredRooms = rooms.filter(room => {
    const matchesHotel = selectedHotel === 'ALL' || room.hotel_name === selectedHotel;
    const matchesType = selectedType === 'All Type' || room.room_type === selectedType;
    
    // Status matching - compare short codes
    let matchesStatus = selectedStatus === 'All Status';
    if (!matchesStatus) {
      const roomShortStatus = getShortStatus(room.status);
      const filterStatus = selectedStatus.toUpperCase().trim();
      matchesStatus = roomShortStatus === filterStatus;
    }
    
    return matchesHotel && matchesType && matchesStatus;
  });

  // Get room type counts by status - using only status codes from room status descriptions
  const getStatusCounts = () => {
    const counts = {
      CO: 0, GC: 0, OO: 0, VD: 0, VC: 0, VR: 0, VU: 0, AR: 0, IC: 0,
      DND: 0, OD: 0, MU: 0, OC: 0, OR: 0, HU: 0, SO: 0, SK: 0, ED: 0
    };
    
    filteredRooms.forEach(room => {
      // Use getShortStatus to normalize all status variations
      const normalizedStatus = getShortStatus(room.status);
      
      if (counts.hasOwnProperty(normalizedStatus)) {
        counts[normalizedStatus]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Handle room click
  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setModalRoomStatus(getShortStatus(room.status));
    setModalRoomBoy('');
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setModalRoomStatus('');
    setModalRoomBoy('');
  };

  // Handle process (update room status)
  const handleProcess = async () => {
    if (!modalRoomStatus) {
      alert('Please select a room status');
      return;
    }
    if (!modalRoomBoy) {
      alert('Please select a room boy');
      return;
    }
    
    try {
      setProcessing(true);
      // Update room status via API
      await apiService.updateHotelRoom(selectedRoom.room_number, {
        status: modalRoomStatus
      });
      
      console.log('Room status updated:', selectedRoom?.room_number, {
        status: modalRoomStatus,
        roomBoy: modalRoomBoy
      });
      
      alert(`Room ${selectedRoom.room_number} status updated to ${modalRoomStatus} by ${modalRoomBoy}`);
      
      // Close modal after successful update
      handleCloseModal();
      // Refresh rooms
      await fetchRooms();
    } catch (err) {
      console.error('Error updating room:', err);
      alert('Failed to update room status: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="status-kamar-container">
        {/* Tabs */}
        <div className="status-tabs">
          <button 
            className={`status-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
           ALL ROOM STATUS
          </button>
          <button 
            className={`status-tab ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            ROOM STATUS DESCRIPTION
          </button>
        </div>

        {activeTab === 'all' ? (
          <>
            {/* Status Summary Bar */}
            <div className="status-summary-bar">
              <span><strong>{statusCounts.CO} : CO</strong></span>
              <span><strong>{statusCounts.GC} : GC</strong></span>
              <span><strong>{statusCounts.OO} : OO</strong></span>
              <span><strong>{statusCounts.VD} : VD</strong></span>
              <span><strong>{statusCounts.VC} : VC</strong></span>
              <span><strong>{statusCounts.VR} : VR</strong></span>
              <span><strong>{statusCounts.VU} : VU</strong></span>
              <span><strong>{statusCounts.AR} : AR</strong></span>
              <span><strong>{statusCounts.IC} : IC</strong></span>
              <span><strong>{statusCounts.DND} : DND</strong></span>
              <span><strong>{statusCounts.OD} : OD</strong></span>
              <span><strong>{statusCounts.MU} : MU</strong></span>
              <span><strong>{statusCounts.OC} : OC</strong></span>
              <span><strong>{statusCounts.OR} : OR</strong></span>
              <span><strong>{statusCounts.HU} : HU</strong></span>
              <span><strong>{statusCounts.SO} : SO</strong></span>
              <span><strong>{statusCounts.SK} : SK</strong></span>
              <span><strong>{statusCounts.ED} : ED</strong></span>
              <span><strong>Total: {filteredRooms.length} Kamar</strong></span>
            </div>

            {/* Filters */}
            <div className="status-filters">
              <div className="filter-group">
                <label>Lookup :</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Hotel :</label>
                <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                  <option value="ALL">ALL</option>
                  {hotelOptions.map(hotel => (
                    <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Room Status :</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  {roomStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <button 
                  className="btn-refresh-data"
                  onClick={fetchRooms}
                  disabled={loading}
                  title="Refresh room data"
                >
                  🔄 {loading ? 'Updating...' : 'Update Data'}
                </button>
              </div>
            </div>

            {/* Room Grid */}
            <div className="room-grid">
              {loading ? (
                <div className="loading-message">Loading rooms...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : filteredRooms.length === 0 ? (
                <div className="no-data-message">No rooms found</div>
              ) : (
                filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className="room-box"
                    style={{ backgroundColor: getStatusColor(room.status) }}
                    onClick={() => handleRoomClick(room)}
                  >
                    <div className="room-type">{room.room_type}</div>
                    <div className="room-number">{room.room_number}</div>
                    <div className="room-status">{getShortStatus(room.status)}</div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Description Tab */
          <div className="status-description-container">
            <div className="description-two-columns">
              {/* Left Column - Items 1-9 */}
              <div className="description-column">
                <table className="description-table-single">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>No</th>
                      <th style={{ width: '180px' }}>Room Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomStatusDescriptions.slice(0, 9).map((item) => (
                      <tr key={item.no}>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.no}</td>
                        <td>
                          <div className="status-badge" style={{ 
                            backgroundColor: item.color,
                            color: item.color === '#ffffff' ? '#000000' : '#ffffff',
                            border: item.color === '#ffffff' ? '2px solid #000000' : 'none'
                          }}>
                            {item.status}
                          </div>
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Column - Items 10-18 */}
              <div className="description-column">
                <table className="description-table-single">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>No</th>
                      <th style={{ width: '180px' }}>Room Status</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomStatusDescriptions.slice(9).map((item) => (
                      <tr key={item.no}>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.no}</td>
                        <td>
                          <div className="status-badge" style={{ 
                            backgroundColor: item.color,
                            color: item.color === '#ffffff' ? '#000000' : '#ffffff',
                            border: item.color === '#ffffff' ? '2px solid #000000' : 'none'
                          }}>
                            {item.status}
                          </div>
                        </td>
                        <td>{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Room Details */}
        {showModal && selectedRoom && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>ROOM {selectedRoom.room_number}</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Room Status : <span className="required">*</span> Required</label>
                  <select 
                    value={modalRoomStatus} 
                    onChange={(e) => setModalRoomStatus(e.target.value)}
                    className="modal-select"
                  >
                    <option value="">---Room Status--</option>
                    <option value="CO">Checkout</option>
                    <option value="GC">General Cleaning</option>
                    <option value="OO">Out Of Order</option>
                    <option value="VD">Vacant Dirty</option>
                    <option value="VC">Vacant Clean</option>
                    <option value="VR">Vacant Ready</option>
                    <option value="VU">Vacant Uncheck</option>
                    <option value="AR">Arrival</option>
                    <option value="IC">Incognito</option>
                    <option value="DND">DND (Do Not Disturb)</option>
                    <option value="OD">Occupied Dirty</option>
                    <option value="MU">Makeup Room</option>
                    <option value="OC">Occupied Clean</option>
                    <option value="OR">Occupied Ready</option>
                    <option value="HU">House Use</option>
                    <option value="SO">Sleep Out</option>
                    <option value="SK">Skipper</option>
                    <option value="ED">Expected Departure</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Room Boy : <span className="required">*</span> Required</label>
                  <select 
                    value={modalRoomBoy} 
                    onChange={(e) => setModalRoomBoy(e.target.value)}
                    className="modal-select"
                  >
                    <option value="">---Select Room Boy---</option>
                    {roomBoys.length > 0 ? (
                      roomBoys.map((user) => (
                        <option key={user.id} value={user.full_name || user.username}>
                          {user.full_name || user.username}
                        </option>
                      ))
                    ) : (
                      <option value="Room Attendant">Room Attendant (Default)</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-close" onClick={handleCloseModal}>Close</button>
                <button className="btn-proses" onClick={handleProcess} disabled={processing}>
                  {processing ? 'Processing...' : 'Proses'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StatusKamarHP;
