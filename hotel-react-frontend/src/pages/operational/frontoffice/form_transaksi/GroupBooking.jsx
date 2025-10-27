import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'
import SearchableSelect from '../../../../components/SearchableSelect'

const GroupBooking = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Reference data
  const [rooms, setRooms] = useState([])
  const [availableRooms, setAvailableRooms] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])

  // Group information
  const [groupInfo, setGroupInfo] = useState({
    group_name: '',
    group_pic: '',
    pic_phone: '',
    pic_email: '',
    arrival_date: new Date().toISOString().split('T')[0],
    departure_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    nights: 1,
    payment_method: '',
    total_deposit: 0,
    notes: ''
  });

  // Room bookings array
  const [roomBookings, setRoomBookings] = useState([
    {
      id: 1,
      room_number: '',
      room_type: '',
      guest_name: '',
      guest_title: 'MR',
      id_card_type: 'KTP',
      id_card_number: '',
      mobile_phone: '',
      nationality: 'INDONESIA',
      city: '',
      address: '',
      guest_count_male: 1,
      guest_count_female: 0,
      guest_count_child: 0,
      extra_bed: 0,
      rate: 0,
      discount: 0,
      subtotal: 0,
    }
  ]);

  // Load reference data
  useEffect(() => {
    loadReferenceData();
  }, []);

  // Calculate nights when dates change OR departure when nights changes
  useEffect(() => {
    if (groupInfo.arrival_date && groupInfo.departure_date) {
      calculateNights()
    }
  }, [groupInfo.arrival_date, groupInfo.departure_date])

  // Calculate departure date when nights changes
  useEffect(() => {
    if (groupInfo.arrival_date && groupInfo.nights > 0) {
      const arrival = new Date(groupInfo.arrival_date)
      const departure = new Date(arrival)
      departure.setDate(departure.getDate() + groupInfo.nights)
      setGroupInfo(prev => ({
        ...prev,
        departure_date: departure.toISOString().split('T')[0]
      }))
    }
  }, [groupInfo.arrival_date, groupInfo.nights])

  // Filter available rooms
  useEffect(() => {
    filterAvailableRooms();
  }, [rooms, groupInfo.arrival_date, groupInfo.departure_date, roomBookings]);

  const loadReferenceData = async () => {
    setError('')
    try {
      const results = await Promise.allSettled([
        apiService.getRoomsByStatus('available'),
        apiService.getPaymentMethods(),
        apiService.getCities(),
        apiService.getCountries()
      ])

      const getDataOrDefault = (result, defaultValue = []) =>
        result.status === 'fulfilled' && result.value.data ? (result.value.data.data || result.value.data) : defaultValue

      const roomsData = getDataOrDefault(results[0])
      console.log('Loaded rooms from database:', roomsData)
      console.log('Sample room:', roomsData[0])
      
      setRooms(roomsData)
      setPaymentMethods(getDataOrDefault(results[1]))
      setCities(getDataOrDefault(results[2]))
      setCountries(getDataOrDefault(results[3]))
    } catch (err) {
      setError('Failed to load reference data: ' + err.message)
    }
  }

  const filterAvailableRooms = () => {
    const selectedRoomNumbers = roomBookings.map(rb => rb.room_number).filter(Boolean)
    // getRoomsByStatus already filters for available rooms, just remove selected ones
    const available = rooms.filter(room => 
      !selectedRoomNumbers.includes(room.room_number)
    )
    setAvailableRooms(available)
  }

  const calculateNights = () => {
    if (groupInfo.arrival_date && groupInfo.departure_date) {
      const arrival = new Date(groupInfo.arrival_date);
      const departure = new Date(groupInfo.departure_date);
      const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
      setGroupInfo(prev => ({ ...prev, nights: nights > 0 ? nights : 1 }));
    }
  };

  const addRoom = () => {
    setRoomBookings([
      ...roomBookings,
      {
        id: Date.now(),
        room_number: '',
        room_type: '',
        guest_name: '',
        guest_title: 'MR',
        id_card_type: 'KTP',
        id_card_number: '',
        mobile_phone: '',
        nationality: 'INDONESIA',
        city: '',
        address: '',
        guest_count_male: 1,
        guest_count_female: 0,
        guest_count_child: 0,
        extra_bed: 0,
        rate: 0,
        discount: 0,
        subtotal: 0,
      }
    ]);
  };

  const removeRoom = (id) => {
    if (roomBookings.length > 1) {
      setRoomBookings(roomBookings.filter(rb => rb.id !== id));
    }
  };

  const updateRoomBooking = async (id, field, value) => {
    if (field === 'room_number') {
      // Handle room selection with pricing fetch
      const selectedRoom = rooms.find(r => r.room_number === value)
      
      if (selectedRoom) {
        try {
          // Fetch room pricing from database
          const pricingResponse = await apiService.getRoomPricing(selectedRoom.room_type)
          const rate = pricingResponse.data?.current_rate 
            ? parseFloat(pricingResponse.data.current_rate)
            : parseFloat(selectedRoom.rate) || 0
          
          setRoomBookings(roomBookings.map(rb => {
            if (rb.id === id) {
              const updated = {
                ...rb,
                room_number: value,
                room_type: selectedRoom.room_type,
                rate: rate
              }
              const discount = parseFloat(updated.discount) || 0
              updated.subtotal = (rate - discount) * groupInfo.nights
              return updated
            }
            return rb
          }))
        } catch (error) {
          console.error('Error fetching room pricing:', error)
          // Fallback to room's rate
          const rate = parseFloat(selectedRoom.rate) || 0
          setRoomBookings(roomBookings.map(rb => {
            if (rb.id === id) {
              const updated = {
                ...rb,
                room_number: value,
                room_type: selectedRoom.room_type,
                rate: rate
              }
              const discount = parseFloat(updated.discount) || 0
              updated.subtotal = (rate - discount) * groupInfo.nights
              return updated
            }
            return rb
          }))
        }
      }
    } else {
      // Handle other field updates
      setRoomBookings(roomBookings.map(rb => {
        if (rb.id === id) {
          const updated = { ...rb, [field]: value }
          
          // Recalculate subtotal for rate/discount changes
          if (field === 'rate' || field === 'discount') {
            const rate = parseFloat(updated.rate) || 0
            const discount = parseFloat(updated.discount) || 0
            updated.subtotal = (rate - discount) * groupInfo.nights
          }
          
          return updated
        }
        return rb
      }))
    }
  }

  const copyGuestInfo = (fromId) => {
    const sourceRoom = roomBookings.find(rb => rb.id === fromId);
    if (!sourceRoom) return;

    setRoomBookings(roomBookings.map(rb => {
      if (rb.id !== fromId && !rb.guest_name) {
        return {
          ...rb,
          guest_name: sourceRoom.guest_name,
          guest_title: sourceRoom.guest_title,
          id_card_type: sourceRoom.id_card_type,
          id_card_number: sourceRoom.id_card_number,
          mobile_phone: sourceRoom.mobile_phone,
          nationality: sourceRoom.nationality,
          city: sourceRoom.city,
          address: sourceRoom.address,
        };
      }
      return rb;
    }));
  };

  const getTotalAmount = () => {
    return roomBookings.reduce((sum, rb) => sum + (rb.subtotal || 0), 0);
  };

  const formatCities = () => {
    return [
      { value: '', label: '--City--' },
      ...cities.map(city => ({
        value: city.city_name || city.name,
        label: city.city_name || city.name
      }))
    ]
  }

  const formatCountries = () => {
    return [
      { value: 'INDONESIA', label: 'INDONESIA' },
      ...countries.filter(c => (c.name || c.nationality) !== 'INDONESIA').map(country => ({
        value: country.name || country.nationality,
        label: country.name || country.nationality
      }))
    ]
  }

  const formatPaymentMethods = () => {
    return [
      { value: '', label: 'Select Payment Method' },
      ...paymentMethods.map(pm => ({
        value: pm.method_name || pm.name,
        label: pm.method_name || pm.name
      }))
    ]
  }

  const formatRooms = (currentRoomNumber = null) => {
    console.log('Available rooms for dropdown:', availableRooms)
    
    // Include currently selected room if it exists
    let roomsToShow = [...availableRooms]
    if (currentRoomNumber) {
      const currentRoom = rooms.find(r => r.room_number === currentRoomNumber)
      if (currentRoom && !roomsToShow.find(r => r.room_number === currentRoomNumber)) {
        roomsToShow = [currentRoom, ...roomsToShow]
      }
    }
    
    const formatted = [
      { value: '', label: 'None selected' },
      ...roomsToShow.map(room => ({
        value: room.room_number,
        label: `${room.room_number} - ${room.room_type}${room.floor_number ? ` (Floor ${room.floor_number})` : ''}${room.hit_count ? ` - Hit: ${room.hit_count}` : ''}`
      }))
    ]
    console.log('Formatted room options:', formatted)
    return formatted
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!groupInfo.group_name) {
      setError('Group name is required')
      return
    }

    if (!groupInfo.payment_method) {
      setError('Payment method is required')
      return
    }

    const invalidRooms = roomBookings.filter(rb => !rb.room_number || !rb.guest_name)
    if (invalidRooms.length > 0) {
      setError('All rooms must have room number and guest name filled')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Prepare group booking data
      const bookingData = {
        group_name: groupInfo.group_name,
        group_pic: groupInfo.group_pic,
        pic_phone: groupInfo.pic_phone,
        pic_email: groupInfo.pic_email,
        arrival_date: groupInfo.arrival_date,
        departure_date: groupInfo.departure_date,
        nights: groupInfo.nights,
        payment_method: groupInfo.payment_method,
        total_deposit: parseFloat(groupInfo.total_deposit) || 0,
        notes: groupInfo.notes,
        created_by: user?.username || 'ADMIN',
        hotel_name: 'New Idola Hotel',
        rooms: roomBookings.map(room => ({
          room_number: room.room_number,
          room_type: room.room_type,
          guest_name: room.guest_name,
          guest_title: room.guest_title,
          id_card_type: room.id_card_type,
          id_card_number: room.id_card_number,
          mobile_phone: room.mobile_phone,
          nationality: room.nationality,
          city: room.city,
          address: room.address,
          guest_count_male: room.guest_count_male,
          guest_count_female: room.guest_count_female,
          guest_count_child: room.guest_count_child,
          extra_bed: room.extra_bed,
          rate: parseFloat(room.rate) || 0,
          discount: parseFloat(room.discount) || 0,
          subtotal: parseFloat(room.subtotal) || 0
        }))
      }

      const response = await apiService.createGroupBooking(bookingData)
      
      setSuccess(`Successfully created group booking!\nGroup ID: ${response.data.group_booking_id}\nTotal Rooms: ${response.data.total_rooms}\nTotal Amount: Rp ${response.data.total_amount.toLocaleString()}`)
      
      // Reset form
      setGroupInfo({
        group_name: '',
        group_pic: '',
        pic_phone: '',
        pic_email: '',
        arrival_date: new Date().toISOString().split('T')[0],
        departure_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        nights: 1,
        payment_method: '',
        total_deposit: 0,
        notes: ''
      })
      setRoomBookings([{
        id: Date.now(),
        room_number: '',
        room_type: '',
        guest_name: '',
        guest_title: 'MR',
        id_card_type: 'KTP',
        id_card_number: '',
        mobile_phone: '',
        nationality: 'INDONESIA',
        city: '',
        address: '',
        guest_count_male: 1,
        guest_count_female: 0,
        guest_count_child: 0,
        extra_bed: 0,
        rate: 0,
        discount: 0,
        subtotal: 0,
      }])

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err) {
      setError('Failed to create group booking: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="registration-container">
        <div className="registration-header">
          <h1 className="registration-title">GROUP BOOKING FORM</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              className="tab-button blue-button"
              onClick={() => navigate('/operational/frontoffice/form-transaksi/registrasi')}
              style={{ background: '#6c757d' }}
            >
              ← Back to Registration
            </button>
            <button 
              type="button" 
              className="tab-button blue-button"
              onClick={() => navigate('/operational/frontoffice/form-transaksi/reservasi')}
              style={{ background: '#6c757d' }}
            >
              ← Back to Reservation
            </button>
            <button type="button" className="tab-button active blue-button">Group Reservation</button>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '15px',
            background: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>{error}</div>
        )}

        {success && (
          <div style={{
            padding: '15px',
            background: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '20px',
            whiteSpace: 'pre-line'
          }}>{success}</div>
        )}

        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid">
                {/* COLUMN 1 */}
                <div className="form-column">
                  <div className="form-group">
                    <label>Group Name</label>
                    <input
                      type="text"
                      className={`form-input ${!groupInfo.group_name ? 'required-field' : ''}`}
                      value={groupInfo.group_name}
                      onChange={(e) => setGroupInfo({...groupInfo, group_name: e.target.value})}
                      placeholder="Required*"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>PIC Name</label>
                    <input
                      type="text"
                      className={`form-input ${!groupInfo.group_pic ? 'required-field' : ''}`}
                      value={groupInfo.group_pic}
                      onChange={(e) => setGroupInfo({...groupInfo, group_pic: e.target.value})}
                      placeholder="Required*"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>PIC Phone</label>
                    <input
                      type="tel"
                      className={`form-input ${!groupInfo.pic_phone ? 'required-field' : ''}`}
                      value={groupInfo.pic_phone}
                      onChange={(e) => setGroupInfo({...groupInfo, pic_phone: e.target.value})}
                      placeholder="Required*"
                      required
                    />
                  </div>
                </div>

                {/* COLUMN 2 */}
                <div className="form-column">
                  <div className="form-group">
                    <label>PIC Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={groupInfo.pic_email}
                      onChange={(e) => setGroupInfo({...groupInfo, pic_email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Arrival Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={groupInfo.arrival_date}
                      onChange={(e) => setGroupInfo({...groupInfo, arrival_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Departure Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={groupInfo.departure_date}
                      onChange={(e) => setGroupInfo({...groupInfo, departure_date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* COLUMN 3 */}
                <div className="form-column">
                  <div className="form-group">
                    <label>Nights</label>
                    <select
                      name="nights"
                      className="form-select"
                      value={groupInfo.nights}
                      onChange={(e) => {
                        const nights = parseInt(e.target.value)
                        setGroupInfo({...groupInfo, nights})
                        // Recalculate subtotals for all rooms
                        setRoomBookings(roomBookings.map(rb => ({
                          ...rb,
                          subtotal: (parseFloat(rb.rate) - parseFloat(rb.discount || 0)) * nights
                        })))
                      }}
                    >
                      {[...Array(30).keys()].map(n => (
                        <option key={n + 1} value={n + 1}>{n + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Payment Method <span style={{color: 'red'}}>*</span></label>
                    <SearchableSelect
                      name="payment_method"
                      value={groupInfo.payment_method}
                      onChange={(e) => setGroupInfo({...groupInfo, payment_method: e.target.value})}
                      options={formatPaymentMethods()}
                      placeholder="Search payment method..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Deposit (Rp)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={groupInfo.total_deposit}
                      onChange={(e) => setGroupInfo({...groupInfo, total_deposit: e.target.value})}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Notes</label>
                <textarea
                  className="form-input"
                  value={groupInfo.notes}
                  onChange={(e) => setGroupInfo({...groupInfo, notes: e.target.value})}
                  rows="2"
                />
              </div>

            {/* Room Bookings Section */}
            <div className="form-grid">
              <div className="form-column" style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#343a40',
                    margin: 0
                  }}>ROOM BOOKINGS ({roomBookings.length})</h3>
                  <button
                    type="button"
                    onClick={addRoom}
                    className="blue-button"
                    style={{
                      padding: '8px 16px',
                      background: '#28a745',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    + Add Room
                  </button>
                </div>
              </div>

              {roomBookings.map((room, index) => (
                <React.Fragment key={room.id}>
                  <div className="form-column" style={{ gridColumn: '1 / -1', background: '#f8f9fa', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#495057',
                        margin: 0
                      }}>Room #{index + 1}</h4>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {index === 0 && roomBookings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => copyGuestInfo(room.id)}
                            className="blue-button"
                            style={{
                              padding: '6px 12px',
                              background: '#17a2b8',
                              fontSize: '12px'
                            }}
                          >
                            Copy Info to All
                          </button>
                        )}
                        {roomBookings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoom(room.id)}
                            className="blue-button"
                            style={{
                              padding: '6px 12px',
                              background: '#dc3545',
                              fontSize: '12px'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-grid" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>
                    {/* COLUMN 1 - Room & Guest Info */}
                    <div className="form-column">
                      <div className="form-group">
                        <label>Room Number <span style={{color: 'red'}}>*</span></label>
                        <SearchableSelect
                          name="room_number"
                          value={room.room_number}
                          onChange={(e) => updateRoomBooking(room.id, 'room_number', e.target.value)}
                          options={formatRooms(room.room_number)}
                          placeholder="Search room..."
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Room Type</label>
                        <input
                          type="text"
                          className="form-input bg-gray-100"
                          value={room.room_type}
                          readOnly
                        />
                      </div>
                      <div className="form-group">
                        <label>Guest Name</label>
                        <div className="input-group">
                          <select
                            name="guest_title"
                            value={room.guest_title}
                            onChange={(e) => updateRoomBooking(room.id, 'guest_title', e.target.value)}
                            className="form-select title-select"
                          >
                            <option value="MR">MR</option>
                            <option value="MRS">MRS</option>
                            <option value="MS">MS</option>
                          </select>
                          <input
                            type="text"
                            className={`form-input flex-1 ${!room.guest_name ? 'required-field' : ''}`}
                            value={room.guest_name}
                            onChange={(e) => updateRoomBooking(room.id, 'guest_name', e.target.value)}
                            placeholder="Required*"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>ID Card</label>
                        <div className="input-group">
                          <select
                            name="id_card_type"
                            value={room.id_card_type}
                            onChange={(e) => updateRoomBooking(room.id, 'id_card_type', e.target.value)}
                            className="form-select title-select"
                          >
                            <option value="KTP">KTP</option>
                            <option value="Passport">Passport</option>
                            <option value="SIM">SIM</option>
                          </select>
                          <input
                            type="text"
                            className="form-input flex-1"
                            value={room.id_card_number}
                            onChange={(e) => updateRoomBooking(room.id, 'id_card_number', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Mobile Phone</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={room.mobile_phone}
                          onChange={(e) => updateRoomBooking(room.id, 'mobile_phone', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* COLUMN 2 - Address & Nationality */}
                    <div className="form-column">
                      <div className="form-group">
                        <label>Nationality</label>
                        <SearchableSelect
                          name="nationality"
                          value={room.nationality}
                          onChange={(e) => updateRoomBooking(room.id, 'nationality', e.target.value)}
                          options={formatCountries()}
                          placeholder="Select Nationality"
                          className="form-select"
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <SearchableSelect
                          name="city"
                          value={room.city}
                          onChange={(e) => updateRoomBooking(room.id, 'city', e.target.value)}
                          options={formatCities()}
                          placeholder="Select City"
                          className="form-select"
                        />
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          className="form-input"
                          value={room.address}
                          onChange={(e) => updateRoomBooking(room.id, 'address', e.target.value)}
                          rows="3"
                        />
                      </div>
                      <div className="form-group">
                        <label>Guest</label>
                        <div className="guest-count-group">
                          <div className="guest-count-item">
                            <span>M</span>
                            <input
                              type="number"
                              className="form-input guest-number"
                              value={room.guest_count_male}
                              onChange={(e) => updateRoomBooking(room.id, 'guest_count_male', e.target.value)}
                              min="0"
                            />
                          </div>
                          <div className="guest-count-item">
                            <span>F</span>
                            <input
                              type="number"
                              className="form-input guest-number"
                              value={room.guest_count_female}
                              onChange={(e) => updateRoomBooking(room.id, 'guest_count_female', e.target.value)}
                              min="0"
                            />
                          </div>
                          <div className="guest-count-item">
                            <span>C</span>
                            <input
                              type="number"
                              className="form-input guest-number"
                              value={room.guest_count_child}
                              onChange={(e) => updateRoomBooking(room.id, 'guest_count_child', e.target.value)}
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* COLUMN 3 - Pricing */}
                    <div className="form-column">
                      <div className="form-group">
                        <label>Extra Bed</label>
                        <input
                          type="number"
                          className="form-input"
                          value={room.extra_bed}
                          onChange={(e) => updateRoomBooking(room.id, 'extra_bed', e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Rate (Rp/night)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={room.rate}
                          onChange={(e) => updateRoomBooking(room.id, 'rate', e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Discount (Rp)</label>
                        <input
                          type="number"
                          className="form-input"
                          value={room.discount}
                          onChange={(e) => updateRoomBooking(room.id, 'discount', e.target.value)}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Subtotal (Rp)</label>
                        <input
                          type="text"
                          className="form-input bg-gray-100"
                          value={new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(room.subtotal)}
                          readOnly
                          style={{ fontWeight: '600', color: '#28a745' }}
                        />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Summary Section */}
            <div className="form-grid" style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
              <div className="form-column" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#343a40',
                  marginBottom: '15px'
                }}>BOOKING SUMMARY</h3>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label>Total Rooms</label>
                  <input
                    type="text"
                    className="form-input"
                    value={roomBookings.length}
                    readOnly
                    style={{ fontWeight: '600' }}
                  />
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label>Total Amount (Rp)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={new Intl.NumberFormat('id-ID', {
                      minimumFractionDigits: 0
                    }).format(getTotalAmount())}
                    readOnly
                    style={{ fontWeight: '600', color: '#28a745' }}
                  />
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label>Balance (Rp)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={new Intl.NumberFormat('id-ID', {
                      minimumFractionDigits: 0
                    }).format(getTotalAmount() - (parseFloat(groupInfo.total_deposit) || 0))}
                    readOnly
                    style={{ fontWeight: '600', color: '#007bff' }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button
                type="submit"
                disabled={loading}
                className="blue-button"
                style={{
                  padding: '12px 40px',
                  background: loading ? '#6c757d' : '#007bff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Creating Bookings...' : `Create Group Booking (${roomBookings.length} rooms)`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default GroupBooking;
