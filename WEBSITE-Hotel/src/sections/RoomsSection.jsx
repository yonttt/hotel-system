import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bed, Maximize2, Users } from 'lucide-react'
import { formatCurrency, fetchCMSContent } from '../data/hotels'
import { hotelAPI } from '../api/api'
import HotelFilter from '../ui/HotelFilter'

export default function RoomsSection() {
  const sectionRef = useRef(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [cms, setCms] = useState({})
  const [selectedHotel, setSelectedHotel] = useState('')

  useEffect(() => {
    fetchCMSContent().then(setCms).catch(() => {})
  }, [])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await hotelAPI.getPublicRooms()
        const mappedRooms = response.data.map(room => ({
          id: room.id,
          name: room.category_name || room.category_code,
          hotelName: room.hotel_name,
          description: room.description || `Menginap dengan nyaman di tipe ${room.category_name} di ${room.hotel_name}.`,
          size: room.size || '30 sqm',
          bed: room.bed_type || 'King Bed',
          guests: room.capacity || 2,
          amenities: room.amenities || ['WiFi', 'AC', 'TV', 'Minibar'],
          price: room.published_rate ?? room.normal_rate ?? 250000,
          originalPrice: room.discount_percentage > 0 ? (room.original_rate ?? room.normal_rate) : null,
          discountPercentage: room.discount_percentage || 0,
          availableRooms: room.available_rooms,
          image: room.image || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        }))

        setRooms(mappedRooms)
      } catch (error) {
        console.error("Failed to fetch rooms:", error)
        setRooms([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchRooms()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
    // Re-run after rooms load / filter changes so the newly-rendered cards get
    // observed (otherwise they stay at opacity:0 and the section looks empty).
  }, [rooms, selectedHotel])

  const hotelNames = [...new Set(rooms.map((r) => r.hotelName).filter(Boolean))]
  const displayedRooms = (selectedHotel ? rooms.filter((r) => r.hotelName === selectedHotel) : rooms).slice(0, 4)

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 bg-hotel-cream"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-on-scroll">
          <p className="section-subtitle">{cms.rooms_subtitle || 'Akomodasi Premium'}</p>
          <h2 className="section-title mb-4">{cms.rooms_title || 'Kamar'}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            {cms.rooms_description || 'Pilih dari berbagai tipe kamar yang dirancang untuk kenyamanan dan kemewahan maksimal'}
          </p>
        </div>

        {/* Hotel Filter */}
        {hotelNames.length > 0 && (
          <div className="flex justify-center mb-12 animate-on-scroll">
            <HotelFilter hotels={hotelNames} value={selectedHotel} onChange={setSelectedHotel} />
          </div>
        )}

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : displayedRooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              {selectedHotel
                ? 'Belum ada kamar untuk hotel ini.'
                : 'Belum ada kamar yang tersedia saat ini.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedRooms.map((room, index) => (
              <div
                key={room.id}
                className="animate-on-scroll group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                {room.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    DISKON {room.discountPercentage}%
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-hotel-dark/80 backdrop-blur text-white px-4 py-2 rounded-full text-right">
                  <span className="text-xs text-gold-400">Mulai dari</span>
                  {room.originalPrice && (
                    <p className="text-xs font-normal text-white/50 line-through">{formatCurrency(room.originalPrice)}</p>
                  )}
                  <p className="text-sm font-bold">{formatCurrency(room.price)}<span className="text-xs font-normal text-white/70">/malam</span></p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display font-bold text-hotel-dark mb-2">{room.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{room.description}</p>

                {/* Availability */}
                {typeof room.availableRooms === 'number' && (
                  <div className="mb-4">
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

                {/* Room Details */}
                <div className="flex items-center gap-6 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Maximize2 size={14} className="text-gold-500" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed size={14} className="text-gold-500" />
                    <span>{room.bed}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-gold-500" />
                    <span>{room.guests} Tamu</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {room.amenities.slice(0, 4).map((amenity, i) => (
                    <span key={i} className="text-xs bg-hotel-cream px-3 py-1 rounded-full text-hotel-dark/70">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 4 && (
                    <span className="text-xs bg-gold-100 px-3 py-1 rounded-full text-gold-700">
                      +{room.amenities.length - 4} lainnya
                    </span>
                  )}
                </div>

                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 text-gold-600 font-semibold text-sm hover:text-gold-500 transition-colors group/link"
                >
                  Lihat Detail
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link to="/rooms" className="btn-gold rounded-full inline-flex items-center gap-2">
            Lihat Semua Kamar
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
