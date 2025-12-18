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

  async updateCurrentUser(userData) {
    return this.client.put('/auth/me', userData)
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

  async getUsersByRole(role) {
    return this.client.get(`/users/by-role/${role}`)
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

  // Legacy compatibility method (used in forms)
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

  async getRoomCategories() {
    return this.client.get('/room-pricing/categories')
  }

  // Update room category
  async updateRoomCategory(categoryId, categoryData) {
    return this.client.put(`/room-pricing/categories/${categoryId}`, categoryData)
  }

  // Guests endpoints
  async getGuests(skip = 0, limit = 100) {
    return this.client.get(`/guests/?skip=${skip}&limit=${limit}`)
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

  // ============================================================================
  // MASTER DATA APIs - Dynamic lookups from database
  // ============================================================================

  // Hotels
  async getHotels(activeOnly = true) {
    return this.client.get(`/master-data/hotels?active_only=${activeOnly}`)
  }

  // Room Statuses
  async getRoomStatuses(activeOnly = true) {
    return this.client.get(`/master-data/room-statuses?active_only=${activeOnly}`)
  }

  // ID Card Types
  async getIdCardTypes(activeOnly = true) {
    return this.client.get(`/master-data/id-card-types?active_only=${activeOnly}`)
  }

  // Guest Titles
  async getGuestTitles(activeOnly = true) {
    return this.client.get(`/master-data/guest-titles?active_only=${activeOnly}`)
  }

  // Guest Types
  async getGuestTypes(activeOnly = true) {
    return this.client.get(`/master-data/guest-types?active_only=${activeOnly}`)
  }

  // ============================================================================
  // ROOM RATES APIs - Master Harga Kamar
  // ============================================================================

  // Get all room rates
  async getRoomRates(skip = 0, limit = 100, hotelName = null, rateName = null, roomType = null) {
    let url = `/room-rates/?skip=${skip}&limit=${limit}`
    if (hotelName) url += `&hotel_name=${encodeURIComponent(hotelName)}`
    if (rateName) url += `&rate_name=${encodeURIComponent(rateName)}`
    if (roomType) url += `&room_type=${encodeURIComponent(roomType)}`
    return this.client.get(url)
  }

  // Get room rate by ID
  async getRoomRate(rateId) {
    return this.client.get(`/room-rates/${rateId}`)
  }

  // Create new room rate
  async createRoomRate(rateData) {
    return this.client.post('/room-rates/', rateData)
  }

  // Update room rate
  async updateRoomRate(rateId, rateData) {
    return this.client.put(`/room-rates/${rateId}`, rateData)
  }

  // Delete room rate
  async deleteRoomRate(rateId) {
    return this.client.delete(`/room-rates/${rateId}`)
  }

  // Get rate names for dropdown
  async getRateNames() {
    return this.client.get('/room-rates/lookup/rate-names')
  }

  // Get room types for dropdown
  async getRoomTypesLookup() {
    return this.client.get('/room-rates/lookup/room-types')
  }

  // Get applicable rate for a specific room type and date (AUTO-PRICING)
  async getRateForDate(roomType, checkDate = null, hotelName = 'HOTEL NEW IDOLA') {
    let url = `/room-rates/pricing/${encodeURIComponent(roomType)}`
    const params = []
    if (checkDate) params.push(`check_date=${checkDate}`)
    if (hotelName) params.push(`hotel_name=${encodeURIComponent(hotelName)}`)
    if (params.length > 0) url += `?${params.join('&')}`
    return this.client.get(url)
  }

  // ==================== MASTER MEJA (F&B Table Management) ====================
  
  // Get all tables
  async getMasterMeja(skip = 0, limit = 100, hotelId = null, status = null) {
    let url = `/master-meja/?skip=${skip}&limit=${limit}`
    if (hotelId) url += `&hotel_id=${hotelId}`
    if (status) url += `&status=${encodeURIComponent(status)}`
    return this.client.get(url)
  }

  // Get table by ID
  async getMasterMejaById(tableId) {
    return this.client.get(`/master-meja/${tableId}`)
  }

  // Create new table
  async createMasterMeja(tableData) {
    return this.client.post('/master-meja/', tableData)
  }

  // Update table
  async updateMasterMeja(tableId, tableData) {
    return this.client.put(`/master-meja/${tableId}`, tableData)
  }

  // Delete table
  async deleteMasterMeja(tableId) {
    return this.client.delete(`/master-meja/${tableId}`)
  }

  // Get hotels list for filter
  async getMasterMejaHotels() {
    return this.client.get('/master-meja/hotels/list')
  }

  // ==================== KATEGORI MENU RESTO (F&B Menu Categories) ====================
  
  // Get all menu categories
  async getKategoriMenuResto(skip = 0, limit = 100, hotelId = null) {
    let url = `/kategori-menu-resto/?skip=${skip}&limit=${limit}`
    if (hotelId) url += `&hotel_id=${hotelId}`
    return this.client.get(url)
  }

  // Get category by ID
  async getKategoriMenuRestoById(categoryId) {
    return this.client.get(`/kategori-menu-resto/${categoryId}`)
  }

  // Create new category
  async createKategoriMenuResto(categoryData) {
    return this.client.post('/kategori-menu-resto/', categoryData)
  }

  // Update category
  async updateKategoriMenuResto(categoryId, categoryData) {
    return this.client.put(`/kategori-menu-resto/${categoryId}`, categoryData)
  }

  // Delete category
  async deleteKategoriMenuResto(categoryId) {
    return this.client.delete(`/kategori-menu-resto/${categoryId}`)
  }

  // Get hotels list for filter
  async getKategoriMenuRestoHotels() {
    return this.client.get('/kategori-menu-resto/hotels/list')
  }
}

export const apiService = new ApiService()
export default apiService