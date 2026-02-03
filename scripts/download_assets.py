
import os
import requests

# Ensure directories exist
os.makedirs("public/assets/blog", exist_ok=True)
os.makedirs("public/assets/products", exist_ok=True)

def download_image(url, path):
    try:
        print(f"Downloading {path}...")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Saved to {path}")
        else:
            print(f"❌ Failed to download {url}: Status {response.status_code}")
    except Exception as e:
        print(f"❌ Error downloading {url}: {e}")

# --- BLOG IMAGES (Editorial/High Fashion) ---
blog_images = {
    # Post 1: Blonde Hair (Loiro) - NEW RELIABLE URL
    "post-1.jpg": "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1200", 
    # Post 2: Nails (Unhas)
    "post-2.jpg": "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200", # Manicure elegant
    # Post 3: Hair Texture/Science (Cronograma)
    "post-3.jpg": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200", # Shiny hair texture
    # Post 4: Scalp/Spa (Couro Cabeludo)
    "post-4.jpg": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200" # Woman relaxing/hair
}

# --- SHOP IMAGES (Cosmetic Bottles/Products) ---
# We need generic but "premium" looking bottles (serums, masks, oils)
shop_images = {
    # Blond Collection (Purple/Silver bottles)
    "blond-shampoo.jpg": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800", # Cosmetic bottle
    "blond-mask.jpg": "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800", # Jar
    "blond-oil.jpg": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800", # Oil dropper

    # Restoration Collection (Gold/Black bottles)
    "rest-mask.jpg": "https://images.unsplash.com/photo-1620917670397-a36b9e95cd2a?q=80&w=800", # Premium Jar
    "rest-kit.jpg": "https://images.unsplash.com/photo-1556228720-19270591e3e7?q=80&w=800", # Kit
    
    # Finishing/Oils (Gold/Amber)
    "oil-repair.jpg": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800", # Argan Oil style
    "serum.jpg": "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800", # Serum
    
    # GenericFallback
    "product-default.jpg": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800"
}

print("--- Starting Blog Asset Download ---")
for filename, url in blog_images.items():
    download_image(url, f"public/assets/blog/{filename}")

print("\n--- Starting Shop Asset Download ---")
for filename, url in shop_images.items():
    download_image(url, f"public/assets/products/{filename}")
