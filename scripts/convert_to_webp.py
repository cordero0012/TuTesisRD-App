from PIL import Image
import os

def convert_to_webp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                filepath = os.path.join(root, file)
                webp_path = os.path.splitext(filepath)[0] + '.webp'
                
                # Skip if already exists and is newer than source
                if os.path.exists(webp_path) and os.path.getmtime(webp_path) > os.path.getmtime(filepath):
                    continue
                
                try:
                    with Image.open(filepath) as img:
                        # Convert to RGB if it's RGBA (PNG with transparency) and we want to save as WebP
                        # PIL handles PNG to WebP with alpha properly usually, but it's safe to be explicit if needed.
                        img.save(webp_path, 'WEBP', quality=80)
                        print(f"✅ Converted: {file} -> {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"❌ Error converting {file}: {e}")

if __name__ == "__main__":
    directories = ['public', 'src/assets']
    for d in directories:
        if os.path.exists(d):
            print(f"--- Converting images in: {d} ---")
            convert_to_webp(d)
