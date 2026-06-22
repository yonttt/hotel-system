import { Routes, Route } from 'react-router-dom'
import Navbar from './ui/Navbar'
import Footer from './ui/Footer'
import ScrollToTop from './ui/ScrollToTop'
import HomePage from './views/HomePage'
import RoomsPage from './views/RoomsPage'
import AboutPage from './views/AboutPage'
import ContactPage from './views/ContactPage'
import OffersPage from './views/OffersPage'
import GalleryPage from './views/GalleryPage'
import BookingPage from './views/BookingPage'
import BookingLookupPage from './views/BookingLookupPage'
import HotelDetailPage from './views/HotelDetailPage'
import LoginPage from './views/LoginPage'
import RegisterPage from './views/RegisterPage'
import TopProgressBar from './ui/TopProgressBar'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopProgressBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/cek-booking" element={<BookingLookupPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

