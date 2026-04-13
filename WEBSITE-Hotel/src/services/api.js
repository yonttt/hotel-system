import axios from 'axios'

// API base URL - will connect to the same backend as hotel-react-frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Future API endpoints for the public hotel website
export const hotelAPI = {
  // Properties / Hotels
  getProperties: () => api.get('/properties/'),
  getPropertyById: (id) => api.get(`/properties/${id}`),

  // Rooms
  getRooms: (propertyId) => api.get('/hotel-rooms/', { params: { property_id: propertyId } }),
  getRoomById: (id) => api.get(`/hotel-rooms/${id}`),

  // Room Rates
  getRoomRates: (params) => api.get('/room-rates/', { params }),

  // Reservations & Registration API bindings for Hotel Website
  createReservation: (data) => api.post('/hotel-reservations/', data),
  // For same day, we create a registration
  createRegistration: (data) => api.post('/hotel-registrations/', data),
  getReservation: (confirmationCode) => api.get(`/hotel-reservations/${confirmationCode}`),

  // Cities & Nationalities
  getCities: () => api.get('/cities/'),
  getCountries: () => api.get('/countries/'),

  // Guest Registration
  registerGuest: (data) => api.post('/guests/', data),
}

export default api
