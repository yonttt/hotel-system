import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building2, Globe } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Terima kasih! Pesan Anda telah dikirim. Tim kami akan segera menghubungi Anda.')
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      lines: ['Jl. Jend. Sudirman No. 123', 'Jakarta Pusat, DKI Jakarta 10220'],
    },
    {
      icon: Phone,
      title: 'Telepon',
      lines: ['+62 21 1234 567', '+62 812 3456 7890 (WhatsApp)'],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: ['info@hotelresort.com', 'reservasi@hotelresort.com'],
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      lines: ['24/7 Customer Service', 'Reception: 06:00 - 23:00'],
    },
  ]

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

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 text-center"
              >
                <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <info.icon size={24} className="text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-hotel-dark mb-3">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-gray-500 text-sm">{line}</p>
                ))}
              </div>
            ))}
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2087634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJl.%20Jend.%20Sudirman%2C%20Jakarta!5e0!3m2!1sid!2sid!4v1630000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Location Map"
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
                  <h4 className="text-white font-display font-bold mb-1">WhatsApp</h4>
                  <p className="text-white/70 text-xs mb-3">Chat langsung dengan kami</p>
                  <a
                    href="https://wa.me/6281234567890"
                    className="bg-white text-green-600 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors inline-block"
                  >
                    Chat WA
                  </a>
                </div>
              </div>

              {/* FAQ Quick */}
              <div className="bg-hotel-cream rounded-2xl p-6">
                <h4 className="font-display font-bold text-hotel-dark mb-4">Pertanyaan Umum</h4>
                <div className="space-y-3">
                  {[
                    'Bagaimana cara melakukan reservasi?',
                    'Apakah tersedia airport transfer?',
                    'Jam check-in dan check-out?',
                    'Apakah ada parking area?',
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-gold-500 font-bold">Q:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
