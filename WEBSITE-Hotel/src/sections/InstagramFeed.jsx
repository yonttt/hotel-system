import { useEffect, useRef } from 'react'
import { galleryImages } from '../data/hotels'
import { Instagram, ExternalLink } from 'lucide-react'

export default function InstagramFeed() {
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

  const displayImages = galleryImages.slice(0, 8)

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-hotel-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-on-scroll">
          <p className="section-subtitle">Momen @ Hotel</p>
          <h2 className="section-title mb-4">Galeri Kenangan</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-xl mx-auto">
            Nikmati kebahagiaan liburan bersama kami. Ikuti kami di media sosial
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {displayImages.map((image, index) => (
            <div
              key={image.id}
              className={`animate-on-scroll group cursor-pointer relative overflow-hidden rounded-xl ${
                index === 0 || index === 5 ? 'row-span-2' : ''
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <img
                src={image.src}
                alt={image.caption}
                className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                  index === 0 || index === 5 ? 'h-full min-h-[300px] md:min-h-[400px]' : 'h-48 md:h-52'
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-white">
                    <Instagram size={16} />
                    <span className="text-sm font-medium">{image.caption}</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <ExternalLink size={18} className="text-white/80" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="text-center mt-12 animate-on-scroll">
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-hotel-dark flex items-center justify-center text-white hover:bg-gold-500 transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-hotel-dark flex items-center justify-center text-white hover:bg-gold-500 transition-colors duration-300"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-hotel-dark flex items-center justify-center text-white hover:bg-gold-500 transition-colors duration-300"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-hotel-dark flex items-center justify-center text-white hover:bg-gold-500 transition-colors duration-300"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <a
            href="#"
            className="text-gold-600 font-semibold text-sm hover:text-gold-500 transition-colors inline-flex items-center gap-2"
          >
            Ikuti Kami Lebih Lanjut
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
