import { useState } from 'react'
import { Search, CheckCircle, Clock, XCircle, Image as ImageIcon, CalendarDays, BedDouble } from 'lucide-react'
import { hotelAPI, API_BASE_URL } from '../api/api'
import { formatCurrency } from '../data/hotels'

const STATUS_INFO = {
  Pending: { label: 'Menunggu Pembayaran', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  Confirmed: { label: 'Terkonfirmasi', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
  'Checked-in': { label: 'Sudah Check-in', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle },
  'Checked-out': { label: 'Sudah Check-out', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: CheckCircle },
  Cancelled: { label: 'Dibatalkan', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function BookingLookupPage() {
  const [form, setForm] = useState({ reservation_no: '', email: '' })
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setBooking(null)
    try {
      const res = await hotelAPI.lookupBooking(form.reservation_no.trim(), form.email.trim())
      setBooking(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking tidak ditemukan. Periksa kembali nomor reservasi dan email Anda.')
    } finally {
      setLoading(false)
    }
  }

  const statusInfo = booking ? (STATUS_INFO[booking.transaction_status] || STATUS_INFO.Pending) : null

  return (
    <>
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 to-hotel-dark/50" />
        <div className="relative z-10 text-center px-4">
          <p className="text-gold-400 tracking-[0.4em] uppercase text-sm font-medium mb-4">Booking Saya</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Cek Status Booking</h1>
          <div className="gold-divider" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-hotel-dark mb-2">Nomor Reservasi *</label>
              <input
                type="text"
                name="reservation_no"
                value={form.reservation_no}
                onChange={handleChange}
                required
                placeholder="RSV00000001"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-hotel-dark mb-2">Email yang digunakan saat booking *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@anda.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold rounded-xl w-full flex items-center justify-center gap-2">
              <Search size={16} />
              {loading ? 'Mencari...' : 'Cek Booking'}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          {booking && (
            <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                  <p className="text-xs text-gray-400">Nomor Reservasi</p>
                  <p className="text-lg font-display font-bold text-hotel-dark">{booking.reservation_no}</p>
                </div>
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border ${statusInfo.color}`}>
                  <statusInfo.icon size={14} />
                  {statusInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <BedDouble size={18} className="text-gold-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Hotel &amp; Tipe Kamar</p>
                    <p className="text-sm font-semibold text-hotel-dark">{booking.hotel_name} {booking.room_type ? `- ${booking.room_type}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays size={18} className="text-gold-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Tanggal Menginap</p>
                    <p className="text-sm font-semibold text-hotel-dark">{formatDate(booking.arrival_date)} - {formatDate(booking.departure_date)} ({booking.nights} malam)</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Pembayaran</span>
                  <span className="font-semibold">{formatCurrency(booking.payment_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deposit Diterima</span>
                  <span className="font-semibold text-green-600">{formatCurrency(booking.deposit)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                  <span className="font-semibold text-hotel-dark">Sisa Pembayaran</span>
                  <span className="text-lg font-bold text-gold-600">{formatCurrency(booking.balance)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-hotel-dark mb-3 flex items-center gap-2">
                  <ImageIcon size={16} className="text-gold-500" />
                  Bukti Pembayaran
                </p>
                {booking.payment_proof ? (
                  <img
                    src={`${API_BASE_URL}${booking.payment_proof}`}
                    alt="Bukti pembayaran"
                    className="w-full max-h-80 object-contain rounded-xl border border-gray-100 bg-gray-50"
                  />
                ) : (
                  <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4 text-center">
                    Belum ada bukti pembayaran yang diunggah untuk booking ini.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
