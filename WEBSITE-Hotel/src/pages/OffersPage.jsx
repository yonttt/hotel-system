import { Link } from 'react-router-dom'
import { ArrowRight, Tag, Clock, Building2, Check } from 'lucide-react'
import { specialOffers } from '../data/hotels'

const extendedOffers = [
  ...specialOffers,
  {
    id: 5,
    title: 'Long Stay Benefit',
    description: 'Menginap 7 malam atau lebih dan dapatkan diskon spesial plus late checkout.',
    discount: '35%',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    badge: 'Long Stay',
    validUntil: '30 Juni 2026',
    hotels: 15,
    benefits: ['Diskon 35%', 'Late Checkout', 'Free Breakfast', 'Airport Transfer'],
  },
  {
    id: 6,
    title: 'Business Travel',
    description: 'Paket khusus untuk pelancong bisnis dengan akses meeting room.',
    discount: '18%',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    badge: 'Business',
    validUntil: '31 Desember 2026',
    hotels: 20,
    benefits: ['Diskon 18%', 'Meeting Room', 'WiFi Premium', 'Executive Lounge'],
  },
]

export default function OffersPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Exclusive Deals</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Penawaran Spesial</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Best Rate Guarantee Banner */}
      <section className="bg-gold-500 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Check size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-display font-bold text-lg">Best Rate Guarantee</h3>
                <p className="text-white/80 text-sm">Harga terbaik dijamin hanya di website resmi kami</p>
              </div>
            </div>
            <button className="bg-white text-gold-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gold-50 transition-colors">
              Menjadi Member
            </button>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {extendedOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-gold-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5">
                    <Tag size={12} />
                    {offer.badge}
                  </div>
                  <div className="absolute top-4 right-4 bg-hotel-dark/90 backdrop-blur text-gold-400 text-3xl font-display font-bold px-5 py-3 rounded-xl">
                    {offer.discount}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-hotel-dark mb-2">{offer.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{offer.description}</p>

                  {/* Benefits */}
                  {offer.benefits && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {offer.benefits.map((b, i) => (
                        <span key={i} className="text-xs bg-gold-50 text-gold-700 px-3 py-1.5 rounded-full flex items-center gap-1">
                          <Check size={10} />
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>s/d {offer.validUntil}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 size={12} />
                      <span>{offer.hotels} Hotel</span>
                    </div>
                  </div>

                  <button className="w-full btn-gold rounded-lg text-center">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative py-20 bg-hotel-dark">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Jangan Lewatkan Penawaran Terbaru
          </h2>
          <p className="text-white/60 mb-8">
            Daftar newsletter kami dan dapatkan notifikasi penawaran eksklusif langsung di inbox
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email Anda"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-white text-sm 
                placeholder-white/40 focus:outline-none focus:border-gold-400 transition-all"
            />
            <button className="bg-gold-500 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors whitespace-nowrap">
              Daftar
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
