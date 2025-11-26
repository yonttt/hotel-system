import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

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
        if (token && !config.headers.Authorization) {
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
          // Clear expired/invalid token
          localStorage.removeItem('token')
          localStorage.removeItem('user_role')
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            console.warn('Authentication token expired or invalid. Redirecting to login...')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
    } else {
      delete this.client.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }

  // Authentication endpoints
  async login(username, password) {
    try {
      // Create URLSearchParams for x-www-form-urlencoded format
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)
      
      const response = await this.client.post('/auth/login', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        validateStatus: function (status) {
          return status < 500 // Resolve only if the status code is less than 500
        }
      })
      
      // Check if login was successful
      if (response.status === 200 && response.data.access_token) {
        // Temporarily set token to get user info
        const tempToken = response.data.access_token
        this.setAuthToken(tempToken)
        
        try {
          const userInfo = await this.getCurrentUser()
          response.data.user = userInfo.data
        } catch (userError) {
          console.warn('Could not fetch user info after login:', userError)
          // Don't fail the login if we can't get user info
        }
      }
      
      return response
    } catch (error) {
      if (!error.response) {
        throw new Error('Network error - unable to connect to server')
      }
      throw error
    }
  }

  async getCurrentUser() {
    return this.client.get('/auth/me')
  }

  async registerUser(userData) {
    return this.client.post('/auth/register', userData)
  }

  async getAllUsers() {
    return this.client.get('/users/')
  }

  async deleteUser(userId) {
    return this.client.delete(`/users/${userId}`)
  }

  async getUserPermissions() {
    return this.client.get('/users/permissions')
  }

  async updateUserPermission(role, permissionData) {
    return this.client.put(`/users/permissions/${role}`, permissionData)
  }

  // Hotel Rooms endpoints (updated to use new hotel_rooms table)
  async getHotelRooms(skip = 0, limit = 100, room_type = null, floor = null, status = null) {
    let url = `/hotel-rooms/?skip=${skip}&limit=${limit}`
    if (room_type) url += `&room_type=${room_type}`
    if (floor) url += `&floor=${floor}`
    if (status) url += `&status=${status}`
    return this.client.get(url)
  }

  async getHotelRoom(roomNumber) {
    return this.client.get(`/hotel-rooms/${roomNumber}`)
  }

  async createHotelRoom(roomData) {
    return this.client.post('/hotel-rooms/', roomData)
  }

  async updateHotelRoom(roomNumber, roomData) {
    return this.client.put(`/hotel-rooms/${roomNumber}`, roomData)
  }

  async deleteHotelRoom(roomNumber) {
    return this.client.delete(`/hotel-rooms/${roomNumber}`)
  }

  async getHotelRoomsByStatus(status) {
    return this.client.get(`/hotel-rooms/status/${status}`)
  }

  async getHotelRoomsByType(roomType) {
    return this.client.get(`/hotel-rooms/type/${roomType}`)
  }

  async getHotelRoomsByFloor(floorNumber) {
    return this.client.get(`/hotel-rooms/floor/${floorNumber}`)
  }

  async getRoomAvailability(room_type = null, floor = null, status = null, min_price = null, max_price = null) {
    let url = `/hotel-rooms/availability?`
    const params = []
    if (room_type) params.push(`room_type=${room_type}`)
    if (floor) params.push(`floor=${floor}`)
    if (status) params.push(`status=${status}`)
    if (min_price) params.push(`min_price=${min_price}`)
    if (max_price) params.push(`max_price=${max_price}`)
    return this.client.get(url + params.join('&'))
  }

  async getRoomStatistics() {
    return this.client.get('/hotel-rooms/stats')
  }

  async incrementRoomHitCount(roomNumber) {
    return this.client.post(`/hotel-rooms/${roomNumber}/increment-hit`)
  }

  async getPopularRooms(limit = 10) {
    return this.client.get(`/hotel-rooms/analytics/popular?limit=${limit}`)
  }

  async getUnderutilizedRooms(limit = 10) {
    return this.client.get(`/hotel-rooms/analytics/underutilized?limit=${limit}`)
  }

  // Legacy compatibility methods (redirects to new hotel-rooms endpoints)
  async getRooms(skip = 0, limit = 100) {
    return this.getHotelRooms(skip, limit)
  }

  async getRoom(roomNumber) {
    return this.getHotelRoom(roomNumber)
  }

  async createRoom(roomData) {
    return this.createHotelRoom(roomData)
  }

  async updateRoom(roomNumber, roomData) {
    return this.updateHotelRoom(roomNumber, roomData)
  }

  async deleteRoom(roomNumber) {
    return this.deleteHotelRoom(roomNumber)
  }

  async getRoomsByStatus(status) {
    return this.getHotelRoomsByStatus(status)
  }

  // Room Pricing endpoints
  async getRoomPricing(roomType, checkDate = null) {
    let url = `/room-pricing/pricing/${roomType}`
    if (checkDate) {
      url += `?check_date=${checkDate}`
    }
    return this.client.get(url)
  }

  async getAllRoomPricing() {
    return this.client.get('/room-pricing/pricing')
  }

  async getRoomCategories() {
    return this.client.get('/room-pricing/categories')
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

  // Alias for getCountries
  async getNationalities() {
    return this.getCountries()
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

  // Group Bookings endpoints
  async createGroupBooking(bookingData) {
    return this.client.post('/group-bookings/', bookingData)
  }

  async getGroupBookings(skip = 0, limit = 100, status = null) {
    let url = `/group-bookings/?skip=${skip}&limit=${limit}`
    if (status) {
      url += `&status=${status}`
    }
    return this.client.get(url)
  }

  async getGroupBooking(groupBookingId) {
    return this.client.get(`/group-bookings/${groupBookingId}`)
  }

  async updateGroupBooking(groupBookingId, bookingData) {
    return this.client.put(`/group-bookings/${groupBookingId}`, bookingData)
  }

  async deleteGroupBooking(groupBookingId) {
    return this.client.delete(`/group-bookings/${groupBookingId}`)
  }

  async getGroupBookingRooms() {
    return this.client.get('/group-bookings/rooms/all')
  }

  // Revenue Reports APIs
  async getHotelRevenue(startDate, endDate) {
    let url = '/revenue-reports/hotel-revenue'
    const params = []
    if (startDate) params.push(`start_date=${startDate}`)
    if (endDate) params.push(`end_date=${endDate}`)
    if (params.length > 0) url += `?${params.join('&')}`
    return this.client.get(url)
  }

  async getNonHotelRevenue(startDate, endDate) {
    let url = '/revenue-reports/non-hotel-revenue'
    const params = []
    if (startDate) params.push(`start_date=${startDate}`)
    if (endDate) params.push(`end_date=${endDate}`)
    if (params.length > 0) url += `?${params.join('&')}`
    return this.client.get(url)
  }
}

export const apiService = new ApiService()
export default apiService