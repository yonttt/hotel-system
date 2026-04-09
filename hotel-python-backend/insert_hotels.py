import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models import Hotel

hotels_data = [
    {"name": "HOTEL NEW IDOLA", "category": "HOTEL", "address": "Jl. Pramuka Raya No.26 Jakarta Timur", "phone": "+62 21 8580224", "fax": "+62 21 8580224", "umh": 5729741, "umk": 5729741, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 1719000, "t_jabatan": 2000000, "t_penempatan": 2230000, "extrabed": 50},
    {"name": "HOTEL BENUA", "category": "HOTEL", "address": "Jl. Pelajar Pejuang 45 No. 111, Bandung", "phone": "+62 22 7321708", "fax": "+62 22 7321708", "umh": 4737678, "umk": 4737678, "plafon_covid": "100%", "sub_cabang": 111048, "t_tetap": 1421000, "t_jabatan": 1050000, "t_penempatan": 2270520, "extrabed": 0},
    {"name": "HOTEL SEMERU", "category": "HOTEL", "address": "Jl. Doktor Sumeru No. 64-66,Bogor", "phone": "+62 251 838499", "fax": "+62 251 838499", "umh": 5437202, "umk": 5437203, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 1631000, "t_jabatan": 1200000, "t_penempatan": 1611840, "extrabed": 0},
    {"name": "HOTEL GHOTIC", "category": "HOTEL", "address": "Jl. Soekarno Hatta No. 534, Bandung", "phone": "+62 22 7511464", "fax": "+6222 7511464", "umh": 4737678, "umk": 4737678, "plafon_covid": "100%", "sub_cabang": 115690, "t_tetap": 1421000, "t_jabatan": 1050000, "t_penempatan": 876960, "extrabed": 0},
    {"name": "HOTEL AMANAH BENUA", "category": "HOTEL", "address": "Jl. Jenderal Ahmad Yani No. 55,Cirebon", "phone": "+62 23 1201 35", "fax": "+62 23 1201 35", "umh": 2878646, "umk": 2878646, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 864000, "t_jabatan": 700000, "t_penempatan": 2632420, "extrabed": 0},
    {"name": "PENGINAPAN RIO", "category": "HOTEL", "address": "Jl. Jatinegara Timur 2 No. 7, Jakarta", "phone": "+62 21 8515708", "fax": "+62 21 8515 70", "umh": 5729740, "umk": 5729741, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 1719000, "t_jabatan": 2000000, "t_penempatan": 1675200, "extrabed": 0},
    {"name": "HOTEL BAMBOO", "category": "HOTEL", "address": "JL RAYA BARU No.25, Bogor", "phone": "+62 251 7532 8", "fax": "+62 251 7532 8", "umh": 5437202, "umk": 5437203, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 1631000, "t_jabatan": 1200000, "t_penempatan": 2329920, "extrabed": 0},
    {"name": "WISMA DEWI SARTIKA", "category": "HOTEL", "address": "Jl. Salak No.10, Cawang, Jakarta Timur", "phone": "(021) 80883494", "fax": "(021) 80883494", "umh": 5729741, "umk": 5729741, "plafon_covid": "100%", "sub_cabang": 0, "t_tetap": 1000000, "t_jabatan": 160000, "t_penempatan": 0, "extrabed": 0},
]

db = SessionLocal()
try:
    for h_data in hotels_data:
        hotel = db.query(Hotel).filter(Hotel.name == h_data['name']).first()
        if hotel:
            for k, v in h_data.items():
                setattr(hotel, k, v)
        else:
            hotel = Hotel(**h_data)
            db.add(hotel)
    db.commit()
    print("Hotels successfully seeded!")
finally:
    db.close()
