import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, BedDouble, ArrowRight } from 'lucide-react'
import { hotelAPI } from '../api/api'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80'

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelAPI.getWebsiteHotels()
        setHotels(res.data || [])
      } catch (error) {
        console.error('Failed to fetch hotels', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Jaringan Kami</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Hotel Kami</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Hotels Listing */}
      <section className="py-16 lg:py-24 bg-hotel-cream/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Pilihan Akomodasi</p>
            <h2 className="section-title mb-4">Temukan Hotel Kami</h2>
            <div className="gold-divider mb-6" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Setiap properti menghadirkan kenyamanan dan pelayanan terbaik untuk pengalaman menginap Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Belum ada hotel yang ditampilkan saat ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={hotel.photo_url || FALLBACK_IMAGE}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    {hotel.room_count > 0 && (
                      <div className="absolute top-4 right-4 bg-hotel-dark/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <BedDouble size={13} className="text-gold-400" />
                        {hotel.room_count} tipe kamar
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-display font-bold text-hotel-dark mb-2">{hotel.name}</h3>
                    {hotel.description && (
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">{hotel.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-gray-500 mb-5">
                      {hotel.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={15} className="text-gold-500 mt-0.5 shrink-0" />
                          <span>{hotel.address}</span>
                        </div>
                      )}
                      {hotel.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-gold-500 shrink-0" />
                          <a href={`tel:${hotel.phone.replace(/\s/g, '')}`} className="hover:text-gold-600 transition-colors">
                            {hotel.phone}
                          </a>
                        </div>
                      )}
                    </div>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      className="mt-auto inline-flex items-center justify-center gap-2 btn-gold rounded-lg text-sm"
                    >
                      Lihat Detail
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
