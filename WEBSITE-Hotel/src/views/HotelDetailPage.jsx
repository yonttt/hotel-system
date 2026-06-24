import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Users, Maximize2, ArrowRight, Phone, Mail, BedDouble, Check, Wifi, Waves, Utensils, Dumbbell, Coffee } from 'lucide-react'
import { formatCurrency } from '../data/hotels'
import { hotelAPI } from '../api/api'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80'

// We don't track per-hotel facilities in the database yet, so show a standard set
// of amenities every property offers.
const standardFacilities = [
  { name: 'WiFi Gratis', Icon: Wifi },
  { name: 'Restoran', Icon: Utensils },
  { name: 'Kolam Renang', Icon: Waves },
  { name: 'Fitness Center', Icon: Dumbbell },
  { name: 'Layanan Kamar', Icon: Coffee },
  { name: 'Resepsionis 24 Jam', Icon: Check },
]

export default function HotelDetailPage() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [hotelsRes, roomsRes] = await Promise.all([
          hotelAPI.getWebsiteHotels(),
          hotelAPI.getPublicRooms(),
        ])
        const found = (hotelsRes.data || []).find((h) => h.id === Number(id)) || null
        setHotel(found)
        if (found) {
          const hotelRooms = (roomsRes.data || []).filter((r) => r.hotel_name === found.name)
          setRooms(hotelRooms)
        }
      } catch (error) {
        console.error('Failed to load hotel detail', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </section>
    )
  }

  if (!hotel) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-hotel-dark mb-4">Hotel Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Maaf, hotel yang Anda cari tidak tersedia.</p>
          <Link to="/hotels" className="btn-gold rounded-lg">Lihat Semua Hotel</Link>
        </div>
      </section>
    )
  }

  const description =
    hotel.description ||
    `${hotel.name} menghadirkan kenyamanan dan pelayanan terbaik untuk setiap tamu. Dengan ${rooms.length || 'beragam'} tipe kamar yang dirancang untuk kenyamanan maksimal, setiap tamu akan merasakan pengalaman menginap yang tak terlupakan.`

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.photo_url || FALLBACK_IMAGE})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark/90 via-hotel-dark/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <p className="text-gold-400 tracking-[0.3em] uppercase text-sm font-medium mb-3">Hotel</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">{hotel.name}</h1>
          {hotel.address && (
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} />
              <span>{hotel.address}</span>
            </div>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">{rooms.length || hotel.room_count || 0}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Tipe Kamar</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">{standardFacilities.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Fasilitas</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">24/7</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Layanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Facilities */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* About */}
            <div>
              <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Tentang Hotel</p>
              <h2 className="text-3xl font-display font-bold text-hotel-dark mb-6">{hotel.name}</h2>
              <p className="text-gray-500 leading-relaxed mb-8">{description}</p>

              {/* Contact */}
              <div className="space-y-3 mb-8">
                {hotel.address && (
                  <div className="flex items-start gap-3 text-gray-600 text-sm">
                    <MapPin size={18} className="text-gold-500 mt-0.5 shrink-0" />
                    <span>{hotel.address}</span>
                  </div>
                )}
                {hotel.phone && (
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Phone size={18} className="text-gold-500 shrink-0" />
                    <a href={`tel:${hotel.phone.replace(/\s/g, '')}`} className="hover:text-gold-600 transition-colors">{hotel.phone}</a>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Mail size={18} className="text-gold-500 shrink-0" />
                    <a href={`mailto:${hotel.email}`} className="hover:text-gold-600 transition-colors">{hotel.email}</a>
                  </div>
                )}
              </div>

              <Link to="/booking" className="btn-gold rounded-lg inline-flex items-center gap-2">
                Reservasi Sekarang
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Facilities */}
            <div>
              <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Fasilitas</p>
              <h2 className="text-3xl font-display font-bold text-hotel-dark mb-6">Fasilitas Unggulan</h2>
              <div className="grid grid-cols-2 gap-4">
                {standardFacilities.map(({ name, Icon }) => (
                  <div key={name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <Icon size={24} className="text-gold-500 mb-3" />
                    <p className="font-semibold text-hotel-dark text-sm">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section
        className="py-16 lg:py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('https://images.unsplash.com/photo-1590080876286-cd827bcf3e60?w=1920&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Akomodasi</p>
            <h2 className="text-3xl font-display font-bold text-hotel-dark mb-4">Tipe Kamar Tersedia</h2>
            <div className="gold-divider" />
          </div>

          {rooms.length === 0 ? (
            <p className="text-center text-gray-400">Belum ada tipe kamar yang tersedia untuk hotel ini.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
                  <div className="relative h-48 overflow-hidden">
                    <img src={room.image} alt={room.category_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-3 right-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {formatCurrency(room.published_rate ?? room.normal_rate)}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-hotel-dark mb-2">{room.category_name}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1"><Maximize2 size={12} /> {room.size}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} Tamu</span>
                    </div>
                    {typeof room.available_rooms === 'number' && (
                      <p className={`text-xs font-semibold mb-3 flex items-center gap-1.5 ${room.available_rooms > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        <BedDouble size={12} />
                        {room.available_rooms > 0 ? `${room.available_rooms} kamar tersedia` : 'Kamar penuh'}
                      </p>
                    )}
                    {room.available_rooms === 0 ? (
                      <span className="block w-full bg-gray-200 text-gray-500 py-2 rounded-lg text-center text-sm font-semibold cursor-not-allowed">
                        Kamar Penuh
                      </span>
                    ) : (
                      <Link
                        to={`/booking?room=${room.id}`}
                        className="block w-full bg-gold-500 hover:bg-gold-400 text-white py-2 rounded-lg text-center text-sm font-semibold transition-colors"
                      >
                        Pesan
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-hotel-dark">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Siap Untuk Pengalaman Terbaik?
          </h2>
          <p className="text-white/60 mb-8">
            Hubungi kami untuk informasi lebih lanjut atau langsung lakukan reservasi
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-gold rounded-lg inline-flex items-center gap-2">
              Reservasi Sekarang
              <ArrowRight size={16} />
            </Link>
            {hotel.phone && (
              <a href={`tel:${hotel.phone.replace(/\s/g, '')}`} className="btn-outline-white rounded-lg inline-flex items-center gap-2">
                <Phone size={16} />
                {hotel.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
