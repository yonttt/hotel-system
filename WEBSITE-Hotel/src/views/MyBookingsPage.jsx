import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CalendarDays, BedDouble, Search } from 'lucide-react'
import { hotelAPI } from '../api/api'
import { formatCurrency, formatDate } from '../data/hotels'
import { STATUS_INFO } from '../utils/bookingStatus'
import { getCustomerFirstName } from '../utils/customer'

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const customerName = getCustomerFirstName() || ''

  useEffect(() => {
    if (!localStorage.getItem('customer_token')) {
      navigate('/login')
      return
    }
    hotelAPI.getMyBookings()
      .then((res) => setBookings(res.data || []))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('customer_token')
          localStorage.removeItem('customer_user')
          navigate('/login')
        } else {
          setError('Gagal memuat riwayat booking. Silakan coba lagi nanti.')
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  return (
    <>
      {/* Hero */}
      <section className="relative h-[36vh] min-h-[300px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center px-4">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Akun Saya</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Riwayat Booking</h1>
          {customerName && <p className="text-white/70">Selamat datang kembali, {customerName}</p>}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50 min-h-[40vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && <p className="text-center text-gray-500">Memuat riwayat booking…</p>}

          {!loading && error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <div className="text-center bg-white rounded-2xl shadow-md border border-gray-100 p-10">
              <BedDouble size={40} className="text-gold-500 mx-auto mb-4" />
              <p className="text-hotel-dark font-semibold mb-1">Belum ada riwayat booking</p>
              <p className="text-gray-500 text-sm mb-6">Booking Anda akan muncul di sini setelah Anda memesan kamar.</p>
              <Link to="/rooms" className="btn-gold rounded-xl inline-flex items-center gap-2">
                <Search size={16} /> Cari Kamar
              </Link>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="space-y-5">
              {bookings.map((b) => {
                const info = STATUS_INFO[b.transaction_status] || STATUS_INFO.Pending
                return (
                  <div key={b.reservation_no} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                      <div>
                        <p className="text-xs text-gray-400">Nomor Reservasi</p>
                        <p className="text-lg font-display font-bold text-hotel-dark">{b.reservation_no}</p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${info.color}`}>
                        <info.icon size={14} />
                        {info.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <BedDouble size={18} className="text-gold-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Hotel &amp; Tipe Kamar</p>
                          <p className="text-sm font-semibold text-hotel-dark">{b.hotel_name}{b.room_type ? ` - ${b.room_type}` : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CalendarDays size={18} className="text-gold-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Tanggal Menginap</p>
                          <p className="text-sm font-semibold text-hotel-dark">{formatDate(b.arrival_date)} - {formatDate(b.departure_date)} ({b.nights} malam)</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
                      <span className="text-gray-500">Total Pembayaran</span>
                      <span className="font-semibold">{formatCurrency(b.payment_amount)}</span>
                    </div>
                    {Number(b.balance) > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">Sisa Pembayaran</span>
                        <span className="font-bold text-gold-600">{formatCurrency(b.balance)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
