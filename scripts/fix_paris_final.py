import os
import re
import sys
import datetime
import requests
import urllib.parse
import random
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
ASSETS_DIR = os.path.join(SCRIPT_DIR, "../public/assets/blog")

def generate_image(prompt):
    """Generates an image URL using Pollinations.ai (Turbo)."""
    time.sleep(2) # Safety delay
    clean_prompt = re.sub(r'[^\w\s,]', '', prompt)
    final_prompt = f"travel photography, {clean_prompt}, 8k, realistic, cinematic lighting"
    encoded_prompt = urllib.parse.quote(final_prompt)
    seed = random.randint(0, 999999)
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1280&height=720&nologo=true&seed={seed}&model=turbo"

def download_image(url, filename):
    try:
        os.makedirs(ASSETS_DIR, exist_ok=True)
        filepath = os.path.join(ASSETS_DIR, filename)
        print(f"Downloading {filename}...", file=sys.stderr)
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return f"/assets/blog/{filename}"
        else:
            print(f"Failed to download {url}: Status {response.status_code}", file=sys.stderr)
    except Exception as e:
        print(f"Error downloading: {e}", file=sys.stderr)
    return None

def fix_paris_post():
    print("Reading blogData.ts...", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!", file=sys.stderr)
        return

    # 1. Restore Cover Image
    # Find all 'paris' cover images
    paris_covers = []
    try:
        for f in os.listdir(ASSETS_DIR):
            if "paris" in f.lower() and "cover" in f.lower() and (f.endswith(".jpg") or f.endswith(".png") or f.endswith(".webp")):
                path = os.path.join(ASSETS_DIR, f)
                paris_covers.append((f, os.path.getctime(path)))
    except Exception:
        pass

    paris_covers.sort(key=lambda x: x[1]) # Sort by creation time (earliest first)
    
    new_cover_path = None
    if paris_covers:
        # The earliest one is likely the original "good" one the user liked
        # But let's check if there are multiple.
        # If the user liked the one BEFORE my last changes, it's probably the second to last?
        # Safe bet: The oldest one matching the slug structure created by the first run.
        best_cover = paris_covers[0][0]
        new_cover_path = f"/assets/blog/{best_cover}"
        print(f"Restoring potential original cover: {best_cover}", file=sys.stderr)
    else:
        print("No previous Paris covers found. Keeping current.", file=sys.stderr)

    # Update Cover in Content
    if new_cover_path:
        # Find the Paris post block
        # We look for the object containing the title
        pattern = r'(title:\s*"Guia Completo Paris 2026.*?)image:\s*".*?"'
        
        def repl(match):
            return f'{match.group(1)}image: "{new_cover_path}"'
            
        content = re.sub(pattern, repl, content, flags=re.DOTALL)

    # 2. Fix Content Images
    # We need to find the content string of the Paris post.
    # It's tricky with regex over large file with nested structures.
    # We'll match the specific content block for this post.
    
    # We assume deduplication worked and there's only one.
    start_marker = 'title: "Guia Completo Paris 2026'
    start_pos = content.find(start_marker)
    
    if start_pos != -1:
        # Find the content field after this title
        content_marker = 'content: `'
        content_start = content.find(content_marker, start_pos)
        
        if content_start != -1:
            content_start_idx = content_start + len(content_marker)
            content_end_idx = content.find('`', content_start_idx)
            
            if content_end_idx != -1:
                post_content = content[content_start_idx:content_end_idx]
                
                # Iterate and replace images
                def replace_img(match):
                    # alt_text = match.group(2) # REMOVED: Invalid group access
                    # Actually let's use a simpler regex for the callback
                    # The match object comes from re.sub
                    # We need to parse src and alt from the match
                    
                    full_tag = match.group(0)
                    src_match = re.search(r'src="([^"]+)"', full_tag)
                    alt_match = re.search(r'alt="([^"]+)"', full_tag)
                    
                    if not alt_match: return full_tag
                    
                    alt = alt_match.group(1)
                    src = src_match.group(1) if src_match else ""
                    
                    print(f"Regenerating for alt: '{alt}'", file=sys.stderr)
                    
                    new_url = generate_image(alt)
                    fname = f"paris-content-{random.randint(1000,9999)}.jpg"
                    local_path = download_image(new_url, fname)
                    
                    if local_path:
                        # Construct new tag
                        return f'<img src="{local_path}" alt="{alt}" class="w-full rounded-xl shadow-lg object-cover max-h-[500px]" />'
                    return full_tag

                # Regex to match <img> tags
                new_post_content = re.sub(r'<img\s+[^>]*>', replace_img, post_content)
                
                if new_post_content != post_content:
                    content = content[:content_start_idx] + new_post_content + content[content_end_idx:]
                    print("Updated content images.", file=sys.stderr)

    with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Fixed Paris post images.", file=sys.stderr)

if __name__ == "__main__":
    fix_paris_post()
