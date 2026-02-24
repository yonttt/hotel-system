// Mock data for the hotel website
// In the future, this will be replaced with API calls to the shared backend

export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    title: 'Kemewahan yang Tak Terlupakan',
    subtitle: 'Rasakan pengalaman menginap terbaik dengan fasilitas premium',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
    title: 'Keindahan di Setiap Sudut',
    subtitle: 'Desain elegan yang memanjakan mata dan jiwa',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    title: 'Liburan Impian Anda',
    subtitle: 'Destinasi sempurna untuk momen berharga bersama keluarga',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    title: 'Surga Tropis Menanti',
    subtitle: 'Nikmati ketenangan di tengah alam yang memukau',
  },
]

export const featuredRooms = [
  {
    id: 1,
    name: 'Deluxe Room',
    type: 'standard',
    description: 'Kamar luas dengan pemandangan kota yang menakjubkan, dilengkapi fasilitas premium.',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    size: '35 m²',
    bed: 'King Size',
    guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 50"', 'Mini Bar', 'Room Service'],
  },
  {
    id: 2,
    name: 'Executive Suite',
    type: 'suite',
    description: 'Suite mewah dengan ruang tamu terpisah dan akses lounge eksklusif.',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    size: '55 m²',
    bed: 'King Size',
    guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 65"', 'Mini Bar', 'Bathtub', 'Lounge Access'],
  },
  {
    id: 3,
    name: 'Presidential Suite',
    type: 'suite',
    description: 'Pengalaman menginap tertinggi dengan kemewahan dan privasi maksimal.',
    price: 5500000,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    size: '90 m²',
    bed: 'King Size',
    guests: 4,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 75"', 'Mini Bar', 'Jacuzzi', 'Butler Service', 'Private Dining'],
  },
  {
    id: 4,
    name: 'Family Room',
    type: 'family',
    description: 'Kamar keluarga yang nyaman dengan ruang bermain anak.',
    price: 2200000,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    size: '50 m²',
    bed: 'Twin + Single',
    guests: 4,
    amenities: ['WiFi Gratis', 'AC', 'TV LED 55"', 'Mini Bar', 'Kids Area'],
  },
]

export const hotelProperties = [
  {
    id: 1,
    name: 'Grand Hotel Jakarta',
    location: 'Jakarta',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    rating: 4.8,
    rooms: 250,
  },
  {
    id: 2,
    name: 'Resort Bali Paradise',
    location: 'Bali',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    rating: 4.9,
    rooms: 180,
  },
  {
    id: 3,
    name: 'Hotel Yogyakarta Heritage',
    location: 'Yogyakarta',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    rating: 4.7,
    rooms: 150,
  },
  {
    id: 4,
    name: 'Bandung Mountain Resort',
    location: 'Bandung',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    rating: 4.6,
    rooms: 120,
  },
  {
    id: 5,
    name: 'Surabaya Business Hotel',
    location: 'Surabaya',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    rating: 4.5,
    rooms: 200,
  },
  {
    id: 6,
    name: 'Lombok Beach Resort',
    location: 'Lombok',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.8,
    rooms: 100,
  },
]

export const specialOffers = [
  {
    id: 1,
    title: 'Early Bird Special',
    description: 'Pesan 30 hari sebelumnya dan dapatkan diskon hingga 25%.',
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
    badge: 'Best Deal',
    validUntil: '31 Maret 2026',
    hotels: 12,
  },
  {
    id: 2,
    title: 'Weekend Getaway',
    description: 'Paket liburan akhir pekan dengan sarapan gratis untuk 2 orang.',
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    badge: 'Popular',
    validUntil: '30 April 2026',
    hotels: 8,
  },
  {
    id: 3,
    title: 'Family Fun Package',
    description: 'Menginap bersama keluarga dengan aktivitas anak gratis.',
    discount: '30%',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    badge: 'Family',
    validUntil: '31 Mei 2026',
    hotels: 6,
  },
  {
    id: 4,
    title: 'Honeymoon Special',
    description: 'Paket romantis dengan dinner dan spa couple.',
    discount: '15%',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
    badge: 'Romantic',
    validUntil: '28 Februari 2026',
    hotels: 10,
  },
]

export const newsItems = [
  {
    id: 1,
    title: 'Grand Opening Hotel Baru di Labuan Bajo',
    excerpt: 'Memperluas jaringan ke destinasi wisata terpopuler di Indonesia Timur.',
    date: '15 Feb 2026',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    hotel: 'Labuan Bajo Resort',
  },
  {
    id: 2,
    title: 'Penghargaan Best Luxury Hotel 2025',
    excerpt: 'Meraih penghargaan bergengsi dari World Travel Awards.',
    date: '10 Feb 2026',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80',
    hotel: 'Grand Hotel Jakarta',
  },
  {
    id: 3,
    title: 'Program Sustainability Terbaru',
    excerpt: 'Komitmen kami untuk lingkungan yang lebih hijau dan berkelanjutan.',
    date: '05 Feb 2026',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
    hotel: 'All Properties',
  },
  {
    id: 4,
    title: 'Festival Kuliner Nusantara',
    excerpt: 'Nikmati cita rasa khas Indonesia di setiap hotel kami.',
    date: '01 Feb 2026',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
    hotel: 'Multiple Hotels',
  },
]

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Wijaya',
    role: 'Business Traveler',
    text: 'Pelayanan yang luar biasa! Setiap detail diperhatikan dengan sempurna. Saya selalu memilih hotel ini untuk perjalanan bisnis.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    role: 'Family Vacation',
    text: 'Liburan keluarga terbaik kami! Anak-anak sangat menikmati fasilitas bermain dan kolam renang.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 3,
    name: 'Amanda Chen',
    role: 'Honeymoon Trip',
    text: 'Suasana romantis yang sempurna untuk bulan madu kami. Pemandangan sunset dari kamar sangat memukau.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
  },
]

export const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', caption: 'Pool View', category: 'exterior' },
  { id: 2, src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80', caption: 'Deluxe Room', category: 'rooms' },
  { id: 3, src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', caption: 'Fine Dining', category: 'dining' },
  { id: 4, src: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80', caption: 'Spa & Wellness', category: 'spa' },
  { id: 5, src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80', caption: 'Beach Resort', category: 'exterior' },
  { id: 6, src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', caption: 'Executive Suite', category: 'rooms' },
  { id: 7, src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', caption: 'Lobby', category: 'exterior' },
  { id: 8, src: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80', caption: 'Family Pool', category: 'exterior' },
  { id: 9, src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', caption: 'Presidential Suite', category: 'rooms' },
  { id: 10, src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', caption: 'Mountain View', category: 'exterior' },
  { id: 11, src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80', caption: 'Restaurant', category: 'dining' },
  { id: 12, src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', caption: 'Beach View', category: 'exterior' },
]

export const facilities = [
  { id: 1, name: 'Kolam Renang', icon: 'pool', description: 'Infinity pool dengan pemandangan spektakuler' },
  { id: 2, name: 'Spa & Wellness', icon: 'spa', description: 'Perawatan tubuh mewah untuk relaksasi sempurna' },
  { id: 3, name: 'Restoran', icon: 'restaurant', description: 'Kuliner kelas dunia dari chef berpengalaman' },
  { id: 4, name: 'Fitness Center', icon: 'fitness', description: 'Peralatan fitness modern 24 jam' },
  { id: 5, name: 'Business Center', icon: 'business', description: 'Fasilitas meeting dan konferensi lengkap' },
  { id: 6, name: 'Kids Club', icon: 'kids', description: 'Area bermain aman untuk buah hati' },
]

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
