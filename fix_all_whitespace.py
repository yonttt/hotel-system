import os

def fix_whitespace_recursive(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        
        for file in files:
            if file.endswith('.jsx') or file.endswith('.js'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if '\u00A0' in content:
                        new_content = content.replace('\u00A0', ' ')
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed whitespace in: {filepath}")
                        count += 1
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
    
    print(f"Total files fixed: {count}")

if __name__ == "__main__":
    src_dir = r"c:\Users\yonat\OneDrive\Dokumen\hotel-system\hotel-react-frontend\src"
    fix_whitespace_recursive(src_dir)
