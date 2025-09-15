import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const RegistrasiPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState([])
  const [nextRegistrationNo, setNextRegistrationNo] = useState('')
  
  const [formData, setFormData] = useState({
    reservation_no: '',
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
    arrival_time: new Date().toTimeString().split(' ')[0].slice(0, 5),
    nights: 1,
    departure_date: '',
    guest_type: 'Normal',
    guest_male: 1,
    guest_female: 0,
    guest_child: 0,
    extra_bed_nights: 0,
    extra_bed_qty: 0,
    room_number: '',
    transaction_status: 'Pending',
    payment_method: 'Debit BCA 446',
    registration_type: 'Reservasi',
    note: '',
    payment_amount: 0,
    discount: 0,
    payment_diskon: 0,
    deposit: 0,
    balance: 0,
    hotel_name: 'New Idola Hotel',
    // Add missing properties to match form inputs
    registrationNo: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    arrivalTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    transactionStatus: 'Registration',
    categoryMarket: 'Walkin',
    marketSegment: 'Normal',
    memberId: '',
    guestType: 'Normal',
    transactionBy: user?.username || 'ADMIN',
    guestDetails: {
      male: 1,
      female: 0,
      child: 0
    },
    paymentAmount: 0,
    idCard: '',
    idCardType: 'KTP',
    extraBed: '',
    extraBedQty: 0,
    guestName: '',
    guestTitle: 'MR',
    roomNumber: '',
    paymentDiskon: 0,
    mobilePhone: '',
    departure: ''
  })

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
      
      // Generate next registration number
      const registrationNo = generateRegistrationNo()
      
      // Load available rooms
      const roomsResponse = await apiService.getRoomsByStatus('available')
      setRooms(roomsResponse.data || [])
      
      setFormData(prev => ({
        ...prev,
        reservation_no: registrationNo
      }))
      
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateRegistrationNo = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const time = now.getTime().toString().slice(-6)
    return `RSV${year}${month}${day}${time}`
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
      
      // Prepare data for submission
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
        balance: parseFloat(formData.balance) || 0
      }
      
      // Submit reservation
      const response = await apiService.createReservation(submissionData)
      
      if (response.status === 'success') {
        alert('Reservasi berhasil dibuat!')
        
        // Reset form and generate new registration number
        const newRegistrationNo = generateRegistrationNo()
        setFormData(prev => ({
          ...prev,
          reservation_no: newRegistrationNo,
          member_id: '',
          id_card_number: '',
          guest_name: '',
          mobile_phone: '',
          address: '',
          city: '',
          email: '',
          room_number: '',
          note: '',
          payment_amount: 0,
          discount: 0,
          payment_diskon: 0,
          deposit: 0,
          balance: 0
        }))
        
        // Reload available rooms
        loadInitialData()
      }
      
    } catch (error) {
      console.error('Error creating reservation:', error)
      alert('Gagal membuat reservasi. Silakan coba lagi.')
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
          <div className="header-tabs">
            <button className="tab-button active">REGISTRATION FORM</button>
            <button className="tab-button">Room Available</button>
          </div>
        </div>

        {/* Form Container */}
        <div className="registration-form-container">
          <form onSubmit={handleSubmit} className="registration-form">
            {/* Top Row */}
            <div className="form-row top-row">
              <div className="form-group">
                <label>REGISTRATION NO</label>
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
                <label>Arrival Date</label>
                <div className="date-time-group">
                  <input
                    type="date"
                    name="arrival_date"
                    value={formData.arrival_date}
                    onChange={handleInputChange}
                    className="form-input date-input"
                  />
                  <input
                    type="time"
                    name="arrival_time"
                    value={formData.arrival_time}
                    onChange={handleInputChange}
                    className="form-input time-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Transaction Status</label>
                <select
                  name="transaction_status"
                  value={formData.transaction_status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Registration">Registration</option>
                  <option value="Check-in">Check-in</option>
                  <option value="Check-out">Check-out</option>
                </select>
              </div>
            </div>

            {/* Second Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Category Market</label>
                <select
                  name="categoryMarket"
                  value={formData.categoryMarket}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Walkin">Walkin</option>
                  <option value="Online">Online</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>

              <div className="form-group nights-group">
                <label>Nights</label>
                <div className="nights-input-group">
                  <select
                    name="nights"
                    value={formData.nights}
                    onChange={handleInputChange}
                    className="form-select nights-select"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <span className="nights-label">Nights</span>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Debit Bca 446">Debit Bca 446</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>
            </div>

            {/* Third Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Market Segment</label>
                <select
                  name="marketSegment"
                  value={formData.marketSegment}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Government">Government</option>
                </select>
              </div>

              <div className="form-group">
                <label>Departure</label>
                <input
                  type="date"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Registration Type</label>
                <input
                  type="text"
                  name="registrationType"
                  value={formData.registrationType}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Member ID</label>
                <input
                  type="text"
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Guest Type</label>
                <select
                  name="guestType"
                  value={formData.guestType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Normal">Normal</option>
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="2"
                />
              </div>
            </div>

            {/* Fifth Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Transaction By</label>
                <input
                  type="text"
                  name="transactionBy"
                  value={formData.transactionBy}
                  onChange={handleInputChange}
                  className="form-input"
                  readOnly
                />
              </div>

              <div className="form-group guest-details">
                <label>Guest</label>
                <div className="guest-inputs">
                  <div className="guest-input-item">
                    <span>M</span>
                    <input
                      type="number"
                      name="guest_male"
                      value={formData.guest_male}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                    />
                  </div>
                  <div className="guest-input-item">
                    <span>F</span>
                    <input
                      type="number"
                      name="guest_female"
                      value={formData.guest_female}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                    />
                  </div>
                  <div className="guest-input-item">
                    <span>C</span>
                    <input
                      type="number"
                      name="guest_child"
                      value={formData.guest_child}
                      onChange={handleInputChange}
                      className="form-input guest-number"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Payment Amount</label>
                <input
                  type="number"
                  name="paymentAmount"
                  value={formData.paymentAmount}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Sixth Row */}
            <div className="form-row">
              <div className="form-group id-card-group">
                <label>ID Card</label>
                <div className="id-card-inputs">
                  <input
                    type="text"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    className="form-input id-card-input"
                  />
                  <select
                    name="idCardType"
                    value={formData.idCardType}
                    onChange={handleInputChange}
                    className="form-select id-card-type"
                  >
                    <option value="KTP">KTP</option>
                    <option value="Passport">Passport</option>
                    <option value="SIM">SIM</option>
                  </select>
                </div>
              </div>

              <div className="form-group extra-bed-group">
                <label>Extra Bed</label>
                <div className="extra-bed-inputs">
                  <input
                    type="text"
                    name="extraBed"
                    value={formData.extraBed}
                    onChange={handleInputChange}
                    className="form-input extra-bed-input"
                    placeholder="Night"
                  />
                  <span>Qty</span>
                  <select
                    name="extraBedQty"
                    value={formData.extraBedQty}
                    onChange={handleInputChange}
                    className="form-select extra-bed-qty"
                  >
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Discount</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Seventh Row */}
            <div className="form-row">
              <div className="form-group guest-name-group">
                <label>Guest Name</label>
                <div className="guest-name-inputs">
                  <input
                    type="text"
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    className="form-input guest-name-input"
                  />
                  <select
                    name="guestTitle"
                    value={formData.guestTitle}
                    onChange={handleInputChange}
                    className="form-select guest-title"
                  >
                    <option value="MR">MR</option>
                    <option value="MRS">MRS</option>
                    <option value="MS">MS</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Room Number</label>
                <select
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">None selected</option>
                  <option value="101">101</option>
                  <option value="102">102</option>
                  <option value="103">103</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment - Diskon</label>
                <input
                  type="number"
                  name="paymentDiskon"
                  value={formData.paymentDiskon}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Eighth Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Mobile Phone</label>
                <input
                  type="tel"
                  name="mobilePhone"
                  value={formData.mobilePhone}
                  onChange={handleInputChange}
                  className="form-input"
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
                />
              </div>
            </div>

            {/* Ninth Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  rows="2"
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
                />
              </div>
            </div>

            {/* Tenth Row */}
            <div className="form-row">
              <div className="form-group">
                <label>Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="INDONESIA">INDONESIA</option>
                  <option value="SINGAPORE">SINGAPORE</option>
                  <option value="MALAYSIA">MALAYSIA</option>
                  <option value="THAILAND">THAILAND</option>
                </select>
              </div>
            </div>

            {/* Eleventh Row */}
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">--City--</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Bandung">Bandung</option>
                </select>
              </div>
            </div>

            {/* Last Row */}
            <div className="form-row">
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

              <div className="form-group submit-group">
                <button type="submit" className="submit-button">
                  Process
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default RegistrasiPage
