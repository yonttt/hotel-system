import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone, Globe } from 'lucide-react'

const navLinks = [
  { name: 'Beranda', path: '/' },
  { name: 'Kamar & Suite', path: '/rooms' },
  { name: 'Penawaran', path: '/offers' },
  { name: 'Galeri', path: '/gallery' },
  { name: 'Tentang Kami', path: '/about' },
  { name: 'Kontak', path: '/contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  const isHome = location.pathname === '/'
  const navBg = isScrolled || !isHome
    ? 'bg-hotel-dark/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        {/* Top Bar */}
        <div className={`border-b border-white/10 transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-xs text-white/70">
              <div className="flex items-center gap-6">
                <a href="tel:+62211234567" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
                  <Phone size={12} />
                  <span>+62 21 1234 567</span>
                </a>
                <span className="hidden sm:inline">info@hotelresort.com</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 hover:text-gold-400 transition-colors">
                  <Globe size={12} />
                  <span>ID</span>
                  <ChevronDown size={12} />
                </button>
                <a href="/booking" className="hover:text-gold-400 transition-colors hidden sm:block">
                  Member Login
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center group-hover:bg-gold-400 transition-colors">
                <span className="text-white font-display font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-bold text-xl leading-tight tracking-wide">
                  HOTEL
                </span>
                <span className="text-gold-400 text-[10px] tracking-[0.3em] uppercase">
                  & Resort
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link text-sm font-medium tracking-wide ${
                    location.pathname === link.path ? 'active text-gold-400' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/rooms"
                className="bg-gold-500 text-white px-6 py-2.5 text-sm font-semibold tracking-wider 
                  hover:bg-gold-400 transition-all duration-300 uppercase rounded"
              >
                Pesan Sekarang
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-80 bg-hotel-dark shadow-2xl transition-transform duration-300 ${
            isMobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">H</span>
                </div>
                <span className="text-white font-display font-bold text-lg">HOTEL</span>
              </Link>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-white/70 hover:text-white p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                to="/rooms"
                className="block w-full bg-gold-500 text-white text-center px-6 py-3 text-sm font-semibold 
                  tracking-wider hover:bg-gold-400 transition-all duration-300 uppercase rounded"
              >
                Pesan Sekarang
              </Link>
            </div>

            <div className="mt-6 text-white/50 text-xs space-y-2">
              <a href="tel:+62211234567" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
                <Phone size={14} />
                +62 21 1234 567
              </a>
              <p>info@hotelresort.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
