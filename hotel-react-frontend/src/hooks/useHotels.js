import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

/**
 * Custom hook to fetch hotel/property list from database.
 * Provides dynamic hotel options for dropdowns across the system.
 * Returns { hotels, hotelNames, loading, defaultHotel }
 */
const useHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await apiService.getHotels(true);
        setHotels(response.data || []);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // Extract hotel names for easy dropdown use
  const hotelNames = hotels.map(h => h.name);

  // Default hotel = prioritize Hotel New Idola, otherwise first active hotel or empty string
  const idolaHotel = hotels.find(h => h.name.toLowerCase().includes('idola'));
  const defaultHotel = idolaHotel ? idolaHotel.name : (hotels.length > 0 ? hotels[0].name : '');

  return { hotels, hotelNames, loading, defaultHotel };
};

export default useHotels;
