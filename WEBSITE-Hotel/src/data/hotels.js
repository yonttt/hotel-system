// Fallback/seed data for the hotel website.
// Live room, hotel, and CMS content come from the shared backend API; the values
// below are only fallbacks and reflect the REAL Eva Group (budget-hotel) properties.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const fetchCMSContent = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/cms/content`);
    const data = await res.json();
    return data.reduce((acc, curr) => {
      acc[curr.setting_key] = curr.setting_value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch CMS content:", error);
    return {};
  }
};

export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    title: 'Murah dan Bersih',
    subtitle: 'Menginap nyaman dengan harga terjangkau bersama jaringan Eva Group',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80',
    title: 'Lokasi Strategis di Pusat Kota',
    subtitle: 'Dekat stasiun, pusat perbelanjaan, dan tempat wisata',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80',
    title: 'Pilihan Tepat untuk Bisnis & Backpacker',
    subtitle: 'Kamar bersih, WiFi, dan restoran di setiap properti',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80',
    title: 'Tarif Transit yang Fleksibel',
    subtitle: 'Sewa kamar 5, 8, atau 12 jam sesuai kebutuhan Anda',
  },
]

export const featuredRooms = [
  {
    id: 1, name: 'Standard', type: 'standard',
    description: 'Kamar 16 m² yang bersih dan nyaman untuk beristirahat.',
    price: 270000, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    size: '16 m²', bed: '1 Single Bed', guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV', 'Shower', 'Area Tempat Duduk'],
  },
  {
    id: 2, name: 'Deluxe', type: 'deluxe',
    description: 'Kamar 18 m² dengan 1 double bed yang lebih lega dan nyaman.',
    price: 295000, image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
    size: '18 m²', bed: '1 Double Bed', guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV', 'Shower', 'Air Panas'],
  },
  {
    id: 3, name: 'Superior', type: 'superior',
    description: 'Kamar 23 m² yang lebih luas untuk perjalanan Anda.',
    price: 325000, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    size: '23 m²', bed: '1 Double Bed', guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV Kabel', 'Shower', 'Air Panas', 'Sofa'],
  },
  {
    id: 4, name: 'Executive', type: 'executive',
    description: 'Kamar terluas 24 m² dengan pilihan 1 double bed atau 2 twin bed.',
    price: 345000, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    size: '24 m²', bed: '1 Double Bed / 2 Twin', guests: 2,
    amenities: ['WiFi Gratis', 'AC', 'TV Kabel', 'Meja Kerja', 'Pembuat Teh/Kopi'],
  },
]

