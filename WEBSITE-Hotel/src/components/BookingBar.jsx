import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, Search, MapPin } from 'lucide-react'
import { hotelAPI } from '../services/api'
import { hotelProperties as defaultHotels } from '../data/hotels'

export default function BookingBar() {
  const navigate = useNavigate()
  const [dynamicHotels, setDynamicHotels] = useState([])
  const [formData, setFormData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelAPI.getProperties()
        if (res.data) setDynamicHotels(res.data)
      } catch (err) {
        console.error('Failed to fetch dynamic hotels', err)
      }
    }
    fetchHotels()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Date validation
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (checkInDate < today) {
        setError('Tanggal check-in tidak boleh di masa lalu')
        return
      }
      if (checkOutDate <= checkInDate) {
        setError('Tanggal check-out harus setelah check-in')
        return
      }
    }

    // Build query params and navigate to booking page
    const params = new URLSearchParams()
    if (formData.destination) params.set('destination', formData.destination)
    if (formData.checkIn) params.set('checkIn', formData.checkIn)
    if (formData.checkOut) params.set('checkOut', formData.checkOut)
    if (formData.guests) params.set('guests', formData.guests)
    if (formData.rooms) params.set('rooms', formData.rooms)

    navigate(`/booking?${params.toString()}`)
  }

  return (
    <div className="relative z-20 -mt-16 md:-mt-12">
      <div className="max-w-6xl mx-auto px-4">
        <form
          onSubmit={handleSearch}
          className="booking-bar rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 items-end">
            {/* Destination */}
            <div className="space-y-2">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <MapPin size={14} />
                Destinasi
              </label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm 
                  focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                  appearance-none cursor-pointer"
              >
                <option value="" className="bg-hotel-dark">Pilih Hotel</option>
                {dynamicHotels.map(h => (
                  <option key={h.id} value={h.name} className="bg-hotel-dark">{h.name}</option>
                ))}
              </select>
            </div>

            {/* Check In */}
            <div className="space-y-2">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <CalendarDays size={14} />
                Check-in
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm 
                  focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                  [color-scheme:dark]"
              />
            </div>

            {/* Check Out */}
            <div className="space-y-2">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <CalendarDays size={14} />
                Check-out
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm 
                  focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                  [color-scheme:dark]"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <Users size={14} />
                Tamu & Kamar
              </label>
              <div className="flex gap-2">
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 text-white text-sm 
                    focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                    appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n} className="bg-hotel-dark">{n} Tamu</option>
                  ))}
                </select>
                <select
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-3 text-white text-sm 
                    focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                    appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n} className="bg-hotel-dark">{n} Kamar</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="space-y-2">
              {error && (
                <p className="text-red-400 text-xs">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-400 text-white font-semibold py-3 px-6 rounded-lg 
                  transition-all duration-300 flex items-center justify-center gap-2 
                  uppercase tracking-wider text-sm shadow-lg hover:shadow-gold-500/30"
              >
                <Search size={18} />
                <span>Cari</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
