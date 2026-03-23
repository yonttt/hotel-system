import os

def fix_whitespace(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('\u00A0', ' ')
    
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {filepath}")
    else:
        print(f"No changes: {filepath}")

if __name__ == "__main__":
    target_file = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src\pages\operational\frontoffice\form_transaksi\reservasi.jsx"
    fix_whitespace(target_file)
