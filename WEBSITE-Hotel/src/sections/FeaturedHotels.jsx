import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, ArrowRight } from 'lucide-react'
import { hotelProperties } from '../data/hotels'

export default function FeaturedHotels() {
  const sectionRef = useRef(null)

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
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-hotel-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="section-subtitle">Perjalanan Tak Terlupakan</p>
          <h2 className="section-title mb-4">Hotel-Hotel Pilihan</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan koleksi hotel dan resort terbaik kami yang tersebar di seluruh Indonesia
          </p>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotelProperties.map((hotel, index) => (
            <div
              key={hotel.id}
              className="animate-on-scroll group"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="card-overlay rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <div className="relative h-72">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-center gap-1 text-gold-400 mb-2">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-medium text-white">{hotel.rating}</span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <MapPin size={14} />
                      <span>{hotel.location}</span>
                    </div>
                  </div>
                  {/* Hover CTA */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to="/rooms"
                      className="bg-gold-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold
                        flex items-center gap-2 hover:bg-gold-400 transition-colors transform
                        translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      Lihat Detail
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link
            to="/about"
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
