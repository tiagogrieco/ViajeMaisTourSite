
import instaloader
import os
import shutil
from itertools import islice
import json
import requests

# Configuration
TARGET_USERNAME = 'viajemais_tour' # Updated
# Adjust path to match your project structure: public/assets/instagram
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(base_dir, 'public', 'assets', 'instagram')
stories_dir = os.path.join(target_dir, 'stories')

# Ensure directories exist
if not os.path.exists(target_dir):
    os.makedirs(target_dir)
if not os.path.exists(stories_dir):
    os.makedirs(stories_dir)

def update_feed():
    print(f"🚀 Connecting to Instagram to fetch @{TARGET_USERNAME}...")
    
    L = instaloader.Instaloader()
    
    # Try to load session from 'instagram_session' file
    session_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'instagram_session') 
    
    if os.path.exists(session_file):
        print(f"🔑 Loading session from {session_file}...")
        try:
            L.load_session_from_file(TARGET_USERNAME, filename=session_file)
        except Exception as e:
            print(f"⚠️ Failed to load session: {e}")
    else:
        # Check current dir as fallback
        if os.path.exists('instagram_session'):
             try:
                L.load_session_from_file(TARGET_USERNAME, filename='instagram_session')
             except: pass

    try:
        profile = instaloader.Profile.from_username(L.context, TARGET_USERNAME)
        
        # --- 1. FETCH POSTS ---
        posts = profile.get_posts()
        top_posts = list(islice(posts, 5))
        
        posts_data = []
        if not top_posts:
            print("⚠️ No posts found or profile is private.")
        else:
            print(f"✨ Found {len(top_posts)} posts. Downloading...")
            for index, post in enumerate(top_posts):
                try:
                    image_url = post.url
                    filename = f"insta-{index + 1}.jpg"
                    filepath = os.path.join(target_dir, filename)
                    
                    print(f"   Downloading post {index + 1}...")
                    response = requests.get(image_url)
                    if response.status_code == 200:
                        with open(filepath, 'wb') as f:
                            f.write(response.content)
                        posts_data.append({
                            "id": index + 1,
                            "type": "post",
                            "filename": filename,
                            "caption": post.caption if post.caption else "",
                            "url": post.url,
                            "shortcode": post.shortcode
                        })
                    else:
                        print(f"   ❌ Failed to download image for post {index + 1}")
                except Exception as e:
                    print(f"   ❌ Error processing post {index + 1}: {e}")

        # --- 2. FETCH STORIES ---
        # Only works if logged in
        stories_data = []
        if L.context.is_logged_in:
            print(f"📸 Fetching stories for @{TARGET_USERNAME}...")
            try:
                stories = L.get_stories(userids=[profile.userid])
                count = 0
                for story in stories:
                    for item in story.get_items():
                        if count >= 5: break # Limit to 5 stories
                        
                        # Use first representation (usually best quality)
                        if item.is_video:
                           media_url = item.video_url
                           ext = "mp4"
                        else:
                           media_url = item.url
                           ext = "jpg"

                        filename = f"story-{count + 1}.{ext}"
                        filepath = os.path.join(stories_dir, filename)

                        print(f"   Downloading story {count + 1} ({item.date_local})...")
                        response = requests.get(media_url)
                        if response.status_code == 200:
                           with open(filepath, 'wb') as f:
                               f.write(response.content)
                           
                           stories_data.append({
                               "id": count + 1,
                               "type": "story",
                               "filename": f"stories/{filename}", # Relative path for frontend
                               "is_video": item.is_video,
                               "date": str(item.date_local),
                               "url": media_url
                           })
                           count += 1
                
                if count == 0:
                   print("   ℹ️ No active stories found.")

            except Exception as e:
                print(f"   ❌ Error fetching stories: {e}")
        else:
            print("⚠️ Not logged in. Skipping stories. (A valid session file is required to fetch stories)")

        # --- 3. SAVE DATA ---
        
        # Save combined feed data
        feed_data = {
            "posts": posts_data,
            "stories": stories_data
        }
        
        # We also maintain the legacy posts.json for now, just in case
        json_path = os.path.join(target_dir, 'posts.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(posts_data, f, ensure_ascii=False, indent=4)
            
        feed_path = os.path.join(target_dir, 'feed_data.json')
        with open(feed_path, 'w', encoding='utf-8') as f:
            json.dump(feed_data, f, ensure_ascii=False, indent=4)
            
        print(f"📝 Feed data saved to {feed_path}")
        print("🏁 Feed update complete!")

    except Exception as e:
        print(f"❌ Critical Error: {e}")

if __name__ == "__main__":
    update_feed()
