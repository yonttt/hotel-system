import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const ReservasiPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])
  const [categoryMarkets, setCategoryMarkets] = useState([])
  const [marketSegments, setMarketSegments] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [registrationTypes, setRegistrationTypes] = useState([])
  const [nextReservationNo, setNextReservationNo] = useState('')
  
  const initialFormState = {
    reservation_no: '',
    category_market: '',
    category_market_id: null,
    market_segment: '',
    market_segment_id: null,
    member_id: '',
    transaction_by: user?.username || 'ADMIN',
    id_card_type: 'KTP',
    id_card_number: '',
    guest_name: '',
    guest_title: 'MR',
    mobile_phone: '',
    address: '',
    nationality_id: null,
    nationality: 'INDONESIA',
    city_id: null,
    city: '',
    email: '',
    arrival_date: '',
    departure_date: '',
    nights: 1,
    guest_type: 'Normal',
    guest_count_male: 1,
    guest_count_female: 0,
    guest_count_child: 0,
    extra_bed_nights: 0,
    extra_bed_qty: 0,
    room_number: '',
    transaction_status: 'Reservation',
    payment_method_id: null,
    payment_method: '',
    registration_type_id: null,
    registration_type: '',
    notes: '',
    payment_amount: 0,
    discount: 0,
    payment_diskon: 0,
    deposit: 0,
    balance: 0,
    created_by: null,
    hotel_name: 'New Idola Hotel'
  }

  const [formData, setFormData] = useState(initialFormState)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  // Auto calculate departure date when arrival date or nights change
  useEffect(() => {
    if (formData.arrival_date && formData.nights) {
      const arrivalDate = new Date(formData.arrival_date)
      const departureDate = new Date(arrivalDate)
      departureDate.setDate(departureDate.getDate() + parseInt(formData.nights))
      setFormData(prev => ({
        ...prev,
        departure_date: departureDate.toISOString().split('T')[0]
      }))
    }
  }, [formData.arrival_date, formData.nights])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      // Generate next reservation number from API
      const reservationResponse = await apiService.getNextReservationNumber()
      const reservationNo = reservationResponse.data.next_reservation_no
      
      // Load available rooms
      const roomsResponse = await apiService.getRoomsByStatus('available')
      setRooms(roomsResponse.data || [])
      
      // Load all lookup data from database
      const [citiesResponse, countriesResponse, categoryMarketsResponse, marketSegmentsResponse, paymentMethodsResponse, registrationTypesResponse] = await Promise.all([
        apiService.getCities(),
        apiService.getCountries(),
        apiService.getCategoryMarkets(),
        apiService.getMarketSegments(),
        apiService.getPaymentMethods(),
        apiService.getRegistrationTypes()
      ])
      
      setCities(citiesResponse.data || [])
      setCountries(countriesResponse.data || [])
      setCategoryMarkets(categoryMarketsResponse.data || [])
      setMarketSegments(marketSegmentsResponse.data || [])
      setPaymentMethods(paymentMethodsResponse.data || [])
      setRegistrationTypes(registrationTypesResponse.data || [])
      
      setFormData(prev => ({
        ...prev,
        reservation_no: reservationNo
      }))
      
    } catch (error) {
      console.error('Error loading initial data:', error)
      // Fallback to generated number if API fails - use clean 10-digit format
      const fallbackNo = "0000000001" // Default to first number when offline
      console.warn('API not available, using fallback reservation number:', fallbackNo)
      setFormData(prev => ({
        ...prev,
        reservation_no: fallbackNo
      }))
    } finally {
      setLoading(false)
    }
  }

  const generateReservationNo = () => {
    // Fallback generation for 10-digit format
    const timestamp = Date.now().toString().slice(-6) // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 9999) + 1 // Random 1-4 digits
    const combined = timestamp + random.toString().padStart(4, '0')
    return combined.slice(0, 10).padStart(10, '0') // Ensure exactly 10 digits
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Prepare data for hotel reservation submission
      const submissionData = {
        ...formData,
        guest_male: parseInt(formData.guest_male) || 0,
        guest_female: parseInt(formData.guest_female) || 0,
        guest_child: parseInt(formData.guest_child) || 0,
        nights: parseInt(formData.nights) || 1,
        extra_bed_nights: parseInt(formData.extra_bed_nights) || 0,
        extra_bed_qty: parseInt(formData.extra_bed_qty) || 0,
        payment_amount: parseFloat(formData.payment_amount) || 0,
        discount: parseFloat(formData.discount) || 0,
        payment_diskon: parseFloat(formData.payment_diskon) || 0,
        deposit: parseFloat(formData.deposit) || 0,
        balance: parseFloat(formData.balance) || 0,
        arrival_date: formData.arrival_date ? new Date(formData.arrival_date).toISOString() : null,
        departure_date: formData.departure_date ? new Date(formData.departure_date).toISOString() : null
      }
      
      // Submit hotel reservation
      const response = await apiService.createHotelReservation(submissionData)
      
      alert('Hotel reservation berhasil dibuat!')
      
      // Reset form and generate new reservation number
      const newReservationNo = generateReservationNo()
        setFormData({
          ...initialFormState,
          reservation_no: newReservationNo,
          transaction_by: user?.username || 'ADMIN',
          arrival_date: new Date().toISOString().split('T')[0],
          departure_date: new Date().toISOString().split('T')[0]
        })      // Reload available rooms
      loadInitialData()
      
    } catch (error) {
      console.error('Error creating hotel reservation:', error)
      alert('Gagal membuat reservasi hotel. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">Memuat...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="registration-container">
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Guest Reservation</h1>
          <div className="header-tabs">
            <button className="tab-button">AVAILABLE ROOMS</button>
          </div>
        </div>

        {/* Form Container */}
        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            
            {/* Reservation and Basic Info */}
            <div className="form-grid">
              <div className="form-group">
                <label>RESERVATION NO.</label>
                <input
                  type="text"
                  name="reservation_no"
                  value={formData.reservation_no}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>CATEGORY MARKET</label>
                <select
                  name="category_market"
                  value={formData.category_market}
                  onChange={(e) => {
                    const selectedMarket = categoryMarkets.find(market => market.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      category_market: e.target.value,
                      category_market_id: selectedMarket ? selectedMarket.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Category Market</option>
                  {categoryMarkets.map(market => (
                    <option key={market.id} value={market.name}>
                      {market.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>MARKET SEGMENT</label>
                <select
                  name="market_segment"
                  value={formData.market_segment}
                  onChange={(e) => {
                    const selectedSegment = marketSegments.find(segment => segment.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      market_segment: e.target.value,
                      market_segment_id: selectedSegment ? selectedSegment.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Market Segment</option>
                  {marketSegments.map(segment => (
                    <option key={segment.id} value={segment.name}>
                      {segment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>MEMBER ID</label>
                <input
                  type="text"
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter member ID"
                />
              </div>

              <div className="form-group">
                <label>TRANSACTION BY</label>
                <input
                  type="text"
                  name="transaction_by"
                  value={formData.transaction_by}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>TRANSACTION STATUS</label>
                <select
                  name="transaction_status"
                  value={formData.transaction_status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Pending">Reservation</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group col-span-2">
                <label>GUEST NAME</label>
                <div className="input-group">
                  <select
                    name="guest_title"
                    value={formData.guest_title}
                    onChange={handleInputChange}
                    className="form-select title-select"
                  >
                    <option value="MR">Mr.</option>
                    <option value="MRS">Mrs.</option>
                    <option value="MS">Ms.</option>
                    <option value="DR">Dr.</option>
                    <option value="PROF">Prof.</option>
                  </select>
                  <input
                    type="text"
                    name="guest_name"
                    value={formData.guest_name}
                    onChange={handleInputChange}
                    className="form-input flex-1"
                    placeholder="Enter guest name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>ID CARD TYPE</label>
                <select
                  name="id_card_type"
                  value={formData.id_card_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="KTP">KTP</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="SIM">SIM</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label>ID CARD NUMBER</label>
                <input
                  type="text"
                  name="id_card_number"
                  value={formData.id_card_number}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter ID number"
                />
              </div>

              <div className="form-group">
                <label>MOBILE PHONE</label>
                <input
                  type="tel"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group col-span-2">
                <label>ADDRESS</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="2"
                  placeholder="Enter full address"
                />
              </div>

              <div className="form-group">
                <label>NATIONALITY</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={(e) => {
                    const selectedCountry = countries.find(country => country.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      nationality: e.target.value,
                      nationality_id: selectedCountry ? selectedCountry.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Nationality</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>CITY</label>
                <select
                  name="city"
                  value={formData.city || ''}
                  onChange={(e) => {
                    const selectedCity = cities.find(city => city.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      city: e.target.value,
                      city_id: selectedCity ? selectedCity.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>GUEST TYPE</label>
                <select
                  name="guest_type"
                  value={formData.guest_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div className="form-group">
                <label>ARRIVAL DATE</label>
                <input
                  type="date"
                  name="arrival_date"
                  value={formData.arrival_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>NIGHTS</label>
                <select
                  name="nights"
                  value={formData.nights}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="1">1 Night</option>
                  <option value="2">2 Nights</option>
                  <option value="3">3 Nights</option>
                  <option value="4">4 Nights</option>
                  <option value="5">5 Nights</option>
                  <option value="7">1 Week</option>
                  <option value="14">2 Weeks</option>
                </select>
              </div>

              <div className="form-group">
                <label>DEPARTURE DATE</label>
                <input
                  type="date"
                  name="departure_date"
                  value={formData.departure_date}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>ROOM NUMBER</label>
                <select
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.room_number} value={room.room_number}>
                      Room {room.room_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>GUEST COUNT</label>
                <div className="guest-count-group">
                  <div className="guest-count-item">
                    <span>M</span>
                    <input
                      type="number"
                      name="guest_male"
                      value={formData.guest_male}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="guest-count-item">
                    <span>F</span>
                    <input
                      type="number"
                      name="guest_female"
                      value={formData.guest_female}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="guest-count-item">
                    <span>C</span>
                    <input
                      type="number"
                      name="guest_child"
                      value={formData.guest_child}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>EXTRA BED NIGHTS</label>
                <input
                  type="number"
                  name="extra_bed_nights"
                  value={formData.extra_bed_nights}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>EXTRA BED QUANTITY</label>
                <select
                  name="extra_bed_qty"
                  value={formData.extra_bed_qty}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="form-group">
                <label>PAYMENT AMOUNT</label>
                <input
                  type="number"
                  name="payment_amount"
                  value={formData.payment_amount}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>PAYMENT METHOD</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => {
                    const selectedPayment = paymentMethods.find(payment => payment.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      payment_method: e.target.value,
                      payment_method_id: selectedPayment ? selectedPayment.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(payment => (
                    <option key={payment.id} value={payment.name}>
                      {payment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>REGISTRATION TYPE</label>
                <select
                  name="registration_type"
                  value={formData.registration_type}
                  onChange={(e) => {
                    const selectedType = registrationTypes.find(type => type.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      registration_type: e.target.value,
                      registration_type_id: selectedType ? selectedType.id : null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Registration Type</option>
                  {registrationTypes.map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>DISCOUNT</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>PAYMENT - DISKON</label>
                <input
                  type="number"
                  name="payment_diskon"
                  value={formData.payment_diskon}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                  placeholder="IDR"
                />
              </div>

              <div className="form-group">
                <label>DEPOSIT</label>
                <input
                  type="number"
                  name="deposit"
                  value={formData.deposit}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>BALANCE</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="form-input"
                  step="0.01"
                  readOnly
                />
              </div>

              <div className="form-group col-span-2">
                <label>NOTES</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="2"
                  placeholder="Additional notes or special requests"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
                    setFormData({
                      ...initialFormState,
                      reservation_no: formData.reservation_no,
                      transaction_by: user?.username || 'ADMIN',
                      arrival_date: new Date().toISOString().split('T')[0],
                      departure_date: new Date().toISOString().split('T')[0]
                    })
                  }
                }}
              >
                RESET FORM
              </button>
              <button 
                type="submit" 
                className="btn-process"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'PROCESS RESERVATION'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ReservasiPage