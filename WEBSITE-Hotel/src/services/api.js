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
  getProperties: () => api.get('/api/properties'),
  getPropertyById: (id) => api.get(`/api/properties/${id}`),

  // Rooms
  getRooms: (propertyId) => api.get(`/api/rooms`, { params: { property_id: propertyId } }),
  getRoomById: (id) => api.get(`/api/rooms/${id}`),
  checkAvailability: (params) => api.get('/api/rooms/availability', { params }),

  // Room Rates
  getRoomRates: (params) => api.get('/api/room-rates', { params }),

  // Reservations
  createReservation: (data) => api.post('/api/reservations', data),
  getReservation: (confirmationCode) => api.get(`/api/reservations/${confirmationCode}`),

  // Cities
  getCities: () => api.get('/api/cities'),

  // Guest Registration
  registerGuest: (data) => api.post('/api/guests', data),
}

export default api
