import { useState, useEffect, useCallback } from 'react'
import { galleryImages } from '../data/hotels'
import { X, ChevronLeft, ChevronRight, Instagram, ZoomIn } from 'lucide-react'

const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'exterior', label: 'Eksterior' },
  { key: 'rooms', label: 'Kamar' },
  { key: 'dining', label: 'Kuliner' },
  { key: 'spa', label: 'Spa' },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory)

  const openLightbox = (index) => setLightbox({ open: true, index })
  const closeLightbox = () => setLightbox({ open: false, index: 0 })

  const nextImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % filteredImages.length,
    }))
  }

  const prevImage = () => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + filteredImages.length) % filteredImages.length,
    }))
  }

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e) => {
    if (!lightbox.open) return
    if (e.key === 'Escape') closeLightbox()
    else if (e.key === 'ArrowRight') nextImage()
    else if (e.key === 'ArrowLeft') prevImage()
  }, [lightbox.open, filteredImages.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Visual Journey</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Galeri</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded-xl"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <ZoomIn size={32} className="text-white mx-auto mb-2" />
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox.open && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-10"
          >
            <X size={28} />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2"
          >
            <ChevronRight size={36} />
          </button>
          <div className="max-w-5xl max-h-[85vh] p-4">
            <img
              src={filteredImages[lightbox.index]?.src}
              alt={filteredImages[lightbox.index]?.caption}
              className="max-w-full max-h-[80vh] object-contain mx-auto rounded-lg"
            />
            <p className="text-white text-center mt-4 text-sm">
              {filteredImages[lightbox.index]?.caption} — {lightbox.index + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Instagram CTA */}
      <section className="py-16 bg-hotel-dark text-center">
        <div className="max-w-xl mx-auto px-4">
          <Instagram size={40} className="text-gold-400 mx-auto mb-4" />
          <h3 className="text-2xl font-display font-bold text-white mb-3">Ikuti Kami di Instagram</h3>
          <p className="text-white/50 text-sm mb-6">
            Bagikan momen liburan Anda bersama kami dengan hashtag #HotelResortMoments
          </p>
          <a
            href="https://instagram.com/hotelresort"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Instagram size={18} />
            @hotelresort
          </a>
        </div>
      </section>
    </>
  )
}
