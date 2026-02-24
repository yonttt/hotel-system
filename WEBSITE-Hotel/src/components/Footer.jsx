import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, ChevronRight, ArrowUp } from 'lucide-react'

const quickLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Kamar & Suite', path: '/rooms' },
  { name: 'Penawaran', path: '/offers' },
  { name: 'Galeri', path: '/gallery' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Kontak', path: '/contact' },
]

const services = [
  'Spa & Wellness',
  'Restoran & Bar',
  'Meeting & Events',
  'Airport Transfer',
  'Concierge Service',
  'Laundry Service',
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-hotel-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-display font-bold mb-1">Dapatkan Penawaran Eksklusif</h3>
              <p className="text-white/50 text-sm">Daftar newsletter dan dapatkan promo spesial langsung di inbox Anda</p>
            </div>
            <form className="flex w-full md:w-auto gap-2" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="Alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full md:w-80 bg-white/10 border border-white/20 rounded-lg px-5 py-3 text-sm 
                  text-white placeholder-white/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-all"
              />
              <button className="bg-gold-500 hover:bg-gold-400 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
                {subscribed ? '✓ Terdaftar!' : 'Daftar'}
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-sm mt-2 md:mt-0">Terima kasih! Anda akan menerima penawaran eksklusif.</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">H</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-wide">HOTEL</span>
                <span className="text-gold-400 text-xs tracking-[0.3em] uppercase block">& Resort</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Kami adalah merek paling terpercaya yang telah melayani jutaan tamu domestik dan 
              mancanegara selama lebih dari dua dekade.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="https://facebook.com/hotelresort" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="facebook">
                <span className="text-xs uppercase font-bold">F</span>
              </a>
              <a href="https://instagram.com/hotelresort" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="instagram">
                <span className="text-xs uppercase font-bold">I</span>
              </a>
              <a href="https://twitter.com/hotelresort" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="twitter">
                <span className="text-xs uppercase font-bold">T</span>
              </a>
              <a href="https://youtube.com/hotelresort" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="youtube">
                <span className="text-xs uppercase font-bold">Y</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-gold-400">Navigasi</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 text-sm hover:text-gold-400 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="text-gold-500/50 group-hover:text-gold-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-gold-400">Layanan</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm flex items-center gap-2">
                    <ChevronRight size={14} className="text-gold-500/50" />
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-gold-400">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                <span>Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href="tel:+62211234567" className="hover:text-gold-400 transition-colors">+62 21 1234 567</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a href="mailto:info@hotelresort.com" className="hover:text-gold-400 transition-colors">info@hotelresort.com</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-gold-500 shrink-0" />
                <span>24/7 Customer Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certifications Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1">Certified</div>
                <div className="text-sm font-semibold text-white/70">ISO 9001</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1">Certified</div>
                <div className="text-sm font-semibold text-white/70">ISO 14001</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xs text-white/40 mb-1">Certified</div>
                <div className="text-sm font-semibold text-white/70">ISO 45001</div>
              </div>
            </div>
            <div className="text-white/30 text-xs">
              Awards & Recognition ★ Top Hospitality Brand
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              Copyright {new Date().getFullYear()} © Hotel & Resort. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <Link to="/about" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link to="/about" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
              <Link to="/contact" className="hover:text-gold-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gold-500 hover:bg-gold-400 text-white rounded-full
          shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  )
}
