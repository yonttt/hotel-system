import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Bed, Maximize2, Users, Wifi, Wind, Tv, Coffee, Bath, Star, Check } from 'lucide-react'
import { featuredRooms, formatCurrency } from '../data/hotels'

const allRooms = [
  ...featuredRooms,
  {
    id: 5,
    name: 'Superior Room',
    type: 'standard',
    description: 'Kamar nyaman dengan desain modern dan semua kebutuhan dasar untuk menginap yang menyenangkan.',
    price: 900000,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    size: '28 m²',
    bed: 'Queen Size',
    guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 43"', 'Room Service'],
  },
  {
    id: 6,
    name: 'Grand Suite',
    type: 'suite',
    description: 'Suite premium dengan balkon pribadi dan pemandangan laut yang menakjubkan.',
    price: 4200000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    size: '75 m²',
    bed: 'King Size',
    guests: 3,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 65"', 'Mini Bar', 'Bathtub', 'Balcony', 'Sea View'],
  },
]

const roomTypes = [
  { key: 'all', label: 'Semua' },
  { key: 'standard', label: 'Standard' },
  { key: 'suite', label: 'Suite' },
  { key: 'family', label: 'Family' },
]

export default function RoomsPage() {
  const [searchParams] = useSearchParams()
  const initialType = searchParams.get('type') || 'all'
  const [selectedType, setSelectedType] = useState(initialType)

  const filteredRooms = selectedType === 'all'
    ? allRooms
    : allRooms.filter((room) => room.type === selectedType)

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Akomodasi</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Kamar & Suite</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Room Types Filter */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {roomTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedType === type.key
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Listing */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Tidak ada kamar ditemukan untuk kategori ini.</p>
              <button
                onClick={() => setSelectedType('all')}
                className="mt-4 text-gold-500 font-semibold hover:text-gold-400 transition-colors"
              >
                Lihat semua kamar
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredRooms.map((room, index) => (
                <div
                  key={room.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 
                    border border-gray-100 flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Image */}
                  <div className="lg:w-1/2 relative overflow-hidden group">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-72 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {formatCurrency(room.price)}/malam
                    </div>
                    <div className="absolute top-4 right-4 bg-hotel-dark/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {room.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} className="text-gold-400" fill="currentColor" />
                      ))}
                    </div>
                    <h2 className="text-3xl font-display font-bold text-hotel-dark mb-3">{room.name}</h2>
                    <p className="text-gray-500 leading-relaxed mb-6">{room.description}</p>

                    {/* Room Specs */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-hotel-cream rounded-xl">
                        <Maximize2 size={20} className="text-gold-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Ukuran</p>
                        <p className="text-sm font-semibold text-hotel-dark">{room.size}</p>
                      </div>
                      <div className="text-center p-3 bg-hotel-cream rounded-xl">
                        <Bed size={20} className="text-gold-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Tempat Tidur</p>
                        <p className="text-sm font-semibold text-hotel-dark">{room.bed}</p>
                      </div>
                      <div className="text-center p-3 bg-hotel-cream rounded-xl">
                        <Users size={20} className="text-gold-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Kapasitas</p>
                        <p className="text-sm font-semibold text-hotel-dark">{room.guests} Tamu</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-8">
                      <p className="text-sm font-semibold text-hotel-dark mb-3">Fasilitas Kamar:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 text-xs bg-gray-100 px-3 py-2 rounded-lg text-gray-600"
                          >
                            <Check size={12} className="text-gold-500" />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      to={`/booking?room=${room.id}`}
                      className="btn-gold rounded-lg w-full sm:w-auto text-center"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-hotel-dark/80" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Butuh Bantuan Memilih Kamar?
          </h2>
          <p className="text-white/70 mb-8">
            Tim kami siap membantu Anda menemukan kamar yang sempurna untuk kebutuhan Anda
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-gold rounded-lg">
              Hubungi Kami
            </Link>
            <a href="tel:+62211234567" className="btn-outline-white rounded-lg">
              +62 21 1234 567
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
