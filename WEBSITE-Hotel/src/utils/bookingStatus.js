import { CheckCircle, Clock, XCircle } from 'lucide-react'

// Single source of truth for how a reservation's status is shown on the website
// (label + colour + icon). Shared by the booking-lookup and my-bookings pages so
// the wording and styling never drift apart.
export const STATUS_INFO = {
  Pending: { label: 'Menunggu Pembayaran', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  Confirmed: { label: 'Terkonfirmasi', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle },
  'Checked-in': { label: 'Sudah Check-in', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle },
  'Checked-out': { label: 'Sudah Check-out', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: CheckCircle },
  Cancelled: { label: 'Dibatalkan', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
}
