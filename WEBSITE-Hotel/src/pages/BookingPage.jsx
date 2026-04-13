import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CalendarDays, Users, CreditCard, User, Mail, Phone, Bed, Maximize2,
  Star, Check, ChevronLeft, ArrowRight, CheckCircle, MapPin
} from 'lucide-react'
import { hotelAPI } from '../services/api'
import { featuredRooms, hotelProperties, formatCurrency } from '../data/hotels'

const allRooms = [
  ...featuredRooms,
  {
    id: 5, name: 'Superior Room', type: 'standard', price: 900000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    size: '28 m²', bed: 'Queen Size', guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 43"', 'Room Service'],
  },
  {
    id: 6, name: 'Grand Suite', type: 'suite', price: 4200000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    size: '75 m²', bed: 'King Size', guests: 3,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 65"', 'Mini Bar', 'Bathtub', 'Balcony', 'Sea View'],
  },
]

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const preselectedRoom = searchParams.get('room')
  const destination = searchParams.get('destination') || ''
  const checkInParam = searchParams.get('checkIn') || ''
  const checkOutParam = searchParams.get('checkOut') || ''
  const guestsParam = searchParams.get('guests') || '2'
  const roomsParam = searchParams.get('rooms') || '1'

  const [step, setStep] = useState(preselectedRoom ? 2 : 1)
  const [selectedRoom, setSelectedRoom] = useState(preselectedRoom ? Number(preselectedRoom) : null)
  const [formData, setFormData] = useState({
    destination,
    checkIn: checkInParam,
    checkOut: checkOutParam,
    guests: guestsParam,
    rooms: roomsParam,
    
    guestTitle: 'MR',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    idCardType: 'KTP',
    idCardNumber: '',
    nationality: 'INDONESIA',
    city: '',

    guestMale: 1,
    guestFemale: 0,
    guestChild: 0,

    specialRequests: '',
    paymentMethod: 'Credit Card',
  })
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [dynamicHotels, setDynamicHotels] = useState([])
  const [dynamicCities, setDynamicCities] = useState([])
  const [dynamicCountries, setDynamicCountries] = useState([])

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelAPI.getProperties()
        if (res.data) setDynamicHotels(res.data)
      } catch (err) {
        console.error('Failed to fetch dynamic hotels', err)
      }
    }
    const fetchLocations = async () => {
      try {
        const [citiesRes, countriesRes] = await Promise.all([
          hotelAPI.getCities(),
          hotelAPI.getCountries()
        ])
        if (citiesRes.data?.data) setDynamicCities(citiesRes.data.data)
        if (countriesRes.data?.data) setDynamicCountries(countriesRes.data.data)
      } catch (err) {
        console.error('Failed to fetch locations', err)
      }
    }
    fetchHotels()
    fetchLocations()
  }, [])

  const selectedRoomData = useMemo(() => allRooms.find(r => r.id === selectedRoom), [selectedRoom])

  const nights = useMemo(() => {
    if (formData.checkIn && formData.checkOut) {
      const diff = new Date(formData.checkOut) - new Date(formData.checkIn)
      return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }
    return 1
  }, [formData.checkIn, formData.checkOut])

  const totalPrice = selectedRoomData ? selectedRoomData.price * nights * Number(formData.rooms || 1) : 0

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectRoom = (roomId) => {
    setSelectedRoom(roomId)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const today = new Date()
      // Reset time portion for accurate date comparison
      today.setHours(0, 0, 0, 0)
      
      const checkInDate = new Date(formData.checkIn)
      checkInDate.setHours(0, 0, 0, 0)

      const isToday = checkInDate.getTime() === today.getTime()
      
      const payload = {
        hotel_name: formData.destination,
        guest_name: `${formData.firstName} ${formData.lastName}`.trim(),
        guest_title: formData.guestTitle,
        email: formData.email,
        mobile_phone: formData.phone,
        address: formData.address,
        id_card_type: formData.idCardType,
        id_card_number: formData.idCardNumber,
        nationality: formData.nationality,
        city: formData.city,
        
        arrival_date: new Date(formData.checkIn).toISOString(),
        departure_date: new Date(formData.checkOut).toISOString(),
        nights: nights,
        
        guest_male: formData.guestMale,
        guest_female: formData.guestFemale,
        guest_child: formData.guestChild,
        
        note: formData.specialRequests || undefined,
        payment_method: formData.paymentMethod,
        payment_amount: totalPrice,
        
        transaction_by: 'Website',
        category_market: 'Website',
      }

      if (isToday) {
        // Create Guest Registration
        payload.registration_no = `REG${Date.now().toString().slice(-8)}`
        payload.transaction_status = "Registration"
        payload.guest_count_male = payload.guest_male
        payload.guest_count_female = payload.guest_female
        payload.guest_count_child = payload.guest_child
        payload.payment_method_id = 1 // Basic mapping or would need fetching
        // map names back if needed for backend validation matching
        delete payload.guest_male
        delete payload.guest_female
        delete payload.guest_child
        
        await hotelAPI.createRegistration(payload)
        setBookingId(payload.registration_no)
      } else {
        // Create Hotel Reservation
        payload.reservation_no = `RSV${Date.now().toString().slice(-8)}`
        payload.transaction_status = "Reservation"
        await hotelAPI.createReservation(payload)
        setBookingId(payload.reservation_no)
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Error submitting booking:', error)
      setErrorMsg('Gagal melakukan pemesanan. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <>
        <section className="relative h-[35vh] min-h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
          <div className="relative z-10 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">Reservasi Berhasil!</h1>
            <p className="text-white/70">Nomor Booking: <span className="text-gold-400 font-semibold">{bookingId}</span></p>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-display font-bold text-hotel-dark mb-6">Detail Reservasi</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Nama Tamu</span>
                  <span className="font-semibold text-hotel-dark">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Tipe Kamar</span>
                  <span className="font-semibold text-hotel-dark">{selectedRoomData?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-semibold text-hotel-dark">{formData.checkIn || '-'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-semibold text-hotel-dark">{formData.checkOut || '-'}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Durasi</span>
                  <span className="font-semibold text-hotel-dark">{nights} malam</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Jumlah Kamar</span>
                  <span className="font-semibold text-hotel-dark">{formData.rooms}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500 font-semibold">Total</span>
                  <span className="text-xl font-bold text-gold-600">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                <p className="text-gold-800 text-sm">
                  Konfirmasi reservasi telah dikirim ke <strong>{formData.email}</strong>. 
                  Silakan periksa inbox Anda untuk detail lebih lanjut.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/" className="btn-gold rounded-lg text-center flex-1">
                  Kembali ke Beranda
                </Link>
                <Link to="/rooms" className="btn-outline-gold rounded-lg text-center flex-1">
                  Lihat Kamar Lain
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[35vh] min-h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Reservasi</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {step === 1 ? 'Pilih Kamar' : 'Lengkapi Reservasi'}
          </h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Progress Steps */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Pilih Kamar' },
              { num: 2, label: 'Data Tamu' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                {i > 0 && <div className={`w-12 h-0.5 ${step >= s.num ? 'bg-gold-500' : 'bg-gray-200'}`} />}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step > s.num ? <Check size={16} /> : s.num}
                  </div>
                  <span className={`text-sm font-medium ${step >= s.num ? 'text-hotel-dark' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step 1: Select Room */}
      {step === 1 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allRooms.map((room) => (
                <div
                  key={room.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 cursor-pointer ${
                    selectedRoom === room.id ? 'border-gold-500' : 'border-transparent'
                  }`}
                  onClick={() => handleSelectRoom(room.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {formatCurrency(room.price)}/malam
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg text-hotel-dark mb-1">{room.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1"><Maximize2 size={12} /> {room.size}</span>
                      <span className="flex items-center gap-1"><Bed size={12} /> {room.bed}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {room.guests}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.amenities.slice(0, 4).map((a, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">{a}</span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500">+{room.amenities.length - 4}</span>
                      )}
                    </div>
                    <button className="w-full bg-gold-500 hover:bg-gold-400 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                      Pilih Kamar Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: Guest Details & Payment */}
      {step === 2 && selectedRoomData && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-500 hover:text-hotel-dark text-sm mb-6 transition-colors"
            >
              <ChevronLeft size={16} /> Kembali pilih kamar
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Stay Details */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-display font-bold text-lg text-hotel-dark mb-4 flex items-center gap-2">
                      <CalendarDays size={20} className="text-gold-500" />
                      Detail Menginap
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Destinasi</label>
                        <select name="destination" value={formData.destination} onChange={handleChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20">
                          <option value="">Pilih Hotel</option>
                          {(dynamicHotels.length > 0 ? dynamicHotels : hotelProperties).map(h => (
                            <option key={h.id} value={h.name}>{h.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Jumlah Kamar</label>
                        <select name="rooms" value={formData.rooms} onChange={handleChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20">
                          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Kamar</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Check-in *</label>
                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Check-out *</label>
                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                    </div>
                  </div>

                  {/* Guest Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-display font-bold text-lg text-hotel-dark mb-4 flex items-center gap-2">
                      <User size={20} className="text-gold-500" />
                      Informasi Tamu
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Nama Depan *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Nama Belakang *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Telepon *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+62 812 3456 7890"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-hotel-dark mb-2">Permintaan Khusus</label>
                      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3}
                        placeholder="Contoh: Kamar lantai atas, extra pillow, dll."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 resize-none" />
                    </div>
                  </div>

                  {/* Guest Additional Detail */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-display font-bold text-lg text-hotel-dark mb-4 flex items-center gap-2">
                      <User size={20} className="text-gold-500" />
                      Detail Pribadi & Identitas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Titel *</label>
                        <select name="guestTitle" value={formData.guestTitle} onChange={handleChange} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400">
                          <option value="MR">Mr.</option>
                          <option value="MRS">Mrs.</option>
                          <option value="MS">Ms.</option>
                          <option value="MISS">Miss</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Tipe Identitas *</label>
                        <select name="idCardType" value={formData.idCardType} onChange={handleChange} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400">
                          <option value="KTP">KTP</option>
                          <option value="PASSPORT">Passport</option>
                          <option value="SIM">SIM</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">No. Identitas *</label>
                        <input type="text" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required placeholder="1234567890"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Kewarganegaraan *</label>
                        <select name="nationality" value={formData.nationality} onChange={handleChange} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400">
                          <option value="">Pilih Kewarganegaraan</option>
                          {dynamicCountries.map(c => (
                            <option key={c.id || c.code} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Kota Asal (City) *</label>
                        <select name="city" value={formData.city} onChange={handleChange} required
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400">
                          <option value="">Pilih Kota Asal</option>
                          {dynamicCities.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="sm:col-span-2 border-t pt-2 mt-2 border-gray-100">
                        <label className="block text-sm font-semibold text-hotel-dark mb-2">Alamat Asal Kamar</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows={2}
                          placeholder="Alamat asal tamu"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 resize-none" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:col-span-2 items-end">
                         <div>
                            <label className="block text-sm font-semibold text-hotel-dark mb-2">Laki-laki</label>
                            <input type="number" min="0" name="guestMale" value={formData.guestMale} onChange={handleChange} 
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400" />
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-hotel-dark mb-2">Perempuan</label>
                            <input type="number" min="0" name="guestFemale" value={formData.guestFemale} onChange={handleChange} 
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400" />
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-hotel-dark mb-2">Anak-anak</label>
                            <input type="number" min="0" name="guestChild" value={formData.guestChild} onChange={handleChange} 
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gold-400" />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h3 className="font-display font-bold text-lg text-hotel-dark mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-gold-500" />
                      Metode Pembayaran
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { value: 'credit_card', label: 'Kartu Kredit', desc: 'Visa, Mastercard, JCB' },
                        { value: 'bank_transfer', label: 'Transfer Bank', desc: 'BCA, Mandiri, BNI' },
                        { value: 'pay_at_hotel', label: 'Bayar di Hotel', desc: 'Cash / Debit' },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            formData.paymentMethod === method.value
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input type="radio" name="paymentMethod" value={method.value}
                            checked={formData.paymentMethod === method.value} onChange={handleChange}
                            className="sr-only" />
                          <p className="font-semibold text-sm text-hotel-dark">{method.label}</p>
                          <p className="text-xs text-gray-400 mt-1">{method.desc}</p>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full btn-gold rounded-xl text-center py-4 text-base flex items-center justify-center gap-2">
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Reservasi'}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                  {errorMsg && <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>}
                </form>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 sticky top-24 overflow-hidden">
                  <img src={selectedRoomData.image} alt={selectedRoomData.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-gold-400" fill="currentColor" />)}
                    </div>
                    <h3 className="font-display font-bold text-xl text-hotel-dark mb-1">{selectedRoomData.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Maximize2 size={12} /> {selectedRoomData.size}</span>
                      <span className="flex items-center gap-1"><Bed size={12} /> {selectedRoomData.bed}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {selectedRoomData.guests}</span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Harga per malam</span>
                        <span className="font-semibold">{formatCurrency(selectedRoomData.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Durasi</span>
                        <span className="font-semibold">{nights} malam</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jumlah kamar</span>
                        <span className="font-semibold">{formData.rooms}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between">
                        <span className="font-semibold text-hotel-dark">Total</span>
                        <span className="text-xl font-bold text-gold-600">{formatCurrency(totalPrice)}</span>
                      </div>
                    </div>

                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700 flex items-start gap-2">
                      <Check size={14} className="shrink-0 mt-0.5" />
                      <span>Pembatalan gratis hingga 24 jam sebelum check-in</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
