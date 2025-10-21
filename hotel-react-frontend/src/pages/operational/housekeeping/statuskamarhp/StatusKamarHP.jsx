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

  useEffect(() => {
    fetchRooms();
  }, []);

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

  // Room status descriptions
  const roomStatusDescriptions = [
    { no: 1, status: 'Checkout', statusCode: 'CO', color: '#000000', description: 'Tamu baru saja checkout' },
    { no: 2, status: 'General Cleaning', statusCode: 'GC', color: '#808080', description: 'Kamar dalam tahap pembersihan global / Pesto Control' },
    { no: 3, status: 'Out Of Order', statusCode: 'OO', color: '#ff0000', description: 'Kamar rusak (Tidak dapat dijual)' },
    { no: 4, status: 'Vacant Dirty', statusCode: 'VD', color: '#ff8c00', description: 'Kamar checkout yang sudah diassign room attendant untuk membersihkan kamar' },
    { no: 5, status: 'Vacant Clean', statusCode: 'VC', color: '#90ee90', description: 'Kamar yang sudah dibersihkan room attendant namun belum dicek oleh Leader HK' },
    { no: 6, status: 'Vacant Ready', statusCode: 'VR', color: '#008000', description: 'Kamar yang sudah dicek kelengkapannya dan siap untuk dijual' },
    { no: 7, status: 'Vacant Uncheck', statusCode: 'VU', color: '#e6e6fa', description: 'Kamar yang harus dibersihkan/dicek kelengkapannya jika kamar blm terjual setelah melalui night audit' },
    { no: 8, status: 'Arrival', statusCode: 'AR', color: '#87ceeb', description: 'Kamar reservasi yang akan menginap pada H-0' },
    { no: 9, status: 'Incognito', statusCode: 'IC', color: '#008080', description: 'Tamu yang ingin dirahasiakan keberadaannya' },
    { no: 10, status: 'DND (Do Not Disturb)', statusCode: 'DND', color: '#0000ff', description: 'Kamar terisi dan tamu meminta untuk tidak diganggu' },
    { no: 11, status: 'Occupied Dirty', statusCode: 'OD', color: '#9acd32', description: 'Kamar terisi (extend) yang akan diassign room attendant untuk membersihkan kamar' },
    { no: 12, status: 'Makeup Room', statusCode: 'MU', color: '#800080', description: 'Kamar terisi yang telah di assign room attendant untuk membersihkan kamar' },
    { no: 13, status: 'Occupied Clean', statusCode: 'OC', color: '#ff8c00', description: 'Kamar terisi dan telah selesai dibersihkan oleh room attendant' },
    { no: 14, status: 'Occupied Ready', statusCode: 'OR', color: '#1e90ff', description: 'Kamar terisi dan sudah dibersihkan/tamu baru saja checkin' },
    { no: 15, status: 'House Use', statusCode: 'HU', color: '#d3d3d3', description: 'Kamar yang digunakan oleh staff hotel' },
    { no: 16, status: 'Sleep Out', statusCode: 'SO', color: '#ff69b4', description: 'Kamar yang sudah dibayar oleh tamu dan tidak ditempati' },
    { no: 17, status: 'Skipper', statusCode: 'SK', color: '#ffffff', description: 'Tamu yang meninggalkan kamar tanpa ada informasi dari Front Office' },
    { no: 18, status: 'Expected Departure', statusCode: 'ED', color: '#ffff00', description: 'Kamar yang akan checkout' }
  ];

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
      'v r': '#008000',
      'vu': '#e6e6fa',      // Vacant Uncheck - lavender
      'ar': '#87ceeb',      // Arrival - sky blue
      'ic': '#008080',      // Incognito - teal
      'dnd': '#0000ff',     // DND - blue
      'od': '#9acd32',      // Occupied Dirty - yellow green
      'mu': '#800080',      // Makeup Room - purple
      'oc': '#ff8c00',      // Occupied Clean - dark orange
      'or': '#1e90ff',      // Occupied Ready - dodger blue
      'hu': '#d3d3d3',      // House Use - light gray
      'so': '#ff69b4',      // Sleep Out - hot pink
      'sk': '#ffffff',      // Skipper - white
      'ed': '#ffff00',      // Expected Departure - yellow
      '1': '#0000ff',       // Number status
      '2': '#1e90ff',
      '3': '#008080',
    };
    
    const statusLower = (status || '').toLowerCase().trim();
    return statusMap[statusLower] || '#808080'; // Default gray
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
  
  // Get unique statuses for filter - show short codes
  const roomStatuses = ['All Status', ...new Set(rooms.map(r => getShortStatus(r.status)).filter(Boolean))];
  
  // Get room type counts by status
  const getStatusCounts = () => {
    const counts = {
      VD: 0, VC: 0, VR: 0, OR: 0, BO: 0, OD: 0, MU: 0, OC: 0,
      HU: 0, SO: 0, DND: 0, Checkout: 0, VU: 0, Maintanece: 0, OO: 0
    };
    
    filteredRooms.forEach(room => {
      const status = (room.status || '').toUpperCase().trim();
      if (status === 'CO' || status === 'C O') {
        counts.Checkout++;
      } else if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  };

  // Filter rooms
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

  const statusCounts = getStatusCounts();

  return (
    <Layout>
      <div className="status-kamar-container">
        {/* Tabs */}
        <div className="status-tabs">
          <button 
            className={`status-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📊 ALL ROOM STATUS
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
              <span><strong>{statusCounts.VD} : VD</strong></span>
              <span><strong>{statusCounts.VC} : VC</strong></span>
              <span><strong>{statusCounts.VR} : VR</strong></span>
              <span><strong>{statusCounts.OR} : OR</strong></span>
              <span><strong>{statusCounts.BO} : BO</strong></span>
              <span><strong>{statusCounts.OD} : OD</strong></span>
              <span><strong>{statusCounts.MU} : MU</strong></span>
              <span><strong>{statusCounts.OC} : OC</strong></span>
              <span><strong>{statusCounts.HU} : HU</strong></span>
              <span><strong>{statusCounts.SO} : SO</strong></span>
              <span><strong>{statusCounts.DND} : DND</strong></span>
              <span><strong>{statusCounts.Checkout} : Checkout</strong></span>
              <span><strong>{statusCounts.VU} : VU</strong></span>
              <span><strong>{statusCounts.Maintanece} : Maintanece</strong></span>
              <span><strong>{statusCounts.OO} : OO</strong></span>
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
                  <option value="HOTEL NEW IDOLA">HOTEL NEW IDOLA</option>
                  <option value="HOTEL IDOLA">HOTEL IDOLA</option>
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
      </div>
    </Layout>
  );
};

export default StatusKamarHP;
