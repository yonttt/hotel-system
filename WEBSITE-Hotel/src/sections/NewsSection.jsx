import { useEffect, useRef } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { newsItems } from '../data/hotels'

export default function NewsSection() {
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="section-subtitle">Publikasi Media</p>
          <h2 className="section-title mb-4">Berita Terbaru</h2>
          <div className="gold-divider mb-6" />
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, index) => (
            <article
              key={item.id}
              className="animate-on-scroll group cursor-pointer"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar size={12} />
                    {item.date}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gold-600 font-semibold mb-2 uppercase tracking-wider">{item.hotel}</p>
                  <h3 className="text-base font-display font-bold text-hotel-dark mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-gold-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    Baca Selengkapnya
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 animate-on-scroll">
          <button className="btn-outline-gold rounded-full inline-flex items-center gap-2">
            Tampilkan Berita Lainnya
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
