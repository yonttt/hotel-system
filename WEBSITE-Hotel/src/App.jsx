import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import RoomsPage from './pages/RoomsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import OffersPage from './pages/OffersPage'
import GalleryPage from './pages/GalleryPage'
import BookingPage from './pages/BookingPage'
import HotelDetailPage from './pages/HotelDetailPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
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
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
