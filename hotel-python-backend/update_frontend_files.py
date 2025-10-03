"""
Script to remove registration_type and reservation_type from frontend JSX files
"""

import re

# File 1: registrasi.jsx
registrasi_file = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src\pages\operational\frontoffice\form_transaksi\registrasi.jsx"

print("Processing registrasi.jsx...")
with open(registrasi_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove registrationTypes state
content = re.sub(r"  const \[registrationTypes, setRegistrationTypes\] = useState\(\[\]\)\n", "", content)

# Remove registration_type from initialFormState
content = re.sub(r"    registration_type: '',\n", "", content)

# Remove the Registration Type form field
content = re.sub(
    r"                  <div className=\"form-group\">\n"
    r"                      <label>Registration Type</label>\n"
    r"                      <select name=\"registration_type\" value=\{formData\.registration_type\} onChange=\{handleInputChange\} className=\"form-select\">\n"
    r"                          <option value=\"Normal\">Normal</option>\n"
    r"                          <option value=\"6hours\">6 Hours</option>\n"
    r"                      </select>\n"
    r"                  </div>\n",
    "",
    content
)

# Remove API call comments for registration_types
content = re.sub(
    r"        // Anda mungkin perlu menambahkan endpoint untuk registration_types di api\.js\n        // apiService\.getRegistrationTypes\(\) \n",
    "",
    content
)

# Remove setRegistrationTypes line
content = re.sub(
    r"      // setRegistrationTypes\(getDataOrDefault\(results\[7\]\)\); // Aktifkan jika endpoint ada\n",
    "",
    content
)

with open(registrasi_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ registrasi.jsx updated")

# File 2: reservasi.jsx
reservasi_file = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src\pages\operational\frontoffice\form_transaksi\reservasi.jsx"

print("Processing reservasi.jsx...")
with open(reservasi_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove registrationTypes state
content = re.sub(r"  const \[registrationTypes, setRegistrationTypes\] = useState\(\[\]\)\n", "", content)

# Remove registration_type from initialFormState
content = re.sub(r"    registration_type: '',\n", "", content)

# Remove the Reservation Type form field (different name than registrasi)
content = re.sub(
    r"                      <select name=\"reservation_type\" value=\{formData\.reservation_type\} onChange=\{handleInputChange\} className=\"form-select\">\n",
    "",
    content,
    flags=re.MULTILINE
)

with open(reservasi_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ reservasi.jsx updated")
print("\n✅ All frontend files updated successfully!")
