import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Tag, Clock, Building2 } from 'lucide-react'
import { specialOffers } from '../data/hotels'

export default function SpecialOffers() {
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-hotel-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="text-gold-400 tracking-[0.3em] uppercase text-sm font-semibold mb-3">
            Penawaran Spesial
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Promo Menarik untuk Anda
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-white/60 max-w-2xl mx-auto">
            Nikmati penawaran eksklusif dan harga terbaik untuk pengalaman menginap yang tak terlupakan
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialOffers.map((offer, index) => (
            <div
              key={offer.id}
              className="animate-on-scroll group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur border border-white/10 hover:border-gold-500/50 transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-gold-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Tag size={12} />
                  {offer.badge}
                </div>
                <div className="absolute top-3 right-3 bg-hotel-dark/80 backdrop-blur text-gold-400 text-2xl font-display font-bold px-4 py-2 rounded-xl">
                  {offer.discount}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-display font-bold text-white mb-2">{offer.title}</h3>
                <p className="text-white/50 text-sm mb-4 leading-relaxed">{offer.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{offer.validUntil}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 size={12} />
                    <span>{offer.hotels} Hotel</span>
                  </div>
                </div>
                <Link
                  to="/offers"
                  className="inline-flex items-center gap-1.5 text-gold-400 text-sm font-semibold hover:text-gold-300 transition-colors group/link"
                >
                  Selengkapnya
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <Link to="/offers" className="btn-outline-white rounded-full inline-flex items-center gap-2">
            Lihat Semua Penawaran
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
