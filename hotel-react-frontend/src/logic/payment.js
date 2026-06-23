import { apiService } from '../api/api'

/**
 * Start a Midtrans payment for a reservation.
 * Asks the backend for a Snap token, then opens the Midtrans popup
 * (QRIS / Virtual Account / card / e-wallet). The reservation is marked
 * paid by the backend webhook once Midtrans confirms.
 *
 * @param {number} reservationId
 * @param {{ onPaid?: function, onError?: function }} handlers
 */
export async function payReservation(reservationId, { onPaid, onError } = {}) {
  try {
    const res = await apiService.createPayment(reservationId)
    const token = res.data?.token
    if (!token) {
      throw new Error('No payment token returned')
    }
    if (!window.snap) {
      alert('Payment module is still loading. Please refresh the page and try again.')
      return
    }
    window.snap.pay(token, {
      onSuccess: (result) => onPaid?.(result),
      onPending: (result) => onPaid?.(result),
      onError: (err) => {
        onError?.(err)
        alert('Payment failed. Please try again.')
      },
      onClose: () => {
        // Guest closed the popup without finishing — no action needed.
      },
    })
  } catch (e) {
    onError?.(e)
    alert('Failed to start payment: ' + (e.response?.data?.detail || e.message))
  }
}
