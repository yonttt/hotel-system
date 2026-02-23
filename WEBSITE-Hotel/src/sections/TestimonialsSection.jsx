import { useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { testimonials } from '../data/hotels'

export default function TestimonialsSection() {
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
    <section
      ref={sectionRef}
      className="py-20 lg:py-28 relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80)',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-hotel-dark/85" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="text-gold-400 tracking-[0.3em] uppercase text-sm font-semibold mb-3">
            Testimoni
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Apa Kata Tamu Kami
          </h2>
          <div className="gold-divider" />
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={item.id}
              className="animate-on-scroll bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Quote size={32} className="text-gold-500/40 mb-4" />
              <p className="text-white/80 leading-relaxed mb-6 italic font-light">
                "{item.text}"
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-gold-400" fill="currentColor" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold-500/50"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{item.name}</p>
                  <p className="text-white/50 text-xs">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Best Rate Guarantee */}
        <div className="mt-16 text-center animate-on-scroll">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gold-500/10 border border-gold-500/30 rounded-2xl px-8 py-6">
            <div className="text-left">
              <h3 className="text-xl font-display font-bold text-white">Best Rate Guarantee</h3>
              <p className="text-white/60 text-sm">Temukan harga terbaik langsung di website kami</p>
            </div>
            <button className="bg-gold-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-400 transition-colors whitespace-nowrap">
              Menjadi Member
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
