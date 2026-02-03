import os
import re
import sys
import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
ASSETS_DIR = os.path.join(SCRIPT_DIR, "../public/assets/blog")

def diagnose():
    print("--- Blog Assets (Matched 'paris' or recent) ---", file=sys.stderr)
    try:
        files = os.listdir(ASSETS_DIR)
        paris_files = []
        for f in files:
            path = os.path.join(ASSETS_DIR, f)
            t = os.path.getmtime(path)
            dt = datetime.datetime.fromtimestamp(t)
            if "paris" in f.lower() or dt.date() >= datetime.date.today():
                paris_files.append((f, dt))
        
        paris_files.sort(key=lambda x: x[1])
        
        for f, dt in paris_files:
            print(f"{dt} - {f}", file=sys.stderr)
    except Exception as e:
        print(f"Error listing assets: {e}", file=sys.stderr)

    print("\n--- Blog Post Content Inspection ---", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            
        post_match = re.search(r'(?s){[^}]*?title:\s*"Guia Completo Paris 2026[^}]*?image:\s*"(.*?)"[^}]*?content:\s*`(.*?)`', content)
        
        if post_match:
            print(f"Current Cover Image: {post_match.group(1)}", file=sys.stderr)
            content_body = post_match.group(2)
            
            # Find all images in content
            img_matches = re.finditer(r'<img\s+[^>]*src="([^"]+)"[^>]*alt="([^"]+)"', content_body)
            print("Content Images:", file=sys.stderr)
            for m in img_matches:
                print(f"  - SRC: {m.group(1)} | ALT: {m.group(2)}", file=sys.stderr)
        else:
            print("Could not parse 'Guia Completo Paris 2026' post struct.", file=sys.stderr)
            # Try simpler search if regex failed
            if "Guia Completo Paris 2026" in content:
                print("...but the string exists in file.", file=sys.stderr)

    except Exception as e:
        print(f"Error reading blogData: {e}", file=sys.stderr)

if __name__ == "__main__":
    diagnose()
