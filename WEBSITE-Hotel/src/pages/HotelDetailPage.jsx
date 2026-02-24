import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Users, Bed, Maximize2, Check, ArrowRight, Phone, Wifi, Waves, Dumbbell, Utensils, Coffee, Baby } from 'lucide-react'
import { hotelProperties, featuredRooms, formatCurrency } from '../data/hotels'

const facilityIcons = {
  'Kolam Renang': Waves,
  'Spa & Wellness': Coffee,
  'Restoran': Utensils,
  'Fitness Center': Dumbbell,
  'Business Center': Wifi,
  'Kids Club': Baby,
}

const hotelFacilities = {
  1: ['Kolam Renang', 'Spa & Wellness', 'Restoran', 'Fitness Center', 'Business Center', 'Kids Club'],
  2: ['Kolam Renang', 'Spa & Wellness', 'Restoran', 'Fitness Center', 'Kids Club'],
  3: ['Kolam Renang', 'Restoran', 'Fitness Center', 'Business Center'],
  4: ['Kolam Renang', 'Spa & Wellness', 'Restoran', 'Fitness Center'],
  5: ['Restoran', 'Fitness Center', 'Business Center'],
  6: ['Kolam Renang', 'Spa & Wellness', 'Restoran', 'Kids Club'],
}

const hotelDescriptions = {
  1: 'Hotel premium di jantung kota Jakarta dengan akses mudah ke pusat bisnis dan hiburan. Menawarkan pemandangan skyline yang menakjubkan dan layanan kelas dunia.',
  2: 'Resort tropis mewah di Bali dengan pantai pribadi, villa terapung, dan pengalaman spa autentik. Sempurna untuk liburan romantis dan keluarga.',
  3: 'Hotel heritage elegan yang menggabungkan arsitektur Jawa tradisional dengan kenyamanan modern. Dekat dengan Candi Borobudur dan Kraton Yogyakarta.',
  4: 'Resort pegunungan sejuk dengan udara segar dan pemandangan alam yang memukau. Ideal untuk retreat dan relaksasi dari hiruk pikuk kota.',
  5: 'Hotel bisnis modern dengan fasilitas meeting lengkap dan lokasi strategis di pusat kota Surabaya. Konektivitas sempurna untuk pelancong bisnis.',
  6: 'Beach resort eksklusif dengan pasir putih dan air laut kristal. Menawarkan snorkeling, diving, dan sunset cruise yang tak terlupakan.',
}

export default function HotelDetailPage() {
  const { id } = useParams()
  const hotel = hotelProperties.find(h => h.id === Number(id))

  if (!hotel) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-hotel-dark mb-4">Hotel Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Maaf, hotel yang Anda cari tidak tersedia.</p>
          <Link to="/rooms" className="btn-gold rounded-lg">Lihat Semua Kamar</Link>
        </div>
      </section>
    )
  }

  const facilities = hotelFacilities[hotel.id] || []
  const description = hotelDescriptions[hotel.id] || ''

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-end">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${hotel.image})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-hotel-dark/90 via-hotel-dark/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex items-center gap-1 text-gold-400 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" className={i < Math.round(hotel.rating) ? 'text-gold-400' : 'text-gray-500'} />
            ))}
            <span className="text-white text-sm ml-2">{hotel.rating}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3">{hotel.name}</h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={16} />
            <span>{hotel.location}, Indonesia</span>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">{hotel.rooms}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Kamar</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">{hotel.rating}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Rating</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">{facilities.length}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Fasilitas</p>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div>
              <p className="text-2xl font-display font-bold text-gold-500">24/7</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Layanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Facilities */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* About */}
            <div>
              <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Tentang Hotel</p>
              <h2 className="text-3xl font-display font-bold text-hotel-dark mb-6">{hotel.name}</h2>
              <p className="text-gray-500 leading-relaxed mb-6">{description}</p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Dengan {hotel.rooms} kamar yang dirancang untuk memberikan kenyamanan maksimal, 
                setiap tamu akan merasakan pengalaman menginap yang tak terlupakan. Staf kami yang 
                terlatih siap melayani kebutuhan Anda selama 24 jam.
              </p>
              <Link to="/booking" className="btn-gold rounded-lg inline-flex items-center gap-2">
                Reservasi Sekarang
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Facilities */}
            <div>
              <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Fasilitas</p>
              <h2 className="text-3xl font-display font-bold text-hotel-dark mb-6">Fasilitas Unggulan</h2>
              <div className="grid grid-cols-2 gap-4">
                {facilities.map((facility) => {
                  const Icon = facilityIcons[facility] || Check
                  return (
                    <div key={facility} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <Icon size={24} className="text-gold-500 mb-3" />
                      <p className="font-semibold text-hotel-dark text-sm">{facility}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rooms */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold-500 text-sm font-semibold tracking-widest uppercase mb-3">Akomodasi</p>
            <h2 className="text-3xl font-display font-bold text-hotel-dark mb-4">Tipe Kamar Tersedia</h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRooms.map((room) => (
              <div key={room.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-3 right-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {formatCurrency(room.price)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-hotel-dark mb-2">{room.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Maximize2 size={12} /> {room.size}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {room.guests}</span>
                  </div>
                  <Link
                    to={`/booking?room=${room.id}`}
                    className="block w-full bg-gold-500 hover:bg-gold-400 text-white py-2 rounded-lg text-center text-sm font-semibold transition-colors"
                  >
                    Pesan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-hotel-dark">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Siap Untuk Pengalaman Terbaik?
          </h2>
          <p className="text-white/60 mb-8">
            Hubungi kami untuk informasi lebih lanjut atau langsung lakukan reservasi
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-gold rounded-lg inline-flex items-center gap-2">
              Reservasi Sekarang
              <ArrowRight size={16} />
            </Link>
            <a href="tel:+62211234567" className="btn-outline-white rounded-lg inline-flex items-center gap-2">
              <Phone size={16} />
              +62 21 1234 567
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
