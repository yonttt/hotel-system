import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import Layout from '../../../components/Layout';

const StatusKamarFO = () => {
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
      'co': '#000000', 'c o': '#000000', 'checkout': '#000000',
      'gc': '#808080',
      'oo': '#ff0000',
      'vd': '#ff8c00',
      'vc': '#90ee90',
      'vr': '#008000', 'v r': '#008000',
      'vu': '#e6e6fa',
      'ar': '#87ceeb',
      'ic': '#008080',
      'dnd': '#0000ff',
      'od': '#9acd32',
      'mu': '#800080',
      'oc': '#ff8c00',
      'or': '#1e90ff',
      'hu': '#d3d3d3',
      'so': '#ff69b4',
      'sk': '#ffffff',
      'ed': '#ffff00',
      '1': '#0000ff', '2': '#1e90ff', '3': '#008080',
    };
    
    const statusLower = (status || '').toLowerCase().trim();
    return statusMap[statusLower] || '#808080';
  };

  // Get short status code from full status name
  const getShortStatus = (status) => {
    if (!status) return 'CO';
    if (status.length <= 3) return status.toUpperCase();
    
    const statusToCode = {
      'checkout': 'CO', 'general cleaning': 'GC', 'out of order': 'OO',
      'vacant dirty': 'VD', 'vacant clean': 'VC', 'vacant ready': 'VR', 'v r': 'VR',
      'vacant uncheck': 'VU', 'arrival': 'AR', 'incognito': 'IC',
      'do not disturb': 'DND', 'dnd': 'DND', 'occupied dirty': 'OD',
      'makeup room': 'MU', 'occupied clean': 'OC', 'occupied ready': 'OR',
      'house use': 'HU', 'sleep out': 'SO', 'skipper': 'SK',
      'expected departure': 'ED'
    };
    
    return statusToCode[status.toLowerCase()] || status.toUpperCase().substring(0, 3);
  };

  // Group rooms by floor
  const getRoomsByFloor = () => {
    const filteredRooms = rooms.filter(room => {
      const matchesType = selectedType === 'All Type' || room.room_type === selectedType;
      const matchesStatus = selectedStatus === 'All Status' || room.status === selectedStatus;
      return matchesType && matchesStatus;
    });

    const grouped = filteredRooms.reduce((acc, room) => {
      const floor = room.floor_number || 'Unknown';
      if (!acc[floor]) acc[floor] = [];
      acc[floor].push(room);
      return acc;
    }, {});

    return Object.entries(grouped).sort(([a], [b]) => {
      if (a === 'Unknown') return 1;
      if (b === 'Unknown') return -1;
      return Number(a) - Number(b);
    });
  };

  // Get unique room types
  const getRoomTypes = () => {
    const types = [...new Set(rooms.map(room => room.room_type).filter(Boolean))];
    return ['All Type', ...types];
  };

  // Get unique statuses
  const getStatuses = () => {
    const statuses = [...new Set(rooms.map(room => room.status).filter(Boolean))];
    return ['All Status', ...statuses];
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>Loading rooms...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '20px', color: 'red' }}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px' 
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
            STATUS KAMAR FO
          </h1>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Hotel:</span>
            <select
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option>HOTEL NEW IDOLA</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'all' ? '#007bff' : 'transparent',
              color: activeTab === 'all' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'all' ? '3px solid #007bff' : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            All Room
          </button>
          <button
            onClick={() => setActiveTab('description')}
            style={{
              padding: '10px 20px',
              background: activeTab === 'description' ? '#007bff' : 'transparent',
              color: activeTab === 'description' ? 'white' : '#666',
              border: 'none',
              borderBottom: activeTab === 'description' ? '3px solid #007bff' : 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Description
          </button>
        </div>

        {/* Content */}
        {activeTab === 'all' ? (
          <div>
            {/* Filters */}
            <div style={{ 
              display: 'flex', 
              gap: '15px', 
              marginBottom: '20px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <div>
                <label style={{ fontSize: '14px', color: '#666', marginBottom: '5px', display: 'block' }}>
                  Room Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minWidth: '150px'
                  }}
                >
                  {getRoomTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#666', marginBottom: '5px', display: 'block' }}>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minWidth: '150px'
                  }}
                >
                  {getStatuses().map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Grid by Floor */}
            {getRoomsByFloor().map(([floor, floorRooms]) => (
              <div key={floor} style={{ marginBottom: '30px' }}>
                <h2 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '15px',
                  color: '#333'
                }}>
                  Floor {floor}
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '10px'
                }}>
                  {floorRooms.map(room => (
                    <div
                      key={room.id}
                      style={{
                        background: getStatusColor(room.status),
                        color: getStatusColor(room.status) === '#ffffff' ? '#000' : '#fff',
                        padding: '15px',
                        borderRadius: '4px',
                        textAlign: 'center',
                        border: getStatusColor(room.status) === '#ffffff' ? '2px solid #000' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
                        {room.room_number}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>
                        {getShortStatus(room.status)}
                      </div>
                      <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '3px' }}>
                        {room.room_type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>No</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Code</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>Color</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {roomStatusDescriptions.map((item) => (
                  <tr key={item.no} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{item.no}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{item.status}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        background: item.color,
                        color: item.color === '#ffffff' ? '#000' : '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: item.color === '#ffffff' ? '1px solid #000' : 'none'
                      }}>
                        {item.statusCode}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: item.color,
                        borderRadius: '4px',
                        margin: '0 auto',
                        border: item.color === '#ffffff' ? '1px solid #000' : '1px solid #ddd'
                      }} />
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StatusKamarFO;
