import emailjs from '@emailjs/browser'

// EmailJS config — these are all PUBLIC values (safe to ship in the frontend),
// pulled from env so nothing is hardcoded. Set them in WEBSITE-Hotel/.env:
//   VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID,
//   VITE_EMAILJS_TEMPLATE_ID_GUEST, VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const TEMPLATE_ID_GUEST = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_GUEST
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Used when a hotel has no email set yet in the database. Once each hotel record
// has its own `email`, that value is passed in and this fallback is never hit.
const FALLBACK_HOTEL_EMAIL = 'yonathantambani109@gmail.com'

// Shared template variables used by both the staff and guest emails, built from
// one booking object so the two emails always stay in sync.
function buildParams(booking) {
  return {
    hotel_name: booking.hotelName || '',
    hotel_email: booking.hotelEmail || FALLBACK_HOTEL_EMAIL,
    reservation_no: booking.reservationNo || '',
    guest_name: booking.guestName || '',
    guest_email: booking.guestEmail || '',
    guest_phone: booking.guestPhone || '',
    check_in: booking.checkIn || '',
    check_out: booking.checkOut || '',
    nights: booking.nights ?? '',
    rooms: booking.rooms ?? '',
    room_type: booking.roomType || '',
    total: booking.total || '',
    payment_method: booking.paymentMethod || '',
    special_requests: booking.specialRequests || '-',
  }
}

/**
 * Send the "new booking" notification to the HOTEL/STAFF via EmailJS.
 *
 * @param {object} booking - booking details (see buildParams).
 * @param {string} [booking.hotelEmail] - destination; falls back to FALLBACK_HOTEL_EMAIL.
 * Returns true on success, false if EmailJS isn't configured or sending failed.
 * Never throws — a failed email must not break a successful booking.
 */
export async function sendBookingEmail(booking) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured (missing VITE_EMAILJS_* env vars). Skipping staff email.')
    return false
  }

  // Staff template's "To Email" field should be {{to_email}}.
  const params = { ...buildParams(booking), to_email: booking.hotelEmail || FALLBACK_HOTEL_EMAIL }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY })
    return true
  } catch (err) {
    console.error('Failed to send staff booking email via EmailJS:', err)
    return false
  }
}

/**
 * Send the "booking confirmation" to the GUEST via EmailJS.
 *
 * @param {object} booking - booking details (see buildParams).
 * @param {string} booking.guestEmail - destination (the guest's own email).
 * Returns true on success, false if EmailJS isn't configured or sending failed.
 * Never throws — a failed email must not break a successful booking.
 */
export async function sendGuestEmail(booking) {
  if (!SERVICE_ID || !TEMPLATE_ID_GUEST || !PUBLIC_KEY) {
    console.warn('EmailJS guest template not configured (missing VITE_EMAILJS_* env vars). Skipping guest email.')
    return false
  }
  if (!booking.guestEmail) return false

  // Guest template's "To Email" field should be {{to_email}}.
  const params = { ...buildParams(booking), to_email: booking.guestEmail }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID_GUEST, params, { publicKey: PUBLIC_KEY })
    return true
  } catch (err) {
    console.error('Failed to send guest confirmation email via EmailJS:', err)
    return false
  }
}
