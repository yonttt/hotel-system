import { useState } from 'react'
import { CalendarDays, Users, Search, MapPin } from 'lucide-react'

export default function BookingBar() {
  const [formData, setFormData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Future: Connect to backend availability check
    alert('Fitur pencarian akan segera tersedia! Hubungi kami untuk reservasi.')
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
                <option value="jakarta" className="bg-hotel-dark">Jakarta</option>
                <option value="bali" className="bg-hotel-dark">Bali</option>
                <option value="yogyakarta" className="bg-hotel-dark">Yogyakarta</option>
                <option value="bandung" className="bg-hotel-dark">Bandung</option>
                <option value="surabaya" className="bg-hotel-dark">Surabaya</option>
                <option value="lombok" className="bg-hotel-dark">Lombok</option>
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
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-white font-semibold py-3 px-6 rounded-lg 
                transition-all duration-300 flex items-center justify-center gap-2 
                uppercase tracking-wider text-sm shadow-lg hover:shadow-gold-500/30"
            >
              <Search size={18} />
              <span>Cari</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
