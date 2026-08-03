// Read the logged-in customer's first name from the token payload stored at login.
// Returns null when no valid account is stored, so callers can pick their own
// fallback (e.g. "User" in the navbar, "" on the bookings page).
export const getCustomerFirstName = () => {
  try {
    return JSON.parse(localStorage.getItem('customer_user'))?.full_name?.split(' ')[0] || null
  } catch {
    return null
  }
}
