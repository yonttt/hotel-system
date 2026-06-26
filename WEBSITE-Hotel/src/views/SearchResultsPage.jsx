import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bed, Maximize2, Users, MapPin, CalendarDays } from 'lucide-react'
import { formatCurrency } from '../data/hotels'
import { hotelAPI } from '../api/api'
import BookingBar from '../ui/BookingBar'

// Pretty date like "25 Jun 2026" from a YYYY-MM-DD string.
const fmtDate = (s) => {
  if (!s) return ''
  const d = new Date(s)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const destination = searchParams.get('destination') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guests = Number(searchParams.get('guests') || '2')
  const rooms = searchParams.get('rooms') || '1'

  const [allRooms, setAllRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        const response = await hotelAPI.getPublicRooms()
        const mapped = (response.data || []).map((room) => ({
          id: room.id,
          name: room.category_name || room.category_code,
          hotelName: room.hotel_name,
          description:
            room.description ||
            `Menginap dengan nyaman di tipe ${room.category_name} di ${room.hotel_name}.`,
          price: room.published_rate ?? room.normal_rate ?? 250000,
          originalPrice:
            room.discount_percentage > 0 ? (room.original_rate ?? room.normal_rate) : null,
          discountPercentage: room.discount_percentage || 0,
          availableRooms: room.available_rooms,
          size: room.size || '30 m²',
          bed: room.bed_type || 'King Size',
          guests: room.capacity || 2,
          amenities: room.amenities || ['WiFi Gratis', 'AC', 'TV LED', 'Room Service'],
          image:
            room.image ||
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
        }))
        setAllRooms(mapped)
      } catch (error) {
        console.error('Failed to fetch rooms', error)
        setAllRooms([])
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  // Match the chosen hotel, and only rooms that can hold the requested guests.
  const results = allRooms.filter((r) => {
    const matchHotel = destination ? r.hotelName === destination : true
    const matchGuests = r.guests >= guests
    return matchHotel && matchGuests
  })

  // Carry the search context into the booking wizard.
  const bookingLink = (roomId) => {
    const params = new URLSearchParams()
    params.set('room', roomId)
    if (destination) params.set('destination', destination)
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    params.set('rooms', rooms)
    return `/booking?${params.toString()}`
  }

  return (
    <>
      {/* Spacer clears the fixed navbar so it's visible at the very top of the page */}
      <div className="h-28 bg-hotel-dark" />

      {/* Sticky search bar — sticks to the very top and (because z-[60] sits above
          the navbar's z-50, with a full-width opaque background) covers the navbar
          as the guest scrolls. Result: only the booking bar follows the scroll,
          the navbar disappears behind it. */}
      <div className="sticky top-0 z-[60] bg-hotel-dark shadow-xl py-5">
        <BookingBar overlap={false} />
      </div>

      {/* Results */}
      <section className="bg-hotel-cream py-12 lg:py-16 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary line */}
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 font-semibold text-hotel-dark">
              <MapPin size={16} className="text-gold-500" />
              {destination || 'Semua Hotel'}
            </span>
            {checkIn && checkOut && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={16} className="text-gold-500" />
                {fmtDate(checkIn)} &ndash; {fmtDate(checkOut)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={16} className="text-gold-500" />
              {guests} Tamu, {rooms} Kamar
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg font-semibold mb-2">
                Tidak ada kamar yang cocok dengan pencarian Anda.
              </p>
              <p className="text-gray-400 text-sm">
                Coba pilih hotel lain atau kurangi jumlah tamu.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">
                {results.length} kamar ditemukan
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                  >
                    <div className="relative h-52 overflow-hidden group">
                      <img
                        src={room.image}
                        alt={room.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        {room.originalPrice && (
                          <span className="text-xs line-through text-white/70 mr-1">
                            {formatCurrency(room.originalPrice)}
                          </span>
                        )}
                        {formatCurrency(room.price)}<span title="Belum termasuk pajak & layanan">++</span>/malam
                      </div>
                      {room.discountPercentage > 0 && (
                        <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          DISKON {room.discountPercentage}%
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-gold-600 font-semibold uppercase tracking-wider mb-1">
                        {room.hotelName}
                      </p>
                      <h3 className="text-xl font-display font-bold text-hotel-dark mb-2">
                        {room.name}
                      </h3>

                      {typeof room.availableRooms === 'number' && (
                        <div className="mb-3">
                          {room.availableRooms > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              {room.availableRooms} kamar tersedia
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              Kamar penuh
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-5">
                        <span className="flex items-center gap-1"><Maximize2 size={13} /> {room.size}</span>
                        <span className="flex items-center gap-1"><Bed size={13} /> {room.bed}</span>
                        <span className="flex items-center gap-1"><Users size={13} /> {room.guests} Tamu</span>
                      </div>

                      <Link
                        to={bookingLink(room.id)}
                        className={`mt-auto w-full text-center font-semibold py-3 px-6 rounded-lg uppercase tracking-wider text-sm transition-all ${
                          room.availableRooms === 0
                            ? 'bg-gray-200 text-gray-400 pointer-events-none'
                            : 'bg-gold-500 hover:bg-gold-400 text-white'
                        }`}
                      >
                        {room.availableRooms === 0 ? 'Kamar Penuh' : 'Pilih Kamar Ini'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