export const hotelProperties = [
  { id: 1, name: 'Hotel New Idola', location: 'Jakarta', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', rating: 4.1, rooms: 75 },
  { id: 2, name: 'Hotel Semeru', location: 'Bogor', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80', rating: 4.0, rooms: 40 },
  { id: 3, name: 'Hotel Benua', location: 'Bandung', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', rating: 4.1, rooms: 91 },
  { id: 4, name: 'Hotel Ghotic', location: 'Bandung', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80', rating: 4.0, rooms: 45 },
  { id: 5, name: 'Hotel Amanah Benua', location: 'Cirebon', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80', rating: 4.0, rooms: 67 },
]

export const specialOffers = [
  {
    id: 1, title: 'Tarif Transit', description: 'Sewa kamar fleksibel 5, 8, atau 12 jam — bayar sesuai kebutuhan.',
    discount: 'Hemat', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80',
    badge: 'Fleksibel', validUntil: 'Setiap hari', hotels: 5,
  },
  {
    id: 2, title: 'Menginap Hemat', description: 'Kamar bersih mulai Rp270.000 per malam, sudah termasuk WiFi dan sarapan.',
    discount: 'Mulai 270K', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80',
    badge: 'Hemat', validUntil: 'Setiap hari', hotels: 5,
  },
  {
    id: 3, title: 'Pesan Langsung Online', description: 'Pesan lewat website resmi untuk konfirmasi cepat tanpa perantara.',
    discount: 'Praktis', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    badge: 'Online', validUntil: 'Setiap hari', hotels: 5,
  },
]

export const newsItems = [
  {
    id: 1, title: 'Pemesanan Kamar Online Kini Tersedia',
    excerpt: 'Pesan kamar langsung dari website resmi Eva Group — cepat, mudah, dan aman.',
    date: '2026', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80', hotel: 'Semua Properti',
  },
  {
    id: 2, title: '5 Properti di 4 Kota',
    excerpt: 'Hadir di Jakarta, Bogor, Bandung, dan Cirebon dengan lebih dari 300 kamar.',
    date: '2026', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80', hotel: 'Eva Group',
  },
  {
    id: 3, title: 'Restoran, WiFi & Resepsionis 24 Jam',
    excerpt: 'Setiap properti dilengkapi restoran, akses WiFi, dan layanan resepsionis 24 jam.',
    date: '2026', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', hotel: 'Semua Properti',
  },
  {
    id: 4, title: 'Menginap Fleksibel dengan Tarif Transit',
    excerpt: 'Butuh istirahat sebentar? Pilih tarif transit 5, 8, atau 12 jam.',
    date: '2026', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80', hotel: 'Semua Properti',
  },
]

export const testimonials = [
  {
    id: 1, name: 'F. N.', role: 'Tamu Traveloka',
    text: 'Kamar bersih, rapi, dan fasilitas berfungsi dengan baik untuk sekadar istirahat setelah seharian beraktivitas. Suasananya tenang dan kondusif.',
    rating: 4, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  },
  {
    id: 2, name: 'L. I.', role: 'Tamu Traveloka',
    text: 'Staff hotel sangat ramah dan membantu segala keperluan serta kebutuhan tamu hotel.',
    rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  },
  {
    id: 3, name: 'R. P.', role: 'Perjalanan Bisnis',
    text: 'Lokasi strategis di pinggir Jalan Pramuka, dekat stasiun dan pusat perbelanjaan. Harga terjangkau untuk menginap di Jakarta.',
    rating: 4, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
  },
]

export const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&q=80', caption: 'Kamar Standard', category: 'rooms' },
  { id: 2, src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80', caption: 'Kamar Deluxe', category: 'rooms' },
  { id: 3, src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', caption: 'Kamar Superior', category: 'rooms' },
  { id: 4, src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', caption: 'Kamar Executive', category: 'rooms' },
  { id: 5, src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', caption: 'Restoran', category: 'dining' },
  { id: 6, src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80', caption: 'Menu Restoran', category: 'dining' },
  { id: 7, src: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', caption: 'Lobi', category: 'facility' },
  { id: 8, src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80', caption: 'Bangunan Hotel', category: 'exterior' },
  { id: 9, src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', caption: 'Tampak Depan', category: 'exterior' },
]

export const facilities = [
  { id: 1, name: 'Restoran', icon: 'restaurant', description: 'Menyajikan hidangan Indonesia dan Chinese food.' },
  { id: 2, name: 'WiFi Gratis', icon: 'wifi', description: 'Akses internet nirkabel di seluruh area hotel.' },
  { id: 3, name: 'Resepsionis 24 Jam', icon: 'reception', description: 'Layanan tamu tersedia sepanjang hari.' },
  { id: 4, name: 'Area Parkir', icon: 'parking', description: 'Parkir kendaraan yang luas dan aman.' },
  { id: 5, name: 'Lift', icon: 'elevator', description: 'Akses mudah ke setiap lantai.' },
  { id: 6, name: 'Layanan Kamar', icon: 'roomservice', description: 'Pesan makanan dan kebutuhan langsung ke kamar.' },
]

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Shared date formatter (Indonesian long form, e.g. "5 Agustus 2026").
// Used by the booking pages so the format stays consistent everywhere.
export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}
