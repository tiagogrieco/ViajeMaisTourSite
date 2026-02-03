import os
import json
import subprocess
import requests
import datetime
import urllib.parse
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import sys
import base64
import random
import time
import threading
from ai_rewriter import AIRewriter
from content_manager import ContentManager
from create_insta_post import generate_caption, generate_image_pollinations
from blog_scraper import BlogScraper

import threading

# Global state for progress tracking
scraping_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}
rewriting_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}

try:
    from google import genai
    from google.genai import types
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

# --- CONFIGURATION ---
GEMINI_API_KEY = "AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw"
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
VISITORS_FILE = os.path.join(SCRIPT_DIR, "visitors.json")

# LOGGING ON IMPORT
import uuid
RUNTIME_ID = str(uuid.uuid4())[:18]

try:
    with open(os.path.join(os.getcwd(), "server_debug.txt"), "a", encoding="utf-8") as f:
        f.write(f"[{datetime.datetime.now().isoformat()}] SERVER STARTED. Runtime ID: {RUNTIME_ID}. CWD: {os.getcwd()}\n")
except Exception as e:
    print(f"Failed to write import log: {e}")

app = Flask(__name__)
# Increase max upload size to 16MB (Flask default is often smaller)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 
CORS(app)

if HAS_GEMINI:
    client = genai.Client(api_key=GEMINI_API_KEY)

# Blog Automation Progress Tracking
scraping_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}
rewriting_progress = {'status': 'idle', 'current': 0, 'total': 0, 'posts': []}

# --- HELPER FUNCTIONS ---

def get_visitors_data():
    if os.path.exists(VISITORS_FILE):
        try:
            with open(VISITORS_FILE, 'r') as f:
                return json.load(f)
        except:
            pass
    return {"total": 0, "today": 0, "last_date": ""}

def save_visitors_data(data):
    with open(VISITORS_FILE, 'w') as f:
        json.dump(data, f)

# --- ROUTES ---

@app.route('/', methods=['GET'])
def index():
    return "<h1>✈️ Backend Viaje Mais Tour - ONLINE e RODANDO! 🚀</h1><p>Acesse o site em: <a href='http://localhost:5173'>http://localhost:5173</a> (ou porta similar)</p>"

