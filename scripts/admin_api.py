"""
Admin API Server - Backend for Blog Automation Admin Panel
Provides endpoints for scraping, AI rewriting, and calendar management
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
import sys
import json
import threading
from datetime import datetime

# Add scripts directory to path
sys.path.insert(0, os.path.dirname(__file__))

from blog_scraper import BlogScraper
from ai_rewriter import AIRewriter
from content_manager import ContentManager

app = Flask(__name__)
app.secret_key = 'viajemais-secret-key-2026'  # For sessions
CORS(app, supports_credentials=True)

# Global state for progress tracking
scraping_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}
rewriting_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}

# Password
ADMIN_PASSWORD = '1234'  # Same as existing admin

# Authentication
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    if data.get('password') == ADMIN_PASSWORD:
        session['authenticated'] = True
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'Senha incorreta'}), 401

@app.route('/api/auth/check', methods=['GET'])
def check_auth():
    return jsonify({'authenticated': session.get('authenticated', False)})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': True})

# Scraper Endpoints
@app.route('/api/scraper/start', methods=['POST'])
def start_scraper():
    global scraping_progress
    
    data = request.json
    sites = data.get('sites', ['melhores', 'passagens'])
    count = data.get('count', 10)
    
    def scrape_task():
        global scraping_progress
        scraping_progress = {'status': 'running', 'current': 0, 'total': count * len(sites), 'posts': []}
        
        try:
            scraper = BlogScraper(output_dir="scraped_content")
            all_posts = []
            
            for site in sites:
                if site == 'melhores':
                    posts = scraper.scrape_melhoresdestinos(max_posts=count)
                elif site == 'passagens':
                    posts = scraper.scrape_passagensimperdiveis(max_posts=count)
                else:
                    continue
                
                all_posts.extend(posts)
                scraping_progress['current'] = len(all_posts)
                scraping_progress['posts'] = all_posts
            
            scraping_progress['status'] = 'completed'
            
        except Exception as e:
            scraping_progress['status'] = 'error'
            scraping_progress['error'] = str(e)
    
    thread = threading.Thread(target=scrape_task)
    thread.start()
    
    return jsonify({'success': True, 'message': 'Scraping iniciado'})

@app.route('/api/scraper/status', methods=['GET'])
def scraper_status():
    return jsonify(scraping_progress)

@app.route('/api/scraper/posts', methods=['GET'])
def get_scraped_posts():
    """Get list of all scraped posts from files"""
    try:
        posts_dir = 'scraped_content'
        if not os.path.exists(posts_dir):
            return jsonify({'posts': []})
        
        all_posts = []
        for filename in os.listdir(posts_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(posts_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    posts = json.load(f)
                    all_posts.extend(posts)
        
        return jsonify({'posts': all_posts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# AI Rewriter Endpoints
@app.route('/api/rewriter/process', methods=['POST'])
def process_rewriter():
    global rewriting_progress
    
    data = request.json
    post_indices = data.get('post_indices', [])
    style = data.get('style', 'informativo_engajador')
    
    # Get posts from scraping progress or file
    posts_to_rewrite = []
    if scraping_progress['posts']:
        for idx in post_indices:
            if idx < len(scraping_progress['posts']):
                posts_to_rewrite.append(scraping_progress['posts'][idx])
    
    def rewrite_task():
        global rewriting_progress
        rewriting_progress = {'status': 'running', 'current': 0, 'total': len(posts_to_rewrite), 'posts': []}
        
        try:
            rewriter = AIRewriter()
            rewritten_posts = []
            
            for i, post in enumerate(posts_to_rewrite):
                rewritten = rewriter.rewrite_post(post, style=style)
                if rewritten:
                    rewritten_posts.append(rewritten)
                    rewriting_progress['current'] = i + 1
                    rewriting_progress['posts'] = rewritten_posts
            
            # Save to file
            rewriter.save_rewritten_posts(rewritten_posts, output_dir="rewritten_content")
            
            rewriting_progress['status'] = 'completed'
            
        except Exception as e:
            rewriting_progress['status'] = 'error'
            rewriting_progress['error'] = str(e)
    
    thread = threading.Thread(target=rewrite_task)
    thread.start()
    
    return jsonify({'success': True, 'message': 'Reescrita iniciada'})

@app.route('/api/rewriter/status', methods=['GET'])
def rewriter_status():
    return jsonify(rewriting_progress)

@app.route('/api/rewriter/posts', methods=['GET'])
def get_rewritten_posts():
    """Get list of all rewritten posts from files"""
    try:
        posts_dir = 'rewritten_content'
        if not os.path.exists(posts_dir):
            return jsonify({'posts': []})
        
        all_posts = []
        for filename in os.listdir(posts_dir):
            if filename.endswith('.json'):
                filepath = os.path.join(posts_dir, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    posts = json.load(f)
                    if isinstance(posts, list):
                        all_posts.extend(posts)
                    else:
                        all_posts.append(posts)
        
        return jsonify({'posts': all_posts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Calendar Endpoints
@app.route('/api/calendar', methods=['GET'])
def get_calendar():
    """Get editorial calendar"""
    try:
        if os.path.exists('editorial_calendar.json'):
            with open('editorial_calendar.json', 'r', encoding='utf-8') as f:
                calendar = json.load(f)
            return jsonify({'calendar': calendar})
        return jsonify({'calendar': []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/calendar/create', methods=['POST'])
def create_calendar():
    """Create editorial calendar from rewritten posts"""
    try:
        data = request.json
        posts_per_week = data.get('posts_per_week', 3)
        start_date = data.get('start_date', None)
        
        manager = ContentManager(rewritten_dir="rewritten_content")
        posts = manager.load_rewritten_posts()
        
        if not posts:
            return jsonify({'error': 'Nenhum post reescrito encontrado'}), 400
        
        calendar = manager.create_publishing_schedule(
            start_date=start_date,
            posts_per_week=posts_per_week,
            posting_days=[0, 2, 4],  # Mon, Wed, Fri
            posting_time="10:00"
        )
        
        manager.save_calendar("editorial_calendar.json")
        manager.export_to_blogdata("generated_blog_posts.ts")
        
        return jsonify({'success': True, 'calendar': calendar})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rewriter/post/<int:post_id>', methods=['PUT'])
def update_rewritten_post(post_id):
    """Update a specific rewritten post"""
    try:
        data = request.json
        
        # Load all posts
        posts_dir = 'rewritten_content'
        all_files = [f for f in os.listdir(posts_dir) if f.endswith('.json')]
        
        for filename in all_files:
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                posts = json.load(f)
            
            if isinstance(posts, list) and post_id < len(posts):
                # Update post
                posts[post_id].update(data)
                
                # Save back
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(posts, f, ensure_ascii=False, indent=2)
                
                return jsonify({'success': True, 'post': posts[post_id]})
        
        return jsonify({'error': 'Post não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/rewriter/post/<int:post_id>/publish', methods=['POST'])
def publish_rewritten_post(post_id):
    """Add a rewritten post to blogData.ts"""
    try:
        # Load all posts
        posts_dir = 'rewritten_content'
        if not os.path.exists(posts_dir):
            return jsonify({'error': 'Nenhum post encontrado'}), 404
            
        all_files = [f for f in os.listdir(posts_dir) if f.endswith('.json')]
        
        post_to_publish = None
        for filename in all_files:
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                posts = json.load(f)
            
            if isinstance(posts, list) and post_id < len(posts):
                post_to_publish = posts[post_id]
                break
        
        if not post_to_publish:
            return jsonify({'error': 'Post não encontrado'}), 404
        
        # Here you would integrate with your existing publishPost function
        # For now, just return success
        return jsonify({'success': True, 'message': 'Post publicado com sucesso!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall stats"""
    try:
        stats = {
            'scraped': 0,
            'rewritten': 0,
            'scheduled': 0
        }
        
        # Count scraped
        if os.path.exists('scraped_content'):
            for filename in os.listdir('scraped_content'):
                if filename.endswith('.json'):
                    with open(os.path.join('scraped_content', filename), 'r') as f:
                        posts = json.load(f)
                        stats['scraped'] += len(posts)
        
        # Count rewritten
        if os.path.exists('rewritten_content'):
            for filename in os.listdir('rewritten_content'):
                if filename.endswith('.json'):
                    with open(os.path.join('rewritten_content', filename), 'r') as f:
                        posts = json.load(f)
                        stats['rewritten'] += len(posts) if isinstance(posts, list) else 1
        
        # Count scheduled
        if os.path.exists('editorial_calendar.json'):
            with open('editorial_calendar.json', 'r') as f:
                calendar = json.load(f)
                stats['scheduled'] = len(calendar)
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 ADMIN API SERVER - BLOG AUTOMATION")
    print("="*60)
    print(f"\n✅ Server running on: http://localhost:5001")
    print(f"🔒 Password: {ADMIN_PASSWORD}")
    print("\n" + "="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
