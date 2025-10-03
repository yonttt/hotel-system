"""
Script to properly remove registration_type and reservation_type from frontend JSX files
"""

import os

# File paths
registrasi_file = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src\pages\operational\frontoffice\form_transaksi\registrasi.jsx"
reservasi_file = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src\pages\operational\frontoffice\form_transaksi\reservasi.jsx"

def process_registrasi():
    print("Processing registrasi.jsx...")
    
    with open(registrasi_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_next_lines = 0
    
    for i, line in enumerate(lines):
        # Skip lines if we're in a skip block
        if skip_next_lines > 0:
            skip_next_lines -= 1
            continue
        
        # Skip the registrationTypes state line
        if'const [registrationTypes, setRegistrationTypes] = useState([])' in line:
            continue
        
        # Skip registration_type from initialFormState
        if "registration_type: ''," in line:
            continue
        
        # Skip the registration type form group (8 lines)
        if '<label>Registration Type</label>' in line:
            skip_next_lines = 6  # Skip next 6 lines to complete the form group
            continue
        
        # Skip comment lines about registration_types
        if'// Anda mungkin perlu menambahkan endpoint untuk registration_types' in line:
            continue
        if '// apiService.getRegistrationTypes()' in line:
            continue
        if '// setRegistrationTypes(getDataOrDefault(results[7]));' in line:
            continue
        
        new_lines.append(line)
    
    with open(registrasi_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("✅ registrasi.jsx updated")

def process_reservasi():
    print("Processing reservasi.jsx...")
    
    with open(reservasi_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_next_lines = 0
    
    for i, line in enumerate(lines):
        # Skip lines if we're in a skip block
        if skip_next_lines > 0:
            skip_next_lines -= 1
            continue
        
        # Skip the registrationTypes state line
        if 'const [registrationTypes, setRegistrationTypes] = useState([])' in line:
            continue
        
        # Skip registration_type from initialFormState
        if "registration_type: ''," in line:
            continue
        
        # Skip the reservation type form group
        if '<label>Reservation Type</label>' in line:
            skip_next_lines = 6  # Skip next 6 lines
            continue
        
        new_lines.append(line)
    
    with open(reservasi_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("✅ reservasi.jsx updated")

if __name__ == "__main__":
    process_registrasi()
    process_reservasi()
    print("\n✅ All frontend files updated successfully!")
