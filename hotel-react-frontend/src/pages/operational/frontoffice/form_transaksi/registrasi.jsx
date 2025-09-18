import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const RegistrasiPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [rooms, setRooms] = useState([])
  const [cities, setCities] = useState([])
  const [countries, setCountries] = useState([])
  const [categoryMarkets, setCategoryMarkets] = useState([])
  const [marketSegments, setMarketSegments] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  
  const initialFormState = {
    registration_no: '0000000001',
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
    arrival_date: new Date().toISOString().split('T')[0],
    departure_date: new Date().toISOString().split('T')[0],
    nights: 1,
    guest_type: 'Normal',
    guest_count_male: 1,
    guest_count_female: 0,
    guest_count_child: 0,
    extra_bed_nights: 0,
    extra_bed_qty: 0,
    room_number: '',
    transaction_status: 'Registration',
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
    setLoading(true); // Tambahkan state loading
    setApiError(null);

    try {
      const promises = [
        apiService.getNextRegistrationNumber(),
        apiService.getRoomsByStatus('available'),
        apiService.getCities(),
        apiService.getCountries(),
        apiService.getCategoryMarkets(),
        apiService.getMarketSegments(),
        apiService.getPaymentMethods()
      ];

      // Menggunakan Promise.allSettled agar tidak langsung gagal jika salah satu promise error
      const results = await Promise.allSettled(promises);

      // Fungsi untuk mengekstrak data atau memberikan nilai default jika gagal
      const getDataOrDefault = (result, defaultValue = []) => 
        result.status === 'fulfilled' ? (result.value.data || defaultValue) : defaultValue;

      // Proses hasil dengan aman
      setFormData(prev => ({
        ...prev,
        registration_no: results[0].status === 'fulfilled' ? results[0].value.data.next_registration_no : generateRegistrationNo()
      }));
      
      setRooms(getDataOrDefault(results[1]));
      setCities(getDataOrDefault(results[2]));
      setCountries(getDataOrDefault(results[3]));
      setCategoryMarkets(getDataOrDefault(results[4]));
      setMarketSegments(getDataOrDefault(results[5]));
      setPaymentMethods(getDataOrDefault(results[6]));
      
    } catch (error) {
      // Catch ini akan menangani error yang lebih fundamental (bukan dari API)
      console.error('Critical error loading initial data:', error);
      setApiError('A critical error occurred. Please refresh the page.');
    } finally {
      setLoading(false); // Selalu set loading ke false
    }
  }

  const generateRegistrationNo = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 9999) + 1
    const combined = timestamp + random.toString().padStart(4, '0')
    return combined.slice(0, 10).padStart(10, '0')
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
    
    if (!isFormValid()) {
      alert('Please fill in all required fields.')
      return
    }

    try {
      const registrationData = {
        registration_no: formData.registration_no,
        category_market_id: formData.category_market_id,
        market_segment_id: formData.market_segment_id,
        member_id: formData.member_id || null,
        transaction_by: formData.transaction_by,
        id_card_type: formData.id_card_type,
        id_card_number: formData.id_card_number,
        guest_name: formData.guest_name,
        guest_title: formData.guest_title,
        mobile_phone: formData.mobile_phone,
        address: formData.address,
        nationality_id: formData.nationality_id,
        city_id: formData.city_id,
        email: formData.email,
        arrival_date: formData.arrival_date,
        departure_date: formData.departure_date,
        nights: parseInt(formData.nights),
        guest_type: formData.guest_type,
        guest_count_male: parseInt(formData.guest_count_male),
        guest_count_female: parseInt(formData.guest_count_female),
        guest_count_child: parseInt(formData.guest_count_child),
        extra_bed_nights: parseInt(formData.extra_bed_nights),
        extra_bed_qty: parseInt(formData.extra_bed_qty),
        room_number: formData.room_number,
        transaction_status: formData.transaction_status,
        payment_method_id: formData.payment_method_id,
        registration_type_id: formData.registration_type_id,
        notes: formData.notes,
        payment_amount: parseFloat(formData.payment_amount),
        discount: parseFloat(formData.discount),
        payment_diskon: parseFloat(formData.payment_diskon),
        deposit: parseFloat(formData.deposit),
        balance: parseFloat(formData.balance),
        created_by: user?.id || null,
        hotel_name: formData.hotel_name
      }

      const response = await apiService.createHotelRegistration(registrationData)
      
      if (response.data) {
        alert('Registration successful!')
        setFormData({ ...initialFormState, registration_no: generateRegistrationNo() })
      }
      
    } catch (error) {
      console.error('Error submitting registration:', error)
      alert('Error submitting registration: ' + (error.response?.data?.detail || error.message))
    }
  }

  const isFormValid = () => {
    return formData.guest_name && 
           formData.id_card_number && 
           formData.room_number &&
           formData.mobile_phone
  }

  return (
    <Layout>
      <div className="registration-container">
        {/* Header */}
        <div className="registration-header">
          <h1 className="registration-title">Guest Registration</h1>
          <div className="header-tabs">
            <button className="tab-button">Available Rooms</button>
          </div>
        </div>

        {apiError && (
          <div className="alert alert-warning">
            {apiError}
          </div>
        )}

        {/* Form Container */}
        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            
            {/* Registration and Basic Info */}
            <div className="form-grid">
              <div className="form-group">
                <label>Registration No.</label>
                <input
                  type="text"
                  name="registration_no"
                  value={formData.registration_no}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Category Market</label>
                <select
                  name="category_market"
                  value={formData.category_market || ''}
                  onChange={(e) => {
                    const selectedCategoryMarket = categoryMarkets.find(cm => cm.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      category_market: e.target.value,
                      category_market_id: selectedCategoryMarket?.id || null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">--Select Category Market--</option>
                  {categoryMarkets.map(categoryMarket => (
                    <option key={categoryMarket.id} value={categoryMarket.name}>
                      {categoryMarket.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Market Segment</label>
                <select
                  name="market_segment"
                  value={formData.market_segment || ''}
                  onChange={(e) => {
                    const selectedMarketSegment = marketSegments.find(ms => ms.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      market_segment: e.target.value,
                      market_segment_id: selectedMarketSegment?.id || null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">--Select Market Segment--</option>
                  {marketSegments.map(marketSegment => (
                    <option key={marketSegment.id} value={marketSegment.name}>
                      {marketSegment.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Member ID</label>
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
                <label>Transaction By</label>
                <input
                  type="text"
                  name="transaction_by"
                  value={formData.transaction_by}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>
            </div>

            {/* Guest Information */}
            <div className="form-section-title">Guest Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>ID Card Type</label>
                <select
                  name="id_card_type"
                  value={formData.id_card_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="KTP">KTP</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver License</option>
                </select>
              </div>

              <div className="form-group">
                <label>ID Card Number*</label>
                <input
                  type="text"
                  name="id_card_number"
                  value={formData.id_card_number}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Guest Title</label>
                <select
                  name="guest_title"
                  value={formData.guest_title}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="MR">MR</option>
                  <option value="MRS">MRS</option>
                  <option value="MS">MS</option>
                  <option value="DR">DR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Guest Name*</label>
                <input
                  type="text"
                  name="guest_name"
                  value={formData.guest_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile Phone*</label>
                <input
                  type="tel"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      nationality: e.target.value,
                      nationality_id: selectedCountry?.id || null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Nationality</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>{country.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={(e) => {
                    const selectedCity = cities.find(c => c.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      city: e.target.value,
                      city_id: selectedCity?.id || null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stay Information */}
            <div className="form-section-title">Stay Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Arrival Date</label>
                <input
                  type="date"
                  name="arrival_date"
                  value={formData.arrival_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Departure Date</label>
                <input
                  type="date"
                  name="departure_date"
                  value={formData.departure_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Nights</label>
                <input
                  type="number"
                  name="nights"
                  value={formData.nights}
                  onChange={handleInputChange}
                  className="form-input"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Guest Type</label>
                <select
                  name="guest_type"
                  value={formData.guest_type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="VIP">VIP</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div className="form-group">
                <label>Male Guests</label>
                <input
                  type="number"
                  name="guest_count_male"
                  value={formData.guest_count_male}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Female Guests</label>
                <input
                  type="number"
                  name="guest_count_female"
                  value={formData.guest_count_female}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Child Guests</label>
                <input
                  type="number"
                  name="guest_count_child"
                  value={formData.guest_count_child}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Extra Bed Quantity</label>
                <input
                  type="number"
                  name="extra_bed_qty"
                  value={formData.extra_bed_qty}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Extra Bed Nights</label>
                <input
                  type="number"
                  name="extra_bed_nights"
                  value={formData.extra_bed_nights}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>

            {/* Room and Payment Information */}
            <div className="form-section-title">Room & Payment Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label>Room Number*</label>
                <select
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.room_number}>
                      {room.room_number} - {room.room_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => {
                    const selectedPaymentMethod = paymentMethods.find(pm => pm.name === e.target.value)
                    setFormData(prev => ({
                      ...prev,
                      payment_method: e.target.value,
                      payment_method_id: selectedPaymentMethod?.id || null
                    }))
                  }}
                  className="form-select"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(pm => (
                    <option key={pm.id} value={pm.name}>{pm.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Payment Amount</label>
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
                <label>Discount</label>
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
                <label>Payment Discount</label>
                <input
                  type="number"
                  name="payment_diskon"
                  value={formData.payment_diskon}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Deposit</label>
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
                <label>Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  className="form-input"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Hotel Name</label>
                <input
                  type="text"
                  name="hotel_name"
                  value={formData.hotel_name}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-section-title">Notes</div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-input"
                rows="3"
                placeholder="Additional notes or comments"
              />
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-process"
                disabled={!isFormValid()}
              >
                PROCESS REGISTRATION
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default RegistrasiPage