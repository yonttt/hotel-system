import { useState, useEffect, useRef } from 'react'
import { Sparkles, ShieldCheck, Heart, Leaf } from 'lucide-react'
import { fetchCMSContent } from '../data/hotels'

const features = [
  {
    icon: Sparkles,
    title: 'Harga Terjangkau',
    description: 'Kamar bersih dan nyaman dengan harga yang ramah di kantong.',
  },
  {
    icon: ShieldCheck,
    title: 'Melayani Sejak 2003',
    description: 'Pengalaman panjang mengelola budget hotel di berbagai kota di Indonesia.',
  },
  {
    icon: Heart,
    title: 'Lokasi Strategis',
    description: 'Berada di pusat kota, dekat stasiun, pusat perbelanjaan, dan tempat wisata.',
  },
  {
    icon: Leaf,
    title: 'Bersih & Nyaman',
    description: 'Mengusung moto “Murah dan Bersih” di setiap properti kami.',
  },
]

export default function AboutSection() {
  const sectionRef = useRef(null)
  const [cms, setCms] = useState({})

  useEffect(() => {
    fetchCMSContent().then(setCms).catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <p className="section-subtitle">{cms.about_subtitle || 'Tentang Kami'}</p>
          <h2 className="section-title mb-4">
            {cms.about_title || <>Kepercayaan Adalah Bukti<br />Dari Janji Yang Terpenuhi</>}
          </h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            {cms.about_description ||
              'Eva Group adalah jaringan budget hotel yang mengutamakan kebersihan dan pelayanan, hadir di berbagai kota di Indonesia sejak 2003 dengan moto “Murah dan Bersih”.'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll group text-center p-8 rounded-2xl hover:bg-hotel-cream transition-all duration-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-5 
                group-hover:bg-gold-500 group-hover:scale-110 transition-all duration-300">
                <feature.icon size={28} className="text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-display font-bold text-hotel-dark mb-3">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Image + Text Row */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-on-scroll">
          <div className="relative">
            <img
              src={cms.about_image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'}
              alt="Hotel exterior"
              className="w-full h-96 object-cover rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white p-6 rounded-2xl shadow-lg hidden lg:block">
              <p className="text-4xl font-display font-bold">20+</p>
              <p className="text-sm tracking-wider">Tahun Pengalaman</p>
            </div>
          </div>
          <div>
            <p className="section-subtitle text-left">Inovasi Kenyamanan</p>
            <h3 className="text-3xl font-display font-bold text-hotel-dark mb-6">
              Menghadirkan Pengalaman Tak Terlupakan
            </h3>
            <div className="gold-divider-left mb-6" />
            <p className="text-gray-600 leading-relaxed mb-6">
              Sejak 2003, Eva Group berkembang dari satu properti di Jakarta menjadi jaringan
              budget hotel di beberapa kota. Kami mengutamakan kebersihan, kenyamanan, dan
              pelayanan yang ramah dengan harga terjangkau.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Fasilitas standar yang lengkap dan lokasi strategis di pusat kota menjadikan hotel
              kami pilihan tepat bagi backpacker maupun pelaku perjalanan bisnis.
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">5</p>
                <p className="text-sm text-gray-500">Hotel</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">300+</p>
                <p className="text-sm text-gray-500">Kamar</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">4</p>
                <p className="text-sm text-gray-500">Kota</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">2003</p>
                <p className="text-sm text-gray-500">Sejak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
