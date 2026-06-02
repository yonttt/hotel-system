  import { Link } from 'react-router-dom'
import { Users, ShieldCheck, Heart, Lightbulb, Award, Building2, Globe, Handshake } from 'lucide-react'

const milestones = [
  { year: '2003', title: 'Didirikan', desc: 'Eva Hotel Management Group berdiri dengan visi melayani kebutuhan akomodasi budget' },
  { year: '2008', title: 'Ekspansi Jakarta', desc: 'Memperluas layanan ke berbagai wilayah Jakarta Timur' },
  { year: '2015', title: 'Jangkauan Nasional', desc: 'Berkembang ke Bogor, Bandung, dan Cirebon' },
  { year: '2020', title: 'Inovasi Digital', desc: 'Meluncurkan platform booking online dan manajemen modern' },
  { year: '2023', title: 'Pertumbuhan Berkelanjutan', desc: 'Terus berkembang dengan komitmen pada kualitas dan pelayanan prima' },
  { year: '2026', title: 'Visi Masa Depan', desc: 'Menjadi pilihan utama untuk akomodasi budget berkualitas di Indonesia' },
]

const values = [
  { icon: Handshake, title: 'Team Work', desc: 'Upaya untuk saling mengisi, saling membantu, mengoreksi, menguntungkan dan menikmati hasil untuk mengoptimalkan pekerjaan.' },
  { icon: Award, title: 'Discipline', desc: 'Memposisikan segala sesuatu pada tempat dan waktu yang semestinya.' },
  { icon: ShieldCheck, title: 'Responsibility', desc: 'Kesediaan untuk menjalankan dan mengelola tugas, wewenang dan kepercayaan untuk menerima tugas dan menjaga kepercayaan yang diberikan.' },
  { icon: Heart, title: 'Care', desc: 'Perhatian dan dorongan untuk menjaga, mempertahankan dan meningkatkan nilai, mutu atau tingkat kebaikan sesuatu hal, keadaan atau orang lain.' },
  { icon: Lightbulb, title: 'Visionary', desc: 'Pandangan jauh kedepan yang berorientasi kepada pencapaian visi dan misi perusahaan.' },
  { icon: Heart, title: 'Fairness', desc: 'Membagi secara sesuatu dengan proposional.' },
  { icon: Users, title: 'Honesty', desc: 'Mengutamakan kebenaran hakiki pada diri sendiri, lingkungan dan rekan kerja.' },
]

const stats = [
  { icon: Building2, number: '25+', label: 'Hotel & Akomodasi' },
  { icon: Globe, number: '4', label: 'Kota' },
  { icon: Users, number: '500+', label: 'Karyawan' },
  { icon: Award, number: '15+', label: 'Penghargaan' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Tentang Kami</h1>
          <div className="gold-divider" />
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subtitle text-left">Sejak 2003</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-hotel-dark mb-6">
                Eva Hotel Management Group
              </h2>
              <div className="gold-divider-left mb-8" />
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Eva Hotel Management Group didirikan pada tahun 2003 sebagai perusahaan manajemen hotel budget 
                  yang berkomitmen memberikan akomodasi berkualitas dengan harga terjangkau. Berkedudukan di Jalan 
                  Pramuka Raya No. 26 Matraman, Jakarta Timur, kami telah berkembang menjadi jaringan hotel terpercaya 
                  di Indonesia.
                </p>
                <p>
                  Dengan motto "<strong>Pilihan Tepat Harga Bersahabat</strong>" dan "<strong>Murah dan Bersih</strong>", 
                  kami menghadirkan produk akomodasi yang memberikan kepuasan, keindahan, keamanan, dan kenyamanan kepada 
                  setiap tamu melalui pelayanan prima.
                </p>
                <p>
                  Jaringan hotel kami tersebar di berbagai kota strategis termasuk Jakarta, Bogor, Bandung, dan Cirebon. 
                  Setiap properti dikelola dengan standar operasional yang tinggi untuk memastikan pengalaman menginap 
                  yang konsisten dan memuaskan bagi semua tamu kami.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"
                alt="Hotel"
                className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-gold-500 p-8 rounded-2xl shadow-xl hidden lg:block">
                <p className="text-5xl font-display font-bold text-white">20+</p>
                <p className="text-white/80 text-sm mt-1">Tahun<br />Pengalaman</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-hotel-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon size={32} className="text-gold-400 mx-auto mb-3" />
                <p className="text-4xl font-display font-bold text-white mb-1">{stat.number}</p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-hotel-cream/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Nilai-Nilai Kami</p>
            <h2 className="section-title mb-4">Yang Kami Junjung Tinggi</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center group">
                <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-gold-500 transition-colors duration-300">
                  <value.icon size={28} className="text-gold-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-display font-bold text-hotel-dark mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subtitle">Perjalanan Kami</p>
            <h2 className="section-title mb-4">Milestone</h2>
            <div className="gold-divider" />
          </div>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-200 -translate-x-1/2 hidden md:block" />
            
            <div className="space-y-12">
              {milestones.map((item, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <span className="text-gold-500 font-display font-bold text-2xl">{item.year}</span>
                    <h3 className="text-xl font-display font-bold text-hotel-dark mt-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
                  </div>
                  <div className="w-4 h-4 bg-gold-500 rounded-full border-4 border-gold-100 z-10 shrink-0 hidden md:block" />
                  <div className="md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80)' }}>
        <div className="absolute inset-0 bg-hotel-dark/80" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Bergabunglah dengan Keluarga Kami
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Kami selalu mencari talenta terbaik untuk bergabung dalam tim kami. 
            Jadilah bagian dari perjalanan kami menghadirkan hospitalitas terbaik.
          </p>
          <Link to="/contact?subject=careers" className="btn-gold rounded-lg">
            Lihat Karir
          </Link>
        </div>
      </section>
    </>
  )
}
