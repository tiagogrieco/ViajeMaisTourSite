import os
import re
import json

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
PUBLIC_ASSETS_DIR = os.path.join(SCRIPT_DIR, "../public")

def load_posts():
    """Reads blogData.ts and extracts post metadata."""
    if not os.path.exists(BLOG_DATA_PATH):
        print(f"❌ File not found: {BLOG_DATA_PATH}")
        return None, None

    with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Regex to find post objects (simplified)
    # This assumes consistent formatting from our create_post.py script
    # We look for id: <number> and title: "..."
    post_pattern = re.compile(r'\{\s*id:\s*(\d+).*?title:\s*"(.*?)".*?image:\s*"(.*?)".*?\},', re.DOTALL)
    
    matches = post_pattern.findall(content)
    posts = []
    for m in matches:
        posts.append({
            "id": m[0],
            "title": m[1],
            "image": m[2]
        })
    
    return posts, content

def delete_post(post_id, posts, original_content):
    """Deletes a post from the file and its image."""
    
    post_to_delete = next((p for p in posts if p['id'] == post_id), None)
    if not post_to_delete:
        print("❌ Post not found in memory.")
        return

    print(f"\n🗑️  Deleting: {post_to_delete['title']} (ID: {post_id})...")

    # 1. Remove from blogData.ts
    # We find the specific block for this ID using regex
    # Pattern looks for { id: <id>, ... }, including the trailing comma
    block_pattern = re.compile(r'\s*\{\s*id:\s*' + post_id + r',.*?\},\n', re.DOTALL)
    
    match = block_pattern.search(original_content)
    if match:
        new_content = original_content.replace(match.group(0), "")
        
        with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        print("✅ Removed from blogData.ts")
    else:
        print("⚠️ Could not locate code block in file (formatting might be different).")

    # 2. Delete Image
    image_path = post_to_delete['image']
    if image_path and "/assets/" in image_path:
        # Convert web path to local path
        # from /assets/blog/foo.jpg to .../public/assets/blog/foo.jpg
        local_path = os.path.join(PUBLIC_ASSETS_DIR, image_path.lstrip("/").replace("/", os.sep))
        
        if os.path.exists(local_path):
            try:
                os.remove(local_path)
                print(f"✅ Deleted image: {local_path}")
            except Exception as e:
                print(f"❌ Failed to delete image: {e}")
        else:
            print(f"⚠️ Image file not found: {local_path}")

def main():
    while True:
        posts, content = load_posts()
        if not posts:
            break

        print("\n📝 --- GlowFast Blog Manager ---")
        print(f"Found {len(posts)} posts.\n")
        
        print(f"{'ID':<15} | {'Title'}")
        print("-" * 60)
        
        for p in posts:
            print(f"{p['id']:<15} | {p['title']}")

        print("-" * 60)
        print("Enter Post ID to delete, or 'q' to quit.")
        
        choice = input("> ").strip()
        
        if choice.lower() == 'q':
            break
        
        if choice in [p['id'] for p in posts]:
            confirm = input(f"❗ Are you SURE you want to delete post {choice}? (y/n): ")
            if confirm.lower() == 'y':
                delete_post(choice, posts, content)
                input("Press Enter to continue...")
        else:
            print("❌ Invalid ID.")

if __name__ == "__main__":
    main()
