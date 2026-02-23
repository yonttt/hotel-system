import HeroSlider from '../components/HeroSlider'
import BookingBar from '../components/BookingBar'
import AboutSection from '../sections/AboutSection'
import FeaturedHotels from '../sections/FeaturedHotels'
import RoomsSection from '../sections/RoomsSection'
import SpecialOffers from '../sections/SpecialOffers'
import TestimonialsSection from '../sections/TestimonialsSection'
import NewsSection from '../sections/NewsSection'
import InstagramFeed from '../sections/InstagramFeed'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <BookingBar />
      <AboutSection />
      <RoomsSection />
      <FeaturedHotels />
      <SpecialOffers />
      <TestimonialsSection />
      <NewsSection />
      <InstagramFeed />
    </>
  )
}