@app.route('/api/consult', methods=['POST'])
def consult_ai():
    data = request.json
    destination_type = data.get('destinationType')
    companion = data.get('companion')
    budget = data.get('budget')

    prompt = f"""
    Atue como uma Consultora de Viagens especialista da "Viaje Mais Tour".
    A cliente busca uma viagem do tipo: {destination_type}.
    Companhia: {companion}.
    Orçamento: {budget}.
    
    Recomende 3 destinos ou pacotes específicos (Nacionais ou Internacionais) que se encaixem perfeitamente.
    Para cada um, explique brevemente o porquê.
    Termine com uma frase convidando para orçar no WhatsApp.
    
    Retorne a resposta em formato JSON com a seguinte estrutura:
    {{
        "message": "Texto introdutório e acolhedor...",
        "products": ["Destino 1", "Destino 2", "Destino 3"]
    }}
    Mas espere, o frontend espera um JSON com 'message' e 'products'.
    Portanto, configure o modelo para retornar JSON ou faça o parse você mesmo.
    ATENÇÃO: O meu frontend espera apenas um JSON com {{"message": "texto completo ja formatado com as sugestões"}}. 
    Espere, vou ajustar o frontend para exibir melhor ou ajustar aqui.
    
    Vamos manter simples pro frontend atual:
    Retorne um texto corrido (markdown leve) no campo 'message' e uma lista de nomes curtos no campo 'products'.
    """
    
    prompt = f"""
    Atue como uma Consultora de Viagens Sênior da "Viaje Mais Tour".
    Dados do cliente:
    - Estilo de Viagem: {destination_type}
    - Companhia: {companion}
    - Orçamento: {budget}

    Tarefa:
    1. Crie uma mensagem personalizada, empolgante e vendedora sugerindo 3 destinos perfeitos para esse perfil. Explique o porquê de cada um.
    2. Liste os nomes desses 3 destinos/pacotes de forma resumida.

    Saída OBRIGATÓRIA em JSON:
    {{
        "message": "Texto completo da consultoria aqui (pode usar quebras de linha)",
        "products": ["Nome Destino 1", "Nome Destino 2", "Nome Destino 3"]
    }}
    """

    if HAS_GEMINI:
        try:
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return jsonify(json.loads(response.text))
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"recommendation": "IA offline. Por favor instale o google-genai."})

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt')
    user_image = data.get('image') # Base64 string from frontend

    if not prompt:
        return jsonify({"error": "Prompt required"}), 400
    
    final_prompt = prompt

    # 1. Image Analysis (if uploaded)
    if user_image and HAS_GEMINI:
        try:
            # print("🕵️‍♀️ Analyzing user photo...")
            # Clean base64 if needed
            if "base64," in user_image:
                user_image = user_image.split("base64,")[1]
            
            image_bytes = base64.b64decode(user_image)
            
            # Use Gemini Vision for Analysis
            analysis_prompt = "Analyze this image and describe the key travel-related elements: landscape type (beach, mountain, city), mood, weather, colors, and architectural style. Output a concise comma separated list."
            
            response = client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=[
                    types.Part.from_text(text=analysis_prompt),
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
                ]
            )
            
            if response.text:
                description = response.text.strip()
                final_prompt = f"travel photography of {prompt}, featuring a person ({description}), famous landmark background, 8k, cinematic lighting, wanderlust vibe"
            else:
                final_prompt = f"travel photography of {prompt}, cinematic, 8k, national geographic style, wanderlust"

        except Exception as e:
            # print(f"⚠️ Vision analysis failed: {e}")
            pass

    # 2. Try Gemini Image Generation First
    if HAS_GEMINI:
        try:
            # print(f"🎨 Generating Image with Prompt: {final_prompt}")
            response = client.models.generate_images(
                model='imagen-3.0-generate-001',
                prompt=final_prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="1:1"
                )
            )
            if response.generated_images:
                image = response.generated_images[0]
                # Convert bytes to base64 for frontend
                b64_image = base64.b64encode(image.image.image_bytes).decode('utf-8')
                return jsonify({"image": f"data:image/jpeg;base64,{b64_image}"})
        except Exception as e:
            # print(f"⚠️ Gemini Image Gen failed: {e}")
            pass

    # 3. Fallback to Pollinations
    try:
        # print("⚠️ Falling back to Pollinations...")
        encoded_prompt = urllib.parse.quote(final_prompt + ", realistic, 8k")
        seed = random.randint(1, 999999)
        # Using model=flux for better quality/less restrictions
        pollinations_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=800&nologo=true&seed={seed}&model=flux"
        return jsonify({"image": pollinations_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/generate-post', methods=['POST'])
def generate_post():
    try:
        updated_env = os.environ.copy()
        updated_env["GEMINI_API_KEY"] = GEMINI_API_KEY 
        
        data = request.get_json(silent=True) or {}
        topic = data.get('topic')
        
        cmd = [sys.executable, os.path.join(SCRIPT_DIR, "create_pro_post.py"), "--full-json"]
        if topic:
            cmd.extend(["--topic", topic])
            
        result = subprocess.run(
            cmd, 
            capture_output=True, 
            text=True,
            env=updated_env,
            encoding='utf-8'
        )
        
        if result.returncode != 0:
            return jsonify({"error": "Script failed", "details": result.stderr}), 500
            
        try:
            post_data = json.loads(result.stdout)
            return jsonify(post_data)
        except json.JSONDecodeError:
             return jsonify({"error": "Invalid JSON from script", "output": result.stdout}), 500

    except Exception as e:
        import traceback
        traceback.print_exc() # Print full error to console
        return jsonify({"error": str(e)}), 500

@app.route('/api/publish-post', methods=['POST'])
def publish_post():
    data = request.json
    if not data:
        return jsonify({"error": "No data"}), 400

    try:
        image_url = data.get('image', '')
        local_image_path = image_url
        
        if image_url.startswith('http'):
            filename = f"post-{int(time.time())}.jpg"
            save_dir = os.path.join(SCRIPT_DIR, "../public/assets/blog")
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            
            response = requests.get(image_url)
            if response.status_code == 200:
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                local_image_path = f"/assets/blog/{filename}"
        
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        import re 
        match = re.search(r"export const BLOG_POSTS.*=\s*\[", content)
        
        if match:
            insert_pos = match.end()
            safe_title = data['title'].replace('"', '\\"')
            safe_excerpt = data['excerpt'].replace("\n", " ").replace('"', '\\"')
            
            new_entry = f"""
    {{
        id: {data['id']},
        title: "{safe_title}",
        excerpt: "{safe_excerpt}",
        date: "{data['date']}",
        author: "{data['author']}",
        category: "{data['category']}",
        image: "{local_image_path}",
        content: `
{data['content']}
        `
    }},"""
            new_content = content[:insert_pos] + new_entry + content[insert_pos:]
            
            with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
                
            return jsonify({"success": True, "image": local_image_path})
        else:
             return jsonify({"error": "Structure not found in blogData.ts"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete-post', methods=['POST'])
def delete_post_route():
    data = request.json
    post_id = data.get('id')
    
    if not post_id:
        return jsonify({"error": "ID required"}), 400

    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            
        import re
        pattern = re.compile(r'\{\s*id:\s*' + str(post_id) + r',.*?\},\s*', re.DOTALL)
        new_content = pattern.sub('', content)
        
        pattern2 = re.compile(r'\{\s*id:\s*' + str(post_id) + r',.*?\}', re.DOTALL)
        if len(new_content) == len(content):
             new_content = pattern2.sub('', content)

        if len(new_content) != len(content):
            with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Post not found"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-insta', methods=['POST'])
def generate_insta_route():
    data = request.json
    topic = data.get('topic')
    image_only = data.get('imageOnly', False)
    
    try:
        updated_env = os.environ.copy()
        updated_env["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        cmd = [sys.executable, os.path.join(SCRIPT_DIR, "create_insta_post.py")]
        if topic:
            cmd.extend(["--topic", topic])
        if image_only:
            cmd.append("--image-only")
            
        result = subprocess.run(
            cmd, 
            capture_output=True, 
            text=True,
            env=updated_env,
            encoding='utf-8'
        )
        
        if result.returncode != 0:
            return jsonify({"error": "Script failed", "details": result.stderr}), 500
            
        return jsonify(json.loads(result.stdout))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate-zap', methods=['POST'])
def generate_zap_route():
    data = request.json
    topic = data.get('topic', 'Promoção Relâmpago')
    
    if not HAS_GEMINI:
         return jsonify({"error": "Gemini not configured"}), 500

    try:
        # Prompt for 3 variations
        prompt = f"""
        Atue como uma Copywriter Especialista em Marketing para Agência de Viagens.
        A agência é "Viaje Mais Tour" (Especialista em Pacotes e Experiências Incríveis).
        
        Objetivo: Criar 3 opções de textos curtos e altamente persuasivos para enviar em listas de transmissão ou grupos de clientes.
        Tópico da Campanha: "{topic}"
        
        Gere 3 variações distintas:
        1. 🚨 URGÊNCIA (Foco em "Últimas vagas", "Promoção Relâmpago", "Só hoje")
        2. ✈️ SONHO (Foco em experiência, realizar sonhos, paraíso, descanso)
        3. 💸 OPORTUNIDADE (Foco em preço baixo, pacote completo, custo-benefício)

        Formatação obrigatória:
        - Use MUITOS emojis de viagem (avião, mundo, praia, mala).
        - Quebre linhas para facilitar a leitura.
        - No FINAL de cada mensagem, inclua TODOS esses links em linhas separadas:
          📲 WhatsApp: https://wa.me/5534998168772
          🌐 Site: https://viajemaistour.com/
          📸 Instagram: @viajemais_tour
        - Retorne APENAS um JSON com o array de strings: ["texto1", "texto2", "texto3"].
        """
        
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=prompt,
            config=types.GenerateContentConfig(
                 response_mime_type="application/json"
            )
        )
        
        if response.text:
             return jsonify(json.loads(response.text))
        else:
             return jsonify(["Erro ao gerar textos.", "Tente novamente.", "Erro."])

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- VISITOR ROUTES ---
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        products_path = os.path.join(SCRIPT_DIR, "products.json")
        if os.path.exists(products_path):
            with open(products_path, 'r', encoding='utf-8') as f:
                products = json.load(f)
            return jsonify(products)
        return jsonify([])
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    data = get_visitors_data()
    return jsonify(data)

@app.route('/api/visitors/increment', methods=['POST'])
def increment_visitors():
    data = get_visitors_data()
    
    today_str = datetime.date.today().isoformat()
    
    if data['last_date'] != today_str:
        data['today'] = 0
        data['last_date'] = today_str
        
    data['today'] += 1
    data['total'] += 1
    
    save_visitors_data(data)
    return jsonify(data)

# --- BLOG AUTOMATION ROUTES ---

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
            print(f"Scraper Error: {e}")
    
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
            print(f"Rewriter Error: {e}")
    
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

@app.route('/api/rewriter/post/<int:post_id>', methods=['PUT'])
def update_rewritten_post(post_id):
    """Update a specific rewritten post"""
    try:
        data = request.json
        
        # Load all posts
        posts_dir = 'rewritten_content'
        if not os.path.exists(posts_dir):
            return jsonify({'error': 'Pasta não encontrada'}), 404
            
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
    """Enhance post with AI images, publish to blogData.ts, and remove from library"""
    try:
        posts_dir = os.path.join(SCRIPT_DIR, 'rewritten_content')
        if not os.path.exists(posts_dir):
            return jsonify({'error': 'Nenhum post encontrado'}), 404
            
        all_files = [f for f in os.listdir(posts_dir) if f.endswith('.json')]
        
        post_to_publish = None
        source_filepath = None
        post_index_in_file = None
        
        for filename in all_files:
            filepath = os.path.join(posts_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                posts = json.load(f)
            
            if isinstance(posts, list) and post_id < len(posts):
                post_to_publish = posts[post_id]
                source_filepath = filepath
                post_index_in_file = post_id
                break
        
        if not post_to_publish:
            return jsonify({'error': 'Post não encontrado'}), 404
        
        # --- AI IMAGE GENERATION ---
        print(f"🎨 Generating AI images for: {post_to_publish.get('title', 'Untitled')}")
        
        cover_image_path = '/assets/blog/post-placeholder.jpg'
        content_images = []
        
        # Generate cover image with Gemini/Pollinations
        if HAS_GEMINI:
            try:
                cover_prompt = f"Professional travel blog cover image for article titled: {post_to_publish.get('title', 'Travel')}, stunning landscape photography, high quality, 16:9 aspect ratio"
                
                response = client.models.generate_images(
                    model='imagen-3.0-generate-001',
                    prompt=cover_prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        aspect_ratio="16:9"
                    )
                )
                
                if response.generated_images:
                    filename = f"ai-cover-{int(time.time())}-{random.randint(1000,9999)}.jpg"
                    save_dir = os.path.join(SCRIPT_DIR, "../public/assets/blog")
                    os.makedirs(save_dir, exist_ok=True)
                    filepath = os.path.join(save_dir, filename)
                    
                    with open(filepath, 'wb') as f:
                        f.write(response.generated_images[0].image.image_bytes)
                    
                    cover_image_path = f"/assets/blog/{filename}"
                    print(f"✅ Generated cover: {cover_image_path}")
                    
            except Exception as e:
                print(f"⚠️ Cover image generation failed: {e}")
        
        # Generate 2 content images
        if HAS_GEMINI:
            sections = ['beautiful destination scenery', 'local cuisine and culture']
            for i, section_theme in enumerate(sections):
                try:
                    content_prompt = f"Travel photography of {section_theme} for {post_to_publish.get('title', 'Travel')}, professional quality, vivid colors"
                    
                    response = client.models.generate_images(
                        model='imagen-3.0-generate-001',
                        prompt=content_prompt,
                        config=types.GenerateImagesConfig(
                            number_of_images=1,
                            aspect_ratio="16:9"
                        )
                    )
                    
                    if response.generated_images:
                        filename = f"ai-content-{int(time.time())}-{random.randint(1000,9999)}.jpg"
                        filepath = os.path.join(save_dir, filename)
                        
                        with open(filepath, 'wb') as f:
                            f.write(response.generated_images[0].image.image_bytes)
                        
                        content_images.append(f"/assets/blog/{filename}")
                        print(f"✅ Generated content image {i+1}: {content_images[-1]}")
                        
                except Exception as e:
                    print(f"⚠️ Content image {i+1} generation failed: {e}")
        
        # --- BUILD ENHANCED CONTENT ---
        # Convert markdown to HTML if the content appears to be markdown
        raw_content = post_to_publish.get('content', '')
        
        try:
            import markdown
            # Check if content looks like markdown (has ## headers or no HTML tags)
            if '##' in raw_content or '<h' not in raw_content.lower():
                md = markdown.Markdown(extensions=['extra', 'nl2br'])
                post_content = md.convert(raw_content)
                print("✅ Converted Markdown to HTML")
            else:
                post_content = raw_content
        except Exception as e:
            print(f"⚠️ Markdown conversion failed: {e}")
            post_content = raw_content
        
        # Inject content images into the HTML if we have any
        if content_images:
            # Find good insertion points (after first h2 and second h2)
            import re
            h2_matches = list(re.finditer(r'</h2>', post_content))
            
            for i, img_path in enumerate(content_images[:len(h2_matches)]):
                if i < len(h2_matches):
                    insert_pos = h2_matches[i].end()
                    img_html = f'''
            <div class="my-8">
                <img src="{img_path}" alt="Imagem ilustrativa" class="w-full rounded-xl shadow-lg object-cover max-h-[500px]" />
            </div>
'''
                    post_content = post_content[:insert_pos] + img_html + post_content[insert_pos:]
                    # Recalculate positions after insertion
                    h2_matches = list(re.finditer(r'</h2>', post_content))
        
        # --- INSERT INTO BLOGDATA.TS ---
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            blog_content = f.read()

        import re 
        match = re.search(r"export const BLOG_POSTS.*=\s*\[", blog_content)
        
        if match:
            insert_pos = match.end()
            safe_title = post_to_publish['title'].replace('"', '\\"')
            safe_excerpt = post_to_publish.get('excerpt', post_to_publish.get('meta_description', '')).replace("\n", " ").replace('"', '\\"')
            
            new_entry = f"""
    {{
        id: {int(datetime.datetime.now().timestamp())},
        title: "{safe_title}",
        excerpt: "{safe_excerpt}",
        date: "{datetime.datetime.now().strftime('%d %b, %Y')}",
        author: "Equipe Viaje Mais",
        category: "{post_to_publish.get('category', 'Dicas')}",
        image: "{cover_image_path}",
        content: `
{post_content}
        `
    }},"""
            new_blog_content = blog_content[:insert_pos] + new_entry + blog_content[insert_pos:]
            
            with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(new_blog_content)
            
            print(f"✅ Published to blogData.ts")
        else:
            return jsonify({"error": "Structure not found in blogData.ts"}), 500
        
        # --- REMOVE FROM LIBRARY ---
        try:
            with open(source_filepath, 'r', encoding='utf-8') as f:
                library_posts = json.load(f)
            
            if isinstance(library_posts, list) and post_index_in_file < len(library_posts):
                del library_posts[post_index_in_file]
                
                with open(source_filepath, 'w', encoding='utf-8') as f:
                    json.dump(library_posts, f, ensure_ascii=False, indent=2)
                
                print(f"✅ Removed from library: {source_filepath}")
        except Exception as e:
            print(f"⚠️ Failed to remove from library: {e}")
        
        return jsonify({
            'success': True, 
            'message': 'Post publicado com sucesso!',
            'cover_image': cover_image_path,
            'content_images_count': len(content_images)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Stats
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall stats"""
    stats = {
        'scraped': 0,
        'rewritten': 0,
        'scheduled': 0
    }
    
    try:
        # Count scraped safely
        if os.path.exists(os.path.join(SCRIPT_DIR, 'scraped_content')):
            try:
                for filename in os.listdir(os.path.join(SCRIPT_DIR, 'scraped_content')):
                    if filename.endswith('.json'):
                        try:
                            with open(os.path.join(SCRIPT_DIR, 'scraped_content', filename), 'r', encoding='utf-8') as f:
                                posts = json.load(f)
                                stats['scraped'] += len(posts)
                        except:
                            pass # Ignore individual file errors
            except:
                pass # Ignore directory errors

        # Count rewritten safely
        if os.path.exists(os.path.join(SCRIPT_DIR, 'rewritten_content')):
            try:
                for filename in os.listdir(os.path.join(SCRIPT_DIR, 'rewritten_content')):
                    if filename.endswith('.json'):
                        try:
                            with open(os.path.join(SCRIPT_DIR, 'rewritten_content', filename), 'r', encoding='utf-8') as f:
                                posts = json.load(f)
                                stats['rewritten'] += len(posts) if isinstance(posts, list) else 1
                        except:
                            pass
            except:
                pass

        # Count scheduled safely
        if os.path.exists(os.path.join(SCRIPT_DIR, 'editorial_calendar.json')):
            try:
                with open(os.path.join(SCRIPT_DIR, 'editorial_calendar.json'), 'r', encoding='utf-8') as f:
                    calendar = json.load(f)
                    stats['scheduled'] = len(calendar)
            except:
                pass
        
        return jsonify(stats)
    except Exception as e:
        print(f"Stats Error: {e}")
        # Return partial stats instead of 500
        return jsonify(stats)

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


@app.route('/api/update-blog-images', methods=['POST'])
def update_blog_images():
    print("Received request at /api/update-blog-images")
    data = request.json
    if not data:
        return jsonify({"error": "No data"}), 400

    post_id = data.get("postId")
    # Frontend sends coverImage and contentImages directly, NOT nested in 'updates'
    cover_image = data.get("coverImage")
    content_images = data.get("contentImages", {})
    
    # Helper to save base64
    def log_debug(msg):
        with open("server_debug.txt", "a", encoding="utf-8") as f:
            f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {msg}\n")
        print(msg)

    def save_base64_image(data_url):
        if not data_url or not isinstance(data_url, str):
            log_debug("DEBUG: Image data is not string or empty")
            return data_url
            
        if not data_url.startswith('data:image'):
             log_debug(f"DEBUG: Image data does not start with data:image (First 50 chars: {data_url[:50]})")
             return data_url
        
        try:
            log_debug(f"Processing Base64 image (Length: {len(data_url)})...")
            header, encoded = data_url.split(",", 1)
            # Default to jpg if extension not found
            ext = 'jpg'
            if 'image/' in header:
                ext = header.split(';')[0].split('/')[1]
            if ext == 'jpeg': ext = 'jpg'
            
            filename = f"upload-{int(time.time())}-{random.randint(1000,9999)}.{ext}"
            save_dir = os.path.join(SCRIPT_DIR, "../public/assets/blog")
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            
            import base64
            with open(filepath, "wb") as f:
                f.write(base64.b64decode(encoded))
            
            log_debug(f"Saved image to {filepath}")
            return f"/assets/blog/{filename}"
        except Exception as e:
            log_debug(f"Error saving base64: {e}")
            import traceback
            traceback.print_exc()
            return data_url

    # Process updates to handle Base64 -> File
    try:
        updated_updates = {}
        
        if cover_image:
            log_debug("DEBUG: Processing coverImage...")
            updated_updates["coverImage"] = save_base64_image(cover_image)
            
        if content_images:
            log_debug("DEBUG: Processing contentImages...")
            new_content_images = {}
            for old_src, new_src in content_images.items():
                log_debug(f"DEBUG: Processing content image {old_src}...")
                new_content_images[old_src] = save_base64_image(new_src)
            updated_updates["contentImages"] = new_content_images
        
        log_debug(f"DEBUG: Final Updates to be sent to script: {json.dumps(updated_updates, indent=2)}")
            
    except Exception as e:
        log_debug(f"Error processing images: {e}")
        return jsonify({"error": f"Error processing images: {str(e)}"}), 500
    
    # Write updates to a temp file to avoid CLI length limits
    import tempfile
    
    try:
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as tmp:
            json.dump(updated_updates, tmp)
            tmp_path = tmp.name
            
        print(f"Updating images for Post ID: {post_id}")
        
        # Call the script
        script_path = os.path.join(SCRIPT_DIR, "update_blog_images.py")
        
        # New signature: python script.py <post_id> <temp_file_path>
        result = subprocess.run(
            [sys.executable, script_path, str(post_id), tmp_path],
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        # Clean up temp file
        try:
            os.remove(tmp_path)
        except:
            pass
            
        if result.returncode != 0:
            print(f"Script Error: {result.stderr}")
            return jsonify({"error": "Script failed", "details": result.stderr}), 500
            
        print(f"Script Output: {result.stdout}")
        
        # Try to parse script output if it returns JSON
        try:
            return jsonify(json.loads(result.stdout))
        except:
            return jsonify({"success": True, "message": "Images updated", "output": result.stdout})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file:
            # Clean filename
            import werkzeug.utils
            safe_filename = werkzeug.utils.secure_filename(file.filename)
            
            # Generate unique name
            filename = f"upload-{int(time.time())}-{random.randint(1000,9999)}-{safe_filename}"
            
            # Save to assets/blog
            save_dir = os.path.join(SCRIPT_DIR, "../public/assets/blog")
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            
            file.save(filepath)
            print(f"File uploaded successfully: {filepath}")
            
            return jsonify({"url": f"/assets/blog/{filename}"})
            
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Force log creation on startup
    try:
        debug_path = os.path.join(os.getcwd(), "server_debug.txt")
        with open(debug_path, "a", encoding="utf-8") as f:
            f.write(f"\n[{time.strftime('%Y-%m-%d %H:%M:%S')}] SERVER STARTED. CWD: {os.getcwd()}\n")
    except Exception as e:
        print(f"Failed to write startup log: {e}")

    # Get port from environment variable (EasyPanel/Docker) or use 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
