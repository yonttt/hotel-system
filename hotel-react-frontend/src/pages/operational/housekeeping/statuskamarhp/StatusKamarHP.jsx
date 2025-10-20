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
    { no: 1, status: 'Checkout', color: 'black', description: 'Tamu baru saja checkout' },
    { no: 2, status: 'General Cleaning', color: '#808080', description: 'Kamar dalam tahap pembersihan global / Pesto Control' },
    { no: 3, status: 'Out Of Order', color: '#ff0000', description: 'Kamar rusak (Tidak dapat dijual)' },
    { no: 4, status: 'Vacant Dirty', color: '#ff8c00', description: 'Kamar checkout yang sudah diassign room attendant untuk membersihkan kamar' },
    { no: 5, status: 'Vacant Clean', color: '#90ee90', description: 'Kamar yang sudah dibersihkan room attendant namun belum dicek oleh Leader HK' },
    { no: 6, status: 'Vacant Ready', color: '#008000', description: 'Kamar yang sudah dicek kelengkapannya dan siap untuk dijual' },
    { no: 7, status: 'Vacant Uncheck', color: '#e6e6fa', description: 'Kamar yang harus dibersihkan/dicek kelengkapannya jika kamar blm terjual setelah melalui night audit' },
    { no: 8, status: 'Arrival', color: '#87ceeb', description: 'Kamar reservasi yang akan menginap pada H-0' },
    { no: 9, status: 'Incognito', color: '#008080', description: 'Tamu yang ingin dirahasiakan keberadaannya' },
    { no: 10, status: 'DND (Do Not Disturb)', color: '#0000ff', description: 'Kamar terisi dan tamu meminta untuk tidak diganggu' },
    { no: 11, status: 'Occupied Dirty', color: '#9acd32', description: 'Kamar terisi (extend) yang akan diassign room attendant untuk membersihkan kamar' },
    { no: 12, status: 'Makeup Room', color: '#800080', description: 'Kamar terisi yang telah di assign room attendant untuk membersihkan kamar' },
    { no: 13, status: 'Occupied clean', color: '#ff8c00', description: 'Kamar terisi dan telah selesai dibersihkan oleh room attendant' },
    { no: 14, status: 'Occupied Ready', color: '#1e90ff', description: 'Kamar terisi dan sudah dibersihkan/tamu baru saja checkin' },
    { no: 15, status: 'House Use', color: '#d3d3d3', description: 'Kamar yang digunakan oleh staff hotel' },
    { no: 16, status: 'Sleep Out', color: '#ff69b4', description: 'Kamar yang sudah dibayar oleh tamu dan tidak ditempati' },
    { no: 17, status: 'Skipper', color: '#ffffff', description: 'Tamu yang meninggalkan kamar tanpa ada informasi dari Front Office' },
    { no: 18, status: 'Expected Departure', color: '#ffff00', description: 'Kamar yang akan checkout' }
  ];

  // Get room status color
  const getStatusColor = (status) => {
    const statusMap = {
      'checkout': 'black',
      'co': 'black',
      'c o': 'black',
      'vr': '#008000', // Vacant Ready - green
      'v r': '#008000',
      'vacant ready': '#008000',
      'arrival': '#87ceeb',
      '1': '#0000ff', // DND
      '2': '#1e90ff', // Occupied Ready
      '3': '#008080', // Incognito
      '6': '#0000ff', // SPR (assuming DND)
    };
    
    const statusLower = (status || '').toLowerCase().trim();
    return statusMap[statusLower] || '#808080'; // Default gray
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesHotel = selectedHotel === 'ALL' || room.hotel_name === selectedHotel;
    const matchesType = selectedType === 'All Type' || room.room_type === selectedType;
    const matchesStatus = selectedStatus === 'All Status' || room.status === selectedStatus;
    return matchesHotel && matchesType && matchesStatus;
  });

  // Get room type counts
  const getTypeCounts = () => {
    const counts = {
      VD: 0, VC: 0, VR: 0, OR: 0, BO: 0, OD: 0, MU: 0, OC: 0,
      HU: 0, SO: 0, DND: 0, Checkout: 0, VU: 0, Maintanece: 0, OO: 0
    };
    
    filteredRooms.forEach(room => {
      const status = (room.status || '').toUpperCase().trim();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  };

  const typeCounts = getTypeCounts();

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
              <span><strong>0 : VD</strong></span>
              <span><strong>0 : VC</strong></span>
              <span><strong>35 : VR</strong></span>
              <span><strong>17: OR</strong></span>
              <span><strong>0 : BO</strong></span>
              <span><strong>1 : OD</strong></span>
              <span><strong>0 : MU</strong></span>
              <span><strong>0 : OC</strong></span>
              <span><strong>8 : C</strong></span>
              <span><strong>0 : HU</strong></span>
              <span><strong>0 : SO</strong></span>
              <span><strong>0 : DND</strong></span>
              <span><strong>73 : Checkout</strong></span>
              <span><strong>0 : VU</strong></span>
              <span><strong>0 : Maintanece</strong></span>
              <span><strong>0 : O O</strong></span>
            </div>

            {/* Filters */}
            <div className="status-filters">
              <div className="filter-group">
                <label>Lookup :</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option>All Type</option>
                  <option>APT</option>
                  <option>BIS</option>
                  <option>DLX</option>
                  <option>EXE</option>
                  <option>SPR</option>
                  <option>STD</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Hotel :</label>
                <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                  <option>HOTEL NEW IDOLA</option>
                  <option>HOTEL IDOLA</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Room Status :</label>
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                  <option>All Status</option>
                  <option>VR</option>
                  <option>C O</option>
                  <option>V R</option>
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
                    <div className="room-status">{room.status || 'C O'}</div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Description Tab */
          <div className="status-description-container">
            <table className="description-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Room Status</th>
                  <th>Description</th>
                  <th>No</th>
                  <th>Room Status</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(roomStatusDescriptions.length / 2) }).map((_, idx) => {
                  const leftItem = roomStatusDescriptions[idx * 2];
                  const rightItem = roomStatusDescriptions[idx * 2 + 1];
                  return (
                    <tr key={idx}>
                      <td>{leftItem.no}</td>
                      <td>
                        <div className="status-badge" style={{ backgroundColor: leftItem.color }}>
                          {leftItem.status}
                        </div>
                      </td>
                      <td>{leftItem.description}</td>
                      {rightItem ? (
                        <>
                          <td>{rightItem.no}</td>
                          <td>
                            <div className="status-badge" style={{ backgroundColor: rightItem.color }}>
                              {rightItem.status}
                            </div>
                          </td>
                          <td>{rightItem.description}</td>
                        </>
                      ) : (
                        <>
                          <td></td>
                          <td></td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StatusKamarHP;
