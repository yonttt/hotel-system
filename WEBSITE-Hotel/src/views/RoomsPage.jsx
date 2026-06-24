﻿import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bed, Maximize2, Users, Wifi, Wind, Tv, Coffee, Bath, Check } from 'lucide-react'
import { formatCurrency } from '../data/hotels'
import { hotelAPI } from '../api/api'

// Fallback/Sample Room Data for when API returns no rooms
const fallbackRooms = [
  {
    id: 'fb1', name: 'Deluxe Room - Hotel Jakarta', type: 'standard', description: 'Kamar mewah dengan pemandangan kota.', price: 1000000, size: '30 m²', bed: 'King Size', guests: 2, amenities: ['WiFi Gratis', 'AC', 'TV LED', 'Room Service'],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'fb2', name: 'Suite Ocean View - Hotel Bali', type: 'suite', description: 'Suite luas dengan balkon pribadi menghadap laut.', price: 2500000, size: '60 m²', bed: 'King Size', guests: 3, amenities: ['WiFi Gratis', 'AC', 'TV LED', 'Minibar', 'Bathtub'],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'fb3', name: 'Family Room - Hotel Yogyakarta', type: 'family', description: 'Kamar nyaman untuk keluarga dengan 2 tempat tidur.', price: 1500000, size: '45 m²', bed: 'Twin Size', guests: 4, amenities: ['WiFi Gratis', 'AC', 'TV LED'],
    image: "https://images.unsplash.com/photo-1582719508461-905c67379f03?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 'fb4', name: 'Executive Suite - Hotel Surabaya', type: 'suite', description: 'Kamar eksekutif dengan ruang kerja terpisah.', price: 1800000, size: '50 m²', bed: 'King Size', guests: 2, amenities: ['WiFi Gratis', 'AC', 'TV LED', 'Desk'],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800&auto=format&fit=crop"
  },
]

export default function RoomsPage() {
  const [allRooms, setAllRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [hotelPhones, setHotelPhones] = useState({})

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await hotelAPI.getPublicHotels()
        const phones = {}
        ;(res.data || []).forEach(h => { if (h.phone) phones[h.name] = h.phone })
        setHotelPhones(phones)
      } catch (error) {
        console.error('Failed to fetch hotels', error)
      }
    }
    const fetchRooms = async () => {
      try {
        const response = await hotelAPI.getPublicRooms()
        const mappedRooms = response.data.map(room => {
          return {
            id: room.id,
            name: room.hotel_name + ' - ' + room.category_name,
            hotelName: room.hotel_name,
            description: room.description || 'Pengalaman menginap yang istimewa di tipe ' + room.category_name + ' persembahan ' + room.hotel_name + '.',
            price: room.published_rate ?? room.normal_rate ?? 250000,
            originalPrice: room.discount_percentage > 0 ? (room.original_rate ?? room.normal_rate) : null,
            discountPercentage: room.discount_percentage || 0,
            availableRooms: room.available_rooms,
            image: room.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop',
            size: room.size || '30 m²',
            bed: room.bed_type || 'King Size',
            guests: room.capacity || 2,
            amenities: room.amenities || ['WiFi Gratis', 'AC', 'TV LED', 'Room Service']
          }
        })

        if (mappedRooms.length === 0) {
          setAllRooms(fallbackRooms)
        } else {
          setAllRooms(mappedRooms)
        }
      } catch (error) {
        console.error('Failed to fetch rooms', error)
        setAllRooms(fallbackRooms)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
    fetchRooms()
  }, [])

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
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Kamar</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* Rooms Listing */}
      <section 
        className="py-16 lg:py-24 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
            </div>
          ) : allRooms.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Belum ada kamar yang tersedia saat ini.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {allRooms.map((room, index) => (
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
                    <div className="absolute top-4 left-4 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      {room.originalPrice && (
                        <span className="text-xs line-through text-white/70">{formatCurrency(room.originalPrice)}</span>
                      )}
                      {formatCurrency(room.price)}/malam
                    </div>
                    {room.discountPercentage > 0 && (
                      <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        DISKON {room.discountPercentage}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-display font-bold text-hotel-dark mb-3">{room.name}</h2>
                    {typeof room.availableRooms === 'number' && (
                      <div className="mb-4">
                        {room.availableRooms > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            {room.availableRooms} kamar tersedia
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            Kamar penuh
                          </span>
                        )}
                      </div>
                    )}
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

                    <div className="flex flex-wrap items-center gap-4">
                      {room.availableRooms === 0 ? (
                        <span className="rounded-lg text-center px-6 py-3 bg-gray-200 text-gray-500 font-semibold cursor-not-allowed">
                          Kamar Penuh
                        </span>
                      ) : (
                        <Link
                          to={`/booking?room=${room.id}`}
                          className="btn-gold rounded-lg text-center"
                        >
                          Pesan Sekarang
                        </Link>
                      )}
                      {hotelPhones[room.hotelName] && (
                        <a
                          href={`tel:${hotelPhones[room.hotelName]}`}
                          className="text-sm text-gray-500 hover:text-gold-500 transition-colors"
                        >
                          Ada perubahan tipe kamar? Hubungi {room.hotelName}: <span className="font-semibold">{hotelPhones[room.hotelName]}</span>
                        </a>
                      )}
                    </div>
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
