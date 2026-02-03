import os
import re
import sys
import json
import argparse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")

def update_blog_images(post_id, updates_file_path):
    print(f"Reading {BLOG_DATA_PATH}...", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("Error: blogData.ts not found.", file=sys.stderr)
        return False

    try:
        with open(updates_file_path, "r", encoding="utf-8") as f:
            updates = json.load(f)
    except Exception as e:
        print(f"Error reading updates file: {e}", file=sys.stderr)
        return False
    new_cover = updates.get("coverImage")
    content_replacements = updates.get("contentImages", {}) # Dict of old_src -> new_src

    # Find the post block by ID
    # Pattern: id: <post_id>, (or similar)
    # We need to capture the whole object block to ensure we edit the right one.
    
    # Heuristic: split by "id:" and check the number.
    # Be careful about potential string matches in content.
    # Assuming standard formatting "id: 123,"
    
    # Find the post block by ID
    # Pattern: id: <post_id>, (allow spaces)
    print(f"Looking for Post ID: {post_id}", file=sys.stderr)
    
    # Use regex to find the ID with flexible spacing
    # Matches: id:\s*1768784121\s*,
    id_pattern = re.compile(rf'id:\s*{re.escape(str(post_id))}\s*,')
    match = id_pattern.search(content)
    
    if not match:
        # Try string format: id: "123",
        id_pattern = re.compile(rf'id:\s*["\']{re.escape(str(post_id))}["\']\s*,')
        match = id_pattern.search(content)
        
    if not match:
        print(f"Error: Post with ID {post_id} not found in blogData.ts", file=sys.stderr)
        sys.exit(1) # Fail explicitly
        
    start_pos = match.start()
    print(f"Found ID at position {start_pos}", file=sys.stderr)

    # Find valid boundaries for this post object
    # It starts before the ID. We search backwards for `{`
    object_start = content.rfind("{", 0, start_pos)
    
    # Find the end of this object `}`.
    brace_count = 0
    object_end = -1
    
    for i in range(object_start, len(content)):
        char = content[i]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                object_end = i
                break
    
    if object_end == -1:
        print("Error: Could not parse post object structure.", file=sys.stderr)
        sys.exit(1)

    post_block = content[object_start:object_end+1]
    original_post_block = post_block

    # 1. Update Cover Image
    if new_cover:
        print(f"Updating cover image to {new_cover}", file=sys.stderr)
        # Regex for image: "..." allowing for spaces and potentially quotes
        # image:\s*["']([^"']+)["']
        new_block = re.sub(r'(image:\s*["\'])([^"\']+)(["\'])', f'\\g<1>{new_cover}\\g<3>', post_block)
        if new_block == post_block:
             print("Warning: Could not match 'image' field for replacement.", file=sys.stderr)
        post_block = new_block

    # 2. Update Content Images
    if content_replacements:
        print(f"Updating {len(content_replacements)} content images...", file=sys.stderr)
        
        content_match = re.search(r'(content:\s*`)(.*?)(`)', post_block, re.DOTALL)
        if content_match:
            post_content = content_match.group(2)
            new_post_content = post_content
            
            for old_src, new_src in content_replacements.items():
                # Perform literal replacement but verify existence
                if old_src in new_post_content:
                    print(f"Replacing image src...", file=sys.stderr)
                    new_post_content = new_post_content.replace(old_src, new_src)
                else:
                    print(f"Warning: Image source not found in content: {old_src[:30]}...", file=sys.stderr)
            
            # Reconstruct block
            c_start, c_end = content_match.span(2)
            post_block = post_block[:c_start] + new_post_content + post_block[c_end:]
        else:
            print("Warning: Could not find 'content' field in post.", file=sys.stderr)

    # Write back if changed
    if post_block != original_post_block:
        full_new_content = content[:object_start] + post_block + content[object_end+1:]
        with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(full_new_content)
        print("✅ Successfully updated blogData.ts", file=sys.stderr)
        print(json.dumps({"success": True, "message": "Post updated"}))
    else:
        print("No changes were made to the file content.", file=sys.stderr)
        # Even if NO internal changes (maybe same image?), strictly it's a success, but user expects change.
        # But if we failed to match, we warned above.
        print(json.dumps({"success": True, "message": "No changes made (content identical or match failed)"}))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python update_blog_images.py <post_id> <updates_file_path>", file=sys.stderr)
        sys.exit(1)
        
    post_id = sys.argv[1]
    updates_file_path = sys.argv[2]
    
    update_blog_images(post_id, updates_file_path)
    

