import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, ChevronRight, ArrowUp } from 'lucide-react'
import { fetchCMSContent } from '../data/hotels'

const quickLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Hotel', path: '/hotels' },
  { name: 'Kamar', path: '/rooms' },
  { name: 'Penawaran', path: '/offers' },
  { name: 'Galeri', path: '/gallery' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Kontak', path: '/contact' },
]

const services = [
  'Restoran',
  'WiFi Gratis',
  'Resepsionis 24 Jam',
  'Area Parkir',
  'Lift',
  'Layanan Kamar',
]

export default function Footer() {
  const [cms, setCms] = useState({})

  useEffect(() => {
    fetchCMSContent().then(setCms).catch(() => {})
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-hotel-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">E</span>
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-wide">EVA GROUP</span>
                <span className="text-gold-400 text-xs tracking-[0.3em] uppercase block">Hotel</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Eva Group mengelola jaringan budget hotel yang bersih dan terjangkau di berbagai
              kota di Indonesia sejak 2003, dengan moto “Murah dan Bersih”.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a href="#" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="facebook">
                <span className="text-xs uppercase font-bold">F</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="instagram">
                <span className="text-xs uppercase font-bold">I</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300" aria-label="twitter">
                <span className="text-xs uppercase font-bold">T</span>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer"
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
            <h4 className="text-lg font-display font-bold mb-6 text-gold-400">Fasilitas</h4>
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
                <span>{cms.contact_address || 'Jl. Pramuka Raya No. 26, Matraman, Jakarta Timur, DKI Jakarta 13120'}</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={16} className="text-gold-500 shrink-0" />
                <a href={`tel:${(cms.contact_phone || '+62 21 8580224').replace(/\s/g, '')}`} className="hover:text-gold-400 transition-colors">{cms.contact_phone || '+62 21 8580224'}</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={16} className="text-gold-500 shrink-0" />
                <a href={`mailto:${cms.contact_email || 'info@hotelnewidola.com'}`} className="hover:text-gold-400 transition-colors">{cms.contact_email || 'info@hotelnewidola.com'}</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Clock size={16} className="text-gold-500 shrink-0" />
                <span>24/7 Customer Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              Copyright {new Date().getFullYear()} © Eva Hotel Management Group. All rights reserved.
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
