const fs = require('fs');
const content = fs.readFileSync('WEBSITE-Hotel/src/data/hotels.js', 'utf8');

const newHotelProperties = export const hotelProperties = [
  {
    id: 1,
    name: 'HOTEL NEW IDOLA',
    location: 'Jakarta Timur',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    rating: 4.8,
    rooms: 120,
    address: 'Jl. Pramuka Raya No.26 Jakarta Timur',
    phone: '+62 21 8580224'
  },
  {
    id: 2,
    name: 'HOTEL BENUA',
    location: 'Bandung',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
    rating: 4.5,
    rooms: 85,
    address: 'Jl. Pelajar Pejuang 45 No. 111, Bandung',
    phone: '+62 22 7321708'
  },
  {
    id: 3,
    name: 'HOTEL SEMERU',
    location: 'Bogor',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    rating: 4.6,
    rooms: 90,
    address: 'Jl. Doktor Sumeru No. 64-66, Bogor',
    phone: '+62 251 838499'
  },
  {
    id: 4,
    name: 'HOTEL GHOTIC',
    location: 'Bandung',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    rating: 4.4,
    rooms: 75,
    address: 'Jl. Soekarno Hatta No. 534, Bandung',
    phone: '+62 22 7511464'
  },
  {
    id: 5,
    name: 'HOTEL AMANAH BENUA',
    location: 'Cirebon',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    rating: 4.3,
    rooms: 60,
    address: 'Jl. Jenderal Ahmad Yani No. 55, Cirebon',
    phone: '+62 23 1201 35'
  },
  {
    id: 6,
    name: 'PENGINAPAN RIO',
    location: 'Jakarta',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    rating: 4.2,
    rooms: 50,
    address: 'Jl. Jatinegara Timur 2 No. 7, Jakarta',
    phone: '+62 21 8515708'
  },
  {
    id: 7,
    name: 'HOTEL BAMBOO',
    location: 'Bogor',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    rating: 4.5,
    rooms: 65,
    address: 'JL RAYA BARU No.25, Bogor',
    phone: '+62 251 7532 8'
  },
  {
    id: 8,
    name: 'WISMA DEWI SARTIKA',
    location: 'Jakarta Timur',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
    rating: 4.1,
    rooms: 40,
    address: 'Jl. Salak No.10, Cawang, Jakarta Timur',
    phone: '(021) 80883494'
  }
];;

const updatedContent = content.replace(/export const hotelProperties = \[[\s\S]*?\](\s*;)?/, newHotelProperties + '\n');
fs.writeFileSync('WEBSITE-Hotel/src/data/hotels.js', updatedContent);
console.log('Updated hotels.js');
