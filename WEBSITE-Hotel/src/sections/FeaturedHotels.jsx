import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, BedDouble, ArrowRight, Users } from 'lucide-react'
import { formatCurrency } from '../data/hotels'
import { hotelAPI } from '../api/api'

const FALLBACK_HOTEL =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'

export default function FeaturedHotels() {
  const sectionRef = useRef(null)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelsRes, roomsRes] = await Promise.all([
          hotelAPI.getWebsiteHotels(),
          hotelAPI.getPublicRooms(),
        ])
        const allRooms = roomsRes.data || []
        const mapped = (hotelsRes.data || []).map((hotel) => ({
          id: hotel.id,
          name: hotel.name,
          image: hotel.photo_url || FALLBACK_HOTEL,
          location: hotel.address || 'Indonesia',
          description: hotel.description,
          roomCount: hotel.room_count || 0,
          // The room types that belong to this hotel — shown as a highlight strip.
          rooms: allRooms.filter((r) => r.hotel_name === hotel.name).slice(0, 4),
        }))
        setHotels(mapped)
      } catch (error) {
        console.error('Failed to fetch hotels:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [hotels])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="section-subtitle">Perjalanan Tak Terlupakan</p>
          <h2 className="section-title mb-4">Hotel-Hotel Pilihan</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan koleksi hotel dan resort terbaik kami beserta tipe kamar unggulannya
          </p>
        </div>

        {/* Hotels */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : hotels.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada hotel yang ditampilkan saat ini.</p>
        ) : (
          <div className="space-y-10">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="animate-on-scroll bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Hotel header: image + info */}
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden group">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {hotel.roomCount > 0 && (
                      <div className="absolute top-4 left-4 bg-hotel-dark/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <BedDouble size={13} className="text-gold-400" />
                        {hotel.roomCount} tipe kamar
                      </div>
                    )}
                  </div>
                  <div className="lg:w-3/5 p-7 lg:p-9 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-hotel-dark mb-2">{hotel.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                      <MapPin size={15} className="text-gold-500" />
                      <span>{hotel.location}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                      {hotel.description ||
                        `${hotel.name} menghadirkan kenyamanan dan pelayanan terbaik dengan beragam pilihan tipe kamar untuk pengalaman menginap yang istimewa.`}
                    </p>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="btn-gold rounded-full inline-flex items-center gap-2 self-start"
                    >
                      Lihat Detail Hotel
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Room highlights for this hotel */}
                {hotel.rooms.length > 0 && (
                  <div className="border-t border-gray-100 p-6 lg:p-8 bg-hotel-cream/30">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gold-600 mb-4">
                      Tipe Kamar Unggulan
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {hotel.rooms.map((room) => (
                        <Link
                          key={room.id}
                          to={`/booking?room=${room.id}`}
                          className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={room.image}
                              alt={room.category_name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                            />
                            {room.discount_percentage > 0 && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                -{room.discount_percentage}%
                              </span>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm font-semibold text-hotel-dark truncate">{room.category_name}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                              <span className="flex items-center gap-1"><Users size={11} /> {room.capacity}</span>
                              <span>·</span>
                              <span>{room.size}</span>
                            </div>
                            <p className="text-sm font-bold text-gold-600 mt-1.5">
                              {formatCurrency(room.published_rate ?? room.normal_rate)}<span title="Belum termasuk pajak & layanan">++</span>
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link
            to="/hotels"
            className="btn-outline-gold rounded-full inline-flex items-center gap-2"
          >
            Lihat Semua Hotel
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
