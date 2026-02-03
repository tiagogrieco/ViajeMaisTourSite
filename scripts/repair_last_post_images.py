import os
import re
import json
import time
import random
import urllib.parse
import requests
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
ASSETS_DIR = os.path.join(SCRIPT_DIR, "../public/assets/blog")

def generate_stock_image(prompt):
    """Generates an image URL using Pollinations.ai (Turbo model)."""
    # Wait to avoid rate limits
    time.sleep(3) 
    
    clean_prompt = re.sub(r'[^\w\s,]', '', prompt) 
    # Enhanced prompt for realistic travel style - SAME AS create_pro_post.py
    final_prompt = f"editorial travel photography, {clean_prompt}, award winning, 8k, highly detailed, natural lighting, shot on 35mm"
    encoded_prompt = urllib.parse.quote(final_prompt)
    
    # Use a large random seed
    seed = random.randint(0, 999999999)
    # Using 'turbo' model for best speed and fewer rate limits
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1280&height=720&nologo=true&seed={seed}&model=turbo"
    return url

def download_image(url, filename):
    """Downloads an image from URL and saves it to local assets."""
    try:
        os.makedirs(ASSETS_DIR, exist_ok=True)
        filepath = os.path.join(ASSETS_DIR, filename)
        
        print(f"Downloading {url} to {filepath}...", file=sys.stderr)
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return f"/assets/blog/{filename}"
        else:
            print(f"Failed to download: {response.status_code}", file=sys.stderr)
    except Exception as e:
        print(f"Error downloading image: {e}", file=sys.stderr)
    
    return None

def repair_images():
    print("Reading blogData.ts...", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("blogData.ts not found!", file=sys.stderr)
        return

    # Find the START of the blog posts array
    match_start = re.search(r"export const BLOG_POSTS: BlogPost\[\] = \[", content)
    if not match_start:
        print("Could not find BLOG_POSTS array start.", file=sys.stderr)
        return

    # To process the file safely without parsing the entire massive TS file (which might have base64),
    # we'll look for the LAST object structure by splitting or regex.
    # A simplified approach: Split by "id:" to find objects.
    
    # Let's find the last occurrence of "id:" which likely starts the last post object
    last_id_index = content.rfind("id:")
    if last_id_index == -1:
        print("No posts found.", file=sys.stderr)
        return

    # Extract the chunk from the last id to the end
    post_chunk = content[last_id_index:]
    
    # Parse Title
    title_match = re.search(r'title:\s*(?:"(.*?)"|`(.*?)`)', post_chunk)
    if not title_match:
        print("Could not find title of the last post.", file=sys.stderr)
        return
    title = title_match.group(1) or title_match.group(2)
    print(f"Found last post: {title}", file=sys.stderr)
    
    title_slug = re.sub(r'[^\w]', '-', title.lower())

    # --- REGENERATE COVER IMAGE ---
    print("Regenerating Cover Image...", file=sys.stderr)
    cover_prompt = f"travel photography, {title}, aesthetic, 8k"
    cover_url = generate_stock_image(cover_prompt)
    cover_filename = f"blog-{title_slug}-cover-fixed.jpg"
    new_cover_path = download_image(cover_url, cover_filename)
    
    if new_cover_path:
        # Replace the image field in the file. 
        # We need to be careful to only replace it in the LAST post.
        # We'll use a specific regex that matches the image: "..." field after the last ID.
        
        # Regex to match image field in the specific post chunk context is tricky globally.
        # So we construct a targeted regex for the file content starting near last_id_index
        
        # Determine the position of 'image:' after last_id_index
        image_key_index = content.find("image:", last_id_index)
        if image_key_index != -1:
            # Find the value start and end
            # Value starts after "image:" and optional whitespace, quote
            quote_match = re.search(r'["`]', content[image_key_index:])
            if quote_match:
                quote_char = quote_match.group(0)
                start_quote_pos = image_key_index + quote_match.start()
                end_quote_pos = content.find(quote_char, start_quote_pos + 1)
                
                if end_quote_pos != -1:
                    print(f"Replacing cover image at {start_quote_pos}...", file=sys.stderr)
                    content = content[:start_quote_pos+1] + new_cover_path + content[end_quote_pos:]
                    
    # --- REGENERATE CONTENT IMAGES ---
    # Now we need to find images in the 'content' field of the last post.
    # The content is usually in backticks `...`
    
    # We essentially need to re-read the content part because we modified `content` string above.
    # Let's re-locate the last post's content field.
    last_id_index = content.rfind("id:") # Re-find because indices shifted
    content_key_index = content.find("content:", last_id_index)
    
    if content_key_index != -1:
        print("Scanning content for broken images...", file=sys.stderr)
        # Extract the content string loosely to find <img> tags
        # We assume content starts with ` and ends with `
        start_backtick = content.find("`", content_key_index)
        end_backtick = content.find("`", start_backtick + 1)
        
        # If we can't find specific boundaries easily (because of nested backticks or whatever), 
        # we can regex iterate over the whole tail, but safe targeting is better.
        
        if start_backtick != -1 and end_backtick != -1:
            post_content_str = content[start_backtick:end_backtick]
            
            # Find all <img> tags and their alts
            # Format: <img src="..." alt="(...)" ...>
            
            def replace_img(match):
                alt_text = match.group(1)
                print(f"Regenerating content image for: {alt_text}...", file=sys.stderr)
                
                new_img_url = generate_stock_image(alt_text)
                # Generate a unique suffix for this image
                img_filename = f"blog-{title_slug}-{random.randint(100,999)}.jpg"
                local_path = download_image(new_img_url, img_filename)
                
                if local_path:
                    # Return reconstructed img tag with new src
                    # Preserving class and other attributes roughly
                    return f'<img src="{local_path}" alt="{alt_text}" class="w-full rounded-xl shadow-lg object-cover max-h-[500px]" />'
                return match.group(0) # Fail safe
            
            # Regex to match the img tag specifically generated by our script
            # <img src="..." alt="..." class="..." />
            # We capture the alt text.
            new_post_content_str = re.sub(r'<img src="[^"]+" alt="([^"]+)" [^>]+>', replace_img, post_content_str)
            
            if new_post_content_str != post_content_str:
                content = content[:start_backtick] + new_post_content_str + content[end_backtick:]
                print("Content images updated.", file=sys.stderr)

    # Save
    with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(content)
    print("✅ Repair complete. 'blogData.ts' updated.", file=sys.stderr)

if __name__ == "__main__":
    repair_images()
