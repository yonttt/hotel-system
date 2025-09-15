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
}

export const apiService = new ApiService()
export default apiService