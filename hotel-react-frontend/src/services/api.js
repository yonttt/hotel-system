import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Add response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete this.client.defaults.headers.Authorization
    }
  }

  // Authentication endpoints
  async login(username, password) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    
    return this.client.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  async getCurrentUser() {
    return this.client.get('/auth/me')
  }

  // Reservations endpoints
  async getReservations(skip = 0, limit = 100) {
    return this.client.get(`/reservations/?skip=${skip}&limit=${limit}`)
  }

  async getReservation(id) {
    return this.client.get(`/reservations/${id}`)
  }

  async createReservation(reservationData) {
    return this.client.post('/reservations/', reservationData)
  }

  async updateReservation(id, reservationData) {
    return this.client.put(`/reservations/${id}`, reservationData)
  }

  async deleteReservation(id) {
    return this.client.delete(`/reservations/${id}`)
  }

  async getReservationsByStatus(status) {
    return this.client.get(`/reservations/by-status/${status}`)
  }

  async getNextReservationNumber() {
    return this.client.get('/reservations/next/reservation-number')
  }

  // Rooms endpoints
  async getRooms(skip = 0, limit = 100) {
    return this.client.get(`/rooms/?skip=${skip}&limit=${limit}`)
  }

  async getRoom(roomNumber) {
    return this.client.get(`/rooms/${roomNumber}`)
  }

  async createRoom(roomData) {
    return this.client.post('/rooms/', roomData)
  }

  async updateRoom(roomNumber, roomData) {
    return this.client.put(`/rooms/${roomNumber}`, roomData)
  }

  async deleteRoom(roomNumber) {
    return this.client.delete(`/rooms/${roomNumber}`)
  }

  async getRoomsByStatus(status) {
    return this.client.get(`/rooms/status/${status}`)
  }

  // Guests endpoints
  async getGuests(skip = 0, limit = 100) {
    return this.client.get(`/guests/?skip=${skip}&limit=${limit}`)
  }

  async getGuest(id) {
    return this.client.get(`/guests/${id}`)
  }

  async createGuest(guestData) {
    return this.client.post('/guests/', guestData)
  }

  async updateGuest(id, guestData) {
    return this.client.put(`/guests/${id}`, guestData)
  }

  async deleteGuest(id) {
    return this.client.delete(`/guests/${id}`)
  }

  async searchGuests(query) {
    return this.client.get(`/guests/search/${query}`)
  }

  // Hotel Registration endpoints
  async getHotelRegistrations(skip = 0, limit = 100) {
    return this.client.get(`/hotel-registrations/?skip=${skip}&limit=${limit}`)
  }

  async getHotelRegistration(id) {
    return this.client.get(`/hotel-registrations/${id}`)
  }

  async getHotelRegistrationByNumber(registrationNo) {
    return this.client.get(`/hotel-registrations/number/${registrationNo}`)
  }

  async createHotelRegistration(registrationData) {
    return this.client.post('/hotel-registrations/', registrationData)
  }

  async updateHotelRegistration(id, registrationData) {
    return this.client.put(`/hotel-registrations/${id}`, registrationData)
  }

  async deleteHotelRegistration(id) {
    return this.client.delete(`/hotel-registrations/${id}`)
  }

  async getNextRegistrationNumber() {
    return this.client.get('/hotel-registrations/next/registration-number')
  }

  // Hotel Reservation endpoints
  async getHotelReservations(skip = 0, limit = 100) {
    return this.client.get(`/hotel-reservations/?skip=${skip}&limit=${limit}`)
  }

  async getHotelReservation(id) {
    return this.client.get(`/hotel-reservations/${id}`)
  }

  async getHotelReservationByNumber(reservationNo) {
    return this.client.get(`/hotel-reservations/number/${reservationNo}`)
  }

  async createHotelReservation(reservationData) {
    return this.client.post('/hotel-reservations/', reservationData)
  }

  async updateHotelReservation(id, reservationData) {
    return this.client.put(`/hotel-reservations/${id}`, reservationData)
  }

  async deleteHotelReservation(id) {
    return this.client.delete(`/hotel-reservations/${id}`)
  }

  async getNextReservationNumber() {
    return this.client.get('/hotel-reservations/next/reservation-number')
  }

  // Cities endpoints
  async getCities() {
    return this.client.get('/cities/')
  }

  // Countries/Nationalities endpoints
  async getCountries() {
    return this.client.get('/countries/')
  }

  // Category Markets endpoints
  async getCategoryMarkets() {
    return this.client.get('/category-markets/')
  }

  // Market Segments endpoints
  async getMarketSegments() {
    return this.client.get('/market-segments/')
  }

  // Payment Methods endpoints
  async getPaymentMethods() {
    return this.client.get('/payment-methods/')
  }

  // Registration Types endpoints
  async getRegistrationTypes() {
    return this.client.get('/registration-types/')
  }
}

export const apiService = new ApiService()
export default apiService