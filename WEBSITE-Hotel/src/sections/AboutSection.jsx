import { useEffect, useRef } from 'react'
import { Sparkles, ShieldCheck, Heart, Leaf } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Pengalaman Mewah',
    description: 'Setiap detail dirancang untuk memberikan kenyamanan dan kemewahan terbaik bagi tamu kami.',
  },
  {
    icon: ShieldCheck,
    title: 'Pelayanan Terpercaya',
    description: 'Lebih dari dua dekade melayani jutaan tamu domestik dan mancanegara.',
  },
  {
    icon: Heart,
    title: 'Sentuhan Personal',
    description: 'Pengalaman spesial yang dipersonalisasi dengan keunikan dan kebutuhan setiap tamu.',
  },
  {
    icon: Leaf,
    title: 'Ramah Lingkungan',
    description: 'Komitmen terhadap keberlanjutan dan pelestarian lingkungan di setiap properti.',
  },
]

export default function AboutSection() {
  const sectionRef = useRef(null)

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
          <p className="section-subtitle">Tentang Kami</p>
          <h2 className="section-title mb-4">Kepercayaan Adalah Bukti<br />Dari Janji Yang Terpenuhi</h2>
          <div className="gold-divider mb-6" />
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Kami adalah merek paling terpercaya dan dikenal secara luas yang telah melayani
            jutaan tamu domestik dan mancanegara setiap bulan selama lebih dari dua dekade.
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
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
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
              Keunikan pengalaman lokal yang dipadukan dengan karakter autentik. Melalui ide-ide 
              yang inovatif dan pelayanan yang ramah, setiap hotel dan individu merasakan pengalaman 
              spesial yang dipersonalisasi dengan setiap keunikan dan kebutuhan bagi setiap tamu.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Fasilitas modern, desain yang elegan, dan lokasi strategis menjadikan hotel kami
              pilihan utama bagi wisatawan dan pelaku bisnis dari seluruh dunia.
            </p>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">50+</p>
                <p className="text-sm text-gray-500">Hotel & Resort</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">15K+</p>
                <p className="text-sm text-gray-500">Kamar</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">2M+</p>
                <p className="text-sm text-gray-500">Tamu/Tahun</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-gold-600">98%</p>
                <p className="text-sm text-gray-500">Kepuasan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
