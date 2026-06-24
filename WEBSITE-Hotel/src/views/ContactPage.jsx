import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building2, ChevronDown } from 'lucide-react'
import { useNotification } from '../state/NotificationContext'
import { hotelAPI } from '../api/api'
import HotelFilter from '../ui/HotelFilter'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const { showNotification } = useNotification()

  const [hotels, setHotels] = useState([])
  const [selectedHotel, setSelectedHotel] = useState('')

  useEffect(() => {
    hotelAPI.getWebsiteHotels().then((r) => setHotels(r.data || [])).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    showNotification('success', 'Message sent successfully! We will get back to you soon.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const hotelNames = hotels.map((h) => h.name)
  const displayedHotels = selectedHotel ? hotels.filter((h) => h.name === selectedHotel) : hotels
  // The hotel whose map/phone is featured: the selected one, else the first.
  const activeHotel = (selectedHotel ? hotels.find((h) => h.name === selectedHotel) : hotels[0]) || null
  const mapQuery = activeHotel
    ? encodeURIComponent(`${activeHotel.name} ${activeHotel.address || ''}`)
    : 'Hotel'
  // Keep the cards balanced & centered regardless of how many hotels there are.
  const cardGridCls =
    displayedHotels.length === 1
      ? 'grid-cols-1 max-w-md'
      : displayedHotels.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl'

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Get in Touch</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Hubungi Kami</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Hotel Filter bar */}
      {hotelNames.length > 0 && (
        <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
            <HotelFilter hotels={hotelNames} value={selectedHotel} onChange={setSelectedHotel} />
          </div>
        </section>
      )}

      {/* Hotel Contact Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8">
            {displayedHotels.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center w-full">
                <p className="text-gray-400">Informasi kontak hotel belum tersedia.</p>
              </div>
            ) : (
              <div className={`grid gap-6 w-full mx-auto ${cardGridCls}`}>
                {displayedHotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 size={22} className="text-gold-600" />
                      </div>
                      <h3 className="font-display font-bold text-hotel-dark leading-tight">{hotel.name}</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-500">
                      {hotel.address && (
                        <li className="flex items-start gap-2.5">
                          <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
                          <span>{hotel.address}</span>
                        </li>
                      )}
                      {hotel.phone && (
                        <li className="flex items-center gap-2.5">
                          <Phone size={16} className="text-gold-500 shrink-0" />
                          <a href={`tel:${hotel.phone.replace(/\s/g, '')}`} className="hover:text-gold-600 transition-colors">
                            {hotel.phone}
                          </a>
                        </li>
                      )}
                      {hotel.email && (
                        <li className="flex items-center gap-2.5">
                          <Mail size={16} className="text-gold-500 shrink-0" />
                          <a href={`mailto:${hotel.email}`} className="hover:text-gold-600 transition-colors">
                            {hotel.email}
                          </a>
                        </li>
                      )}
                      <li className="flex items-center gap-2.5">
                        <Clock size={16} className="text-gold-500 shrink-0" />
                        <span>24/7 Customer Service</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <p className="section-subtitle text-left">Kirim Pesan</p>
              <h2 className="text-3xl font-display font-bold text-hotel-dark mb-2">
                Ada Pertanyaan?
              </h2>
              <p className="text-gray-500 mb-8">
                Isi formulir di bawah dan tim kami akan segera menghubungi Anda
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-hotel-dark mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none 
                        focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-hotel-dark mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none 
                        focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-hotel-dark mb-2">Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+62 812 3456 7890"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none 
                        focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-hotel-dark mb-2">Subjek *</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none 
                        focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all appearance-none"
                    >
                      <option value="">Pilih subjek</option>
                      <option value="reservation">Reservasi</option>
                      <option value="inquiry">Pertanyaan Umum</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Kerjasama</option>
                      <option value="event">Event & Meeting</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-hotel-dark mb-2">Pesan *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none 
                      focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold rounded-xl inline-flex items-center gap-2"
                >
                  <Send size={16} />
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Map / Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-80">
                <iframe
                  src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title={activeHotel ? `Lokasi ${activeHotel.name}` : 'Location Map'}
                />
              </div>

              {/* Quick Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-hotel-dark rounded-2xl p-6 text-center">
                  <MessageSquare size={28} className="text-gold-400 mx-auto mb-3" />
                  <h4 className="text-white font-display font-bold mb-1">Live Chat</h4>
                  <p className="text-white/50 text-xs mb-3">Respon cepat 24/7</p>
                  <button className="bg-gold-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gold-400 transition-colors">
                    Mulai Chat
                  </button>
                </div>
                <div className="bg-green-600 rounded-2xl p-6 text-center">
                  <Phone size={28} className="text-white mx-auto mb-3" />
                  <h4 className="text-white font-display font-bold mb-1">Telepon</h4>
                  <p className="text-white/70 text-xs mb-3">
                    {activeHotel ? `Hubungi ${activeHotel.name}` : 'Hubungi kami langsung'}
                  </p>
                  {activeHotel?.phone && (
                    <a
                      href={`tel:${activeHotel.phone.replace(/\s/g, '')}`}
                      className="bg-white text-green-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors inline-block"
                    >
                      Panggil {activeHotel.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* FAQ Quick */}
              <FaqSection />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const faqData = [
  { q: 'Bagaimana cara melakukan reservasi?', a: 'Anda dapat melakukan reservasi melalui website kami dengan mengklik tombol "Pesan Sekarang" di halaman Kamar, atau hubungi kami melalui telepon/WhatsApp.' },
  { q: 'Apakah tersedia airport transfer?', a: 'Ya, kami menyediakan layanan airport transfer untuk semua tamu. Silakan informasikan detail penerbangan Anda saat melakukan reservasi.' },
  { q: 'Jam check-in dan check-out?', a: 'Check-in mulai pukul 14:00 dan check-out paling lambat pukul 12:00. Early check-in dan late check-out tersedia sesuai ketersediaan.' },
  { q: 'Apakah ada parking area?', a: 'Ya, kami menyediakan area parkir gratis untuk tamu hotel. Tersedia parkir valet untuk tamu suite.' },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="bg-hotel-cream rounded-2xl p-6">
      <h4 className="font-display font-bold text-hotel-dark mb-4">Pertanyaan Umum</h4>
      <div className="space-y-2">
        {faqData.map((item, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-2 text-left p-4 text-sm font-medium text-gray-700 hover:text-hotel-dark transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                size={16}
                className={`text-gold-500 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
