import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'
import SearchableSelect from '../../../../components/SearchableSelect'

const ReservasiPage = () => {
  const { user } = useAuth()
  const [apiError, setApiError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])
  const [categoryMarkets, setCategoryMarkets] = useState([])
  const [marketSegments, setMarketSegments] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [registrationTypes, setRegistrationTypes] = useState([])
  const [pricingInfo, setPricingInfo] = useState(null)

  const initialFormState = {
    reservation_no: '0000000001',
    category_market: 'Walkin',
    market_segment: 'Normal',
    member_id: '',
    transaction_by: user?.username || 'ADMIN',
    id_card_type: 'KTP',
    id_card_number: '',
    guest_name: '',
    guest_title: 'MR',
    mobile_phone: '',
    address: '',
    nationality: 'INDONESIA',
    city: '',
    email: '',
    arrival_date: new Date().toISOString().split('T')[0],
    arrival_time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
    departure_date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    nights: 1,
    guest_type: 'Normal',
    guest_count_male: 1,
    guest_count_female: 0,
    guest_count_child: 0,
    extra_bed: 0,
    room_number: '',
    transaction_status: 'Reservation',
    payment_method: '',
    registration_type: '',
    notes: '',
    payment_amount: 0,
    discount: 0,
    payment_diskon: 0,
    deposit: 0,
    balance: 0,
    hotel_name: 'New Idola Hotel'
  }

  const [formData, setFormData] = useState(initialFormState)

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.arrival_date && formData.nights > 0) {
      const arrivalDate = new Date(formData.arrival_date)
      const departureDate = new Date(arrivalDate)
      departureDate.setDate(departureDate.getDate() + parseInt(formData.nights, 10))
      setFormData(prev => ({
        ...prev,
        departure_date: departureDate.toISOString().split('T')[0]
      }))
    }
  }, [formData.arrival_date, formData.nights])

  const loadInitialData = async () => {
    setApiError(null);
    try {
      const results = await Promise.allSettled([
        apiService.getNextReservationNumber(),
        apiService.getRoomsByStatus('available'),
        apiService.getCities(),
        apiService.getCountries(),
        apiService.getCategoryMarkets(),
        apiService.getMarketSegments(),
        apiService.getPaymentMethods(),
        // Anda mungkin perlu menambahkan endpoint untuk registration_types di api.js
        // apiService.getRegistrationTypes() 
      ]);

      const getDataOrDefault = (result, defaultValue = []) =>
        result.status === 'fulfilled' && result.value.data ? (result.value.data.data || result.value.data) : defaultValue;

      setFormData(prev => ({
        ...prev,
        reservation_no: results[0].status === 'fulfilled' ?
          (results[0].value.data?.next_reservation_no || generateReservationNo()) :
          generateReservationNo()
      }));

      setRooms(getDataOrDefault(results[1]));
      setCities(getDataOrDefault(results[2]));
      setCountries(getDataOrDefault(results[3]));
      setCategoryMarkets(getDataOrDefault(results[4]));
      setMarketSegments(getDataOrDefault(results[5]));
      setPaymentMethods(getDataOrDefault(results[6]));
      // setRegistrationTypes(getDataOrDefault(results[7])); // Aktifkan jika endpoint ada

    } catch (error) {
      console.error('Critical error loading initial data:', error);
      setApiError('A critical error occurred. Please refresh the page.');
    }
  }

  const generateReservationNo = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 9999) + 1;
    return (timestamp + random.toString().padStart(4, '0')).slice(0, 10).padStart(10, '0');
  }

  const handleInputChange = async (e) => {
    const { name, value } = e.target
    
    // Prevent manual editing of payment_amount (it's auto-calculated)
    if (name === 'payment_amount') {
      return
    }
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Auto-fetch pricing when room number changes
    if (name === 'room_number' && value) {
      await fetchPricingForRoom(value, formData.arrival_date)
    } else if (name === 'room_number' && !value) {
      // Clear pricing info when no room is selected
      setPricingInfo(null)
      setFormData(prev => ({
        ...prev,
        payment_amount: 0
      }))
    }
    
    // Re-fetch pricing when arrival date changes (if room is selected)
    if (name === 'arrival_date' && value && formData.room_number) {
      await fetchPricingForRoom(formData.room_number, value)
    }
  }

  const fetchPricingForRoom = async (roomNumber, arrivalDate) => {
    try {
      // Find the selected room to get its type
      const selectedRoom = rooms.find(room => room.room_number === roomNumber)
      if (selectedRoom && selectedRoom.room_type) {
        const pricingResponse = await apiService.getRoomPricing(selectedRoom.room_type, arrivalDate)
        if (pricingResponse.data && pricingResponse.data.current_rate) {
          // Store pricing information for display
          setPricingInfo(pricingResponse.data)
          setFormData(prev => ({
            ...prev,
            payment_amount: pricingResponse.data.current_rate
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching room pricing:', error)
      setPricingInfo(null)
      // Don't show error to user, just log it
    }
  }

  // Helper functions to format data for SearchableSelect
  const formatCategoryMarkets = () => {
    return [
      { value: 'Walkin', label: 'Walkin' },
      ...categoryMarkets.map(cm => ({ value: cm.name, label: cm.name }))
    ]
  }

  const formatMarketSegments = () => {
    return [
      { value: 'Normal', label: 'Normal' },
      ...marketSegments.map(ms => ({ value: ms.name, label: ms.name }))
    ]
  }

  const formatCountries = () => {
    return [
      { value: 'INDONESIA', label: 'INDONESIA' },
      ...countries.map(c => ({ value: c.name, label: c.name }))
    ]
  }

  const formatCities = () => {
    return [
      { value: '', label: '--City--' },
      ...cities.map(c => ({ value: c.name, label: c.name }))
    ]
  }

  const formatRooms = () => {
    return [
      { value: '', label: 'None selected' },
      ...rooms.map(room => ({ 
        value: room.room_number, 
        label: `${room.room_number} - ${room.room_type} (Floor ${room.floor_number}) - Hit: ${room.hit_count}` 
      }))
    ]
  }

  const formatPaymentMethods = () => {
    return [
      { value: '', label: 'Debit Bca 446' },
      ...paymentMethods.map(pm => ({ value: pm.name, label: pm.name }))
    ]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid()) {
      alert('Please fill Guest Name, ID Card, Room Number, and Mobile Phone.')
      return
    }

    try {
      // Siapkan data untuk dikirim ke API
      const reservationData = { ...formData, created_by: user?.id || null }
      const response = await apiService.createHotelReservation(reservationData)
      if (response.data) {
        alert('Reservation successful!')
        loadInitialData() // Reload data untuk nomor reservasi baru
      }
    } catch (error) {
      console.error('Error submitting reservation:', error)
      alert('Error submitting reservation: ' + (error.response?.data?.detail || error.message))
    }
  }

  const isFormValid = () => {
    return formData.guest_name && formData.id_card_number && formData.room_number && formData.mobile_phone
  }

  return (
    <Layout>
      <div className="registration-container">
        <div className="registration-header">
          <h1 className="registration-title">RESERVATION FORM</h1>
          <button className="tab-button active blue-button">Room Available</button>
        </div>
        
        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid">
              {/* KOLOM 1 */}
              <div className="form-column">
                <div className="form-group">
                  <label>RESERVATION NO</label>
                  <input type="text" name="reservation_no" value={formData.reservation_no} className="form-input" readOnly />
                </div>
                <div className="form-group">
                  <label>Category Market</label>
                  <SearchableSelect
                    name="category_market"
                    value={formData.category_market}
                    onChange={handleInputChange}
                    options={formatCategoryMarkets()}
                    placeholder="Select Category Market"
                    className="form-select"
                  />
                </div>
                <div className="form-group">
                  <label>Market Segment</label>
                  <SearchableSelect
                    name="market_segment"
                    value={formData.market_segment}
                    onChange={handleInputChange}
                    options={formatMarketSegments()}
                    placeholder="Select Market Segment"
                    className="form-select"
                  />
                </div>
                <div className="form-group">
                  <label>Member ID</label>
                  <input type="text" name="member_id" value={formData.member_id} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Transaction By</label>
                  <input type="text" name="transaction_by" value={formData.transaction_by} className="form-input" readOnly />
                </div>
                <div className="form-group">
                  <label>ID Card</label>
                  <div className="input-group">
                    <select name="id_card_type" value={formData.id_card_type} onChange={handleInputChange} className="form-select title-select">
                      <option value="KTP">KTP</option>
                      <option value="Passport">Passport</option>
                      <option value="SIM">SIM</option>
                    </select>
                    <input 
                      type="text" 
                      name="id_card_number" 
                      value={formData.id_card_number} 
                      onChange={handleInputChange} 
                      className={`form-input flex-1 ${!formData.id_card_number ? 'required-field' : ''}`}
                      placeholder="Required*" 
                    />
                  </div>
                </div>
                 <div className="form-group">
                  <label>Guest Name</label>
                  <div className="input-group">
                    <select name="guest_title" value={formData.guest_title} onChange={handleInputChange} className="form-select title-select">
                      <option value="MR">MR</option>
                      <option value="MRS">MRS</option>
                      <option value="MS">MS</option>
                    </select>
                    <input 
                      type="text" 
                      name="guest_name" 
                      value={formData.guest_name} 
                      onChange={handleInputChange} 
                      className={`form-input flex-1 ${!formData.guest_name ? 'required-field' : ''}`}
                      placeholder="Required*" 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Mobile Phone</label>
                  <input type="tel" name="mobile_phone" value={formData.mobile_phone} onChange={handleInputChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-input" rows="1" />
                </div>
                 <div className="form-group">
                  <label>Nationality</label>
                  <SearchableSelect
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    options={formatCountries()}
                    placeholder="Select Nationality"
                    className="form-select"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <SearchableSelect
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    options={formatCities()}
                    placeholder="Select City"
                    className="form-select"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" />
                </div>
              </div>

              {/* KOLOM 2 */}
              <div className="form-column">
                <div className="form-group">
                    <label>Arrival Date</label>
                    <div className="input-group">
                        <input type="date" name="arrival_date" value={formData.arrival_date} onChange={handleInputChange} className="form-input" />
                        <input type="text" name="arrival_time" value={formData.arrival_time} className="form-input" style={{maxWidth: '120px'}} readOnly />
                    </div>
                </div>
                <div className="form-group">
                  <label>Nights</label>
                  <select name="nights" value={formData.nights} onChange={handleInputChange} className="form-select">
                    {[...Array(30).keys()].map(n => <option key={n + 1} value={n + 1}>{n + 1}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Departure</label>
                  <input type="date" name="departure_date" value={formData.departure_date} className="form-input" readOnly />
                </div>
                 <div className="form-group">
                  <label>Guest Type</label>
                  <select name="guest_type" value={formData.guest_type} onChange={handleInputChange} className="form-select">
                    <option value="Normal">Normal</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Guest</label>
                  <div className="guest-count-group">
                    <div className="guest-count-item"><span>M</span><input type="number" name="guest_count_male" value={formData.guest_count_male} onChange={handleInputChange} className="form-input guest-number" min="0" /></div>
                    <div className="guest-count-item"><span>F</span><input type="number" name="guest_count_female" value={formData.guest_count_female} onChange={handleInputChange} className="form-input guest-number" min="0" /></div>
                    <div className="guest-count-item"><span>C</span><input type="number" name="guest_count_child" value={formData.guest_count_child} onChange={handleInputChange} className="form-input guest-number" min="0" /></div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Extra Bed</label>
                  <input 
                    type="number" 
                    name="extra_bed" 
                    value={formData.extra_bed} 
                    onChange={handleInputChange} 
                    className="form-input" 
                    placeholder="0" 
                    min="0" 
                  />
                </div>
                <div className="form-group">
                  <label>Room Number</label>
                  <SearchableSelect
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleInputChange}
                    options={formatRooms()}
                    placeholder="Select Room"
                    className="form-select"
                  />
                </div>
              </div>

              {/* KOLOM 3 */}
              <div className="form-column">
                  <div className="form-group">
                    <label>Transaction Status</label>
                    <input 
                      type="text" 
                      name="transaction_status" 
                      value="Reservation" 
                      className="form-input" 
                      readOnly 
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <SearchableSelect
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleInputChange}
                      options={formatPaymentMethods()}
                      placeholder="Select Payment Method"
                      className="form-select"
                    />
                  </div>
                  <div className="form-group">
                      <label>Reservation Type</label>
                      <select name="reservation_type" value={formData.reservation_type} onChange={handleInputChange} className="form-select">
                          <option value="Individual">Normal</option>
                          <option value="Group">6 Hours</option>
                      </select>
                  </div>
                   <div className="form-group">
                      <label>Note</label>
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="form-input" rows="3" />
                  </div>
                  <div className="form-group">
                    <label>Payment Amount</label>
                    <input type="number" name="payment_amount" value={formData.payment_amount} readOnly className="form-input bg-gray-100" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Discount</label>
                    <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="form-input" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Payment - Diskon</label>
                    <input type="number" name="payment_diskon" value={formData.payment_diskon} onChange={handleInputChange} className="form-input" min="0" />
                  </div>
                   <div className="form-group">
                    <label>Deposit</label>
                    <input type="number" name="deposit" value={formData.deposit} onChange={handleInputChange} className="form-input" min="0" />
                  </div>
                  <div className="form-group">
                    <label>Balance</label>
                    <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} className="form-input" readOnly />
                  </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-process" disabled={!isFormValid()}>Process</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ReservasiPage