import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CalendarDays, Users, Search, MapPin } from 'lucide-react'
import { hotelAPI } from '../api/api'

// Local date as YYYY-MM-DD (avoids UTC off-by-one from toISOString in UTC+7).
const toDateStr = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const today = () => toDateStr(new Date())
// Add N days to a YYYY-MM-DD string.
const addDays = (dateStr, n) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + Number(n))
  return toDateStr(d)
}
// Whole nights between two YYYY-MM-DD date strings (min 1).
const nightsBetween = (inStr, outStr) => {
  const n = Math.round((new Date(outStr) - new Date(inStr)) / 86400000)
  return n > 0 ? n : 1
}

// `overlap` = true: sits on top of the homepage hero (pulled up with negative margin).
// `overlap` = false: a normal bar at the top of the search-results page.
export default function BookingBar({ overlap = true }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [dynamicHotels, setDynamicHotels] = useState([])

  // Pre-fill from the URL when present (so the bar on /search reflects the current
  // search); otherwise default check-in to today and check-out to tomorrow.
  const [formData, setFormData] = useState({
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || today(),
    // Guest picks the number of nights; check-out is derived from it.
    // When arriving with checkIn+checkOut in the URL, back-calculate nights.
    nights:
      searchParams.get('checkIn') && searchParams.get('checkOut')
        ? nightsBetween(searchParams.get('checkIn'), searchParams.get('checkOut'))
        : Number(searchParams.get('nights')) || 1,
    guests: searchParams.get('guests') || '2',
    rooms: searchParams.get('rooms') || '1',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelAPI.getPublicHotels()
        if (res.data) setDynamicHotels(res.data)
      } catch (err) {
        console.error('Failed to fetch dynamic hotels', err)
      }
    }
    fetchHotels()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      // Number of nights must be a whole number, at least 1.
      if (name === 'nights') {
        return { ...prev, nights: Math.max(1, parseInt(value || '1', 10)) }
      }
      return { ...prev, [name]: value }
    })
    setError('')
  }

  const handleSearch = (e) => {
    e.preventDefault()

    // Destination + check-in required; check-out is derived from nights.
    if (!formData.destination) {
      setError('Silakan pilih hotel tujuan terlebih dahulu')
      return
    }
    if (!formData.checkIn) {
      setError('Silakan isi tanggal check-in')
      return
    }

    const nights = Math.max(1, parseInt(formData.nights || '1', 10))
    const checkInDate = new Date(formData.checkIn)
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    if (checkInDate < start) {
      setError('Tanggal check-in tidak boleh di masa lalu')
      return
    }

    // Check-out date is calculated automatically from check-in + nights.
    const checkOut = addDays(formData.checkIn, nights)

    const params = new URLSearchParams()
    params.set('destination', formData.destination)
    params.set('checkIn', formData.checkIn)
    params.set('checkOut', checkOut)
    params.set('nights', String(nights))
    params.set('guests', formData.guests)
    params.set('rooms', formData.rooms)

    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className={overlap ? 'relative z-20 mt-6 md:-mt-12' : 'relative z-20'}>
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
                {dynamicHotels.map((h, i) => (
                  <option key={h.id || i} value={h.name} className="bg-hotel-dark">{h.name}</option>
                ))}
              </select>
            </div>

            {/* Check In — defaults to today, cannot pick past dates */}
            <div className="space-y-2">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <CalendarDays size={14} />
                Check-in
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                min={today()}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm
                  focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                  [color-scheme:dark]"
              />
            </div>

            {/* Length of stay — guest picks number of nights; check-out is auto-calculated */}
            <div className="space-y-2 lg:relative">
              <label className="text-gold-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
                <CalendarDays size={14} />
                Jumlah Malam
              </label>
              <input
                type="number"
                name="nights"
                min={1}
                max={30}
                value={formData.nights}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm
                  focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all
                  [color-scheme:dark]"
              />
              {formData.checkIn && (
                <p className="text-white/60 text-[11px] whitespace-nowrap lg:absolute lg:left-0 lg:top-full lg:mt-1">
                  Check-out: {addDays(formData.checkIn, formData.nights)}
                </p>
              )}
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
