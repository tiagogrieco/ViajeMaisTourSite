import os
import json
import datetime
import re
import random
import time
import sys
import requests
import urllib.parse

# --- CONFIGURATION ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
# Fallback
if not GEMINI_API_KEY:
    GEMINI_API_KEY = "AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw" 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")
PRODUCTS_PATH = os.path.join(SCRIPT_DIR, "../src/data/products.ts")
ASSETS_DIR = os.path.join(SCRIPT_DIR, "../public/assets/blog")

def get_affiliate_products():
    """Parses src/data/products.ts to find available products and links."""
    products = []
    if not os.path.exists(PRODUCTS_PATH):
        print(f"Warning: Products file not found at {PRODUCTS_PATH}", file=sys.stderr)
        return products
    
    try:
        with open(PRODUCTS_PATH, "r", encoding="utf-8") as f:
            content = f.read()
            
        objects = content.split("{")
        for obj in objects:
            if "name:" in obj and "affiliate_link:" in obj:
                name_match = re.search(r'name:\s*"(.*?)"', obj)
                link_match = re.search(r'affiliate_link:\s*"(.*?)"', obj)
                category_match = re.search(r'category:\s*"(.*?)"', obj)
                
                if name_match and link_match:
                    products.append({
                        "name": name_match.group(1),
                        "link": link_match.group(1),
                        "category": category_match.group(1) if category_match else "Geral"
                    })
    except Exception as e:
        print(f"Error parsing products: {e}", file=sys.stderr)
        
    return products

def generate_stock_image(prompt):
    """Generates an image URL using Pollinations.ai (Flux model for quality)."""
    # Wait to avoid rate limits (Anonymous tier)
    time.sleep(6) 
    
    clean_prompt = re.sub(r'[^\w\s,]', '', prompt) 
    # Enhanced prompt for realistic travel style
    final_prompt = f"editorial travel photography, {clean_prompt}, award winning, 8k, highly detailed, natural lighting, shot on 35mm"
    encoded_prompt = urllib.parse.quote(final_prompt)
    
    # Use a large random seed
    seed = random.randint(0, 999999999)
    # Using 'turbo' model for better speed and fewer rate limits
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1280&height=720&nologo=true&seed={seed}&model=turbo"
    return url

def download_image(url, filename):
    """Downloads an image from URL and saves it to local assets."""
    try:
        os.makedirs(ASSETS_DIR, exist_ok=True)
        filepath = os.path.join(ASSETS_DIR, filename)
        
        response = requests.get(url, timeout=20)
        if response.status_code == 200:
            with open(filepath, "wb") as f:
                f.write(response.content)
            return f"/assets/blog/{filename}"
    except Exception as e:
        print(f"Error downloading image: {e}", file=sys.stderr)
    
    return None

def call_gemini_api(prompt, model="gemini-2.0-flash-exp"):
    """Calls Gemini API via REST (requests) to avoid library dependency issues."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    
    headers = {'Content-Type': 'application/json'}
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseMimeType": "application/json"
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=120)
        # response.raise_for_status() # Don't raise, print error
        if response.status_code != 200:
            print(f"API Error {response.status_code}: {response.text}", file=sys.stderr)
            return None
            
        result = response.json()
        
        # Extract text from response structure
        # { "candidates": [ { "content": { "parts": [ { "text": "..." } ] } } ] }
        if 'candidates' in result and result['candidates']:
             text_content = result['candidates'][0]['content']['parts'][0]['text']
             # Clean markdown json
             text_content = text_content.replace('```json', '').replace('```', '').strip()
             return json.loads(text_content)
        else:
             print(f"No candidates in response: {result}", file=sys.stderr)
             return None
        
    except Exception as e:
        print(f"Error calling Gemini REST API: {e}", file=sys.stderr)
        return None

def generate_pro_post(topic=None):
    """Generates a full 'Pro' blog post."""
    
    products = get_affiliate_products()
    products_str = "\n".join([f"- {p['name']} (Category: {p['category']}): {p['link']}" for p in products])
    
    if not topic:
        if len(sys.argv) > 1 and sys.argv[1] != "--preview":
             topic = " ".join(sys.argv[1:])
        else:
             print("Please provide a topic.", file=sys.stderr)
             return None

    print(f"🚀 Iniciando geração PRO para: {topic}", file=sys.stderr)
    print("Isso pode levar cerca de 1 a 2 minutos. A IA está 'pensando' e estruturando o guia...", file=sys.stderr)

    prompt = f"""
    Atue como um Jornalista de Viagens Sênior da "Viaje Mais Tour".
    
    TAREFA: Escrever um "Guia Definitivo" (Mega Post) sobre: "{topic}".
    
    REQUISITOS OBRIGATÓRIOS:
    1. **Estrutura Profissional**:
       - Título H1 Incrível.
       - Introdução envolvente.
       - **Índice (Table of Contents)**: Links âncora para as seções.
       - Seções detalhadas (H2, H3).
       - FAQ no final.
    
    2. **Mídia Rica (Placeholders)**:
       - Insira placeholders: `[IMAGE: descrição detalhada]`
       - Mínimo 4 imagens.
    
    3. **Monetização (Affiliate)**:
       - Recomende organicamente:
       {products_str}
       
    4. **Formato de Saída (JSON)**:
       - Responda APENAS com um JSON.
       
    JSON SCHEMA:
    {{
        "title": "String",
        "excerpt": "String",
        "category": "String",
        "content": "HTML String"
    }}
    
    OBS: Conteúdo profundo, +1500 palavras.
    """

    return call_gemini_api(prompt)

def process_and_save_post(post_data):
    if not post_data:
        print("Nenhum dado gerado para salvar.", file=sys.stderr)
        return

    content = post_data['content']
    title_slug = re.sub(r'[^\w]', '-', post_data['title'].lower())
    
    print("\n🎨 Processando Imagens...", file=sys.stderr)
    
    # 1. Main Cover
    cover_prompt = f"travel photography, {post_data['title']}, aesthetic, 8k"
    cover_url = generate_stock_image(cover_prompt)
    cover_filename = f"blog-{title_slug}-cover.jpg"
    cover_local_path = download_image(cover_url, cover_filename)
    
    # 2. Placeholders
    placeholders = re.findall(r'\[IMAGE:(.*?)\]', content)
    
    for i, desc in enumerate(placeholders):
        print(f"Gerando imagem {i+1}/{len(placeholders)}: {desc.strip()}...", file=sys.stderr)
        img_url = generate_stock_image(desc.strip())
        img_filename = f"blog-{title_slug}-{i+1}.jpg"
        local_path = download_image(img_url, img_filename)
        
        if local_path:
            img_html = f'''
            <div class="my-8">
                <img src="{local_path}" alt="{desc.strip()}" class="w-full rounded-xl shadow-lg object-cover max-h-[500px]" />
                <p class="text-center text-gray-500 text-sm mt-2 italic">{desc.strip()}</p>
            </div>
            '''
            safe_placeholder = re.escape(f"[IMAGE:{desc}]")
            content = re.sub(safe_placeholder, img_html, content, count=1)
    
    # Add IDs to H2
    def add_id_to_h2(match):
        h2_content = match.group(1)
        slug = re.sub(r'[^\w]', '-', h2_content.lower()).strip('-')
        return f'<h2 id="{slug}">{h2_content}</h2>'
    
    content = re.sub(r'<h2>(.*?)</h2>', add_id_to_h2, content)

    # Save
    final_post = {
        "id": int(datetime.datetime.now().timestamp()),
        "title": post_data['title'],
        "excerpt": post_data['excerpt'],
        "date": datetime.datetime.now().strftime("%d %b, %Y"),
        "author": "Equipe Viaje Mais (Pro)",
        "category": post_data['category'],
        "image": cover_local_path if cover_local_path else "/assets/blog/post-placeholder.jpg",
        "content": content
    }
    
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            file_content = f.read()

        match = re.search(r"export const BLOG_POSTS.*= \[", file_content)
        if match:
            insert_pos = match.end()
            safe_content = final_post['content'].replace('`', '\\`').replace('${', '\\${')
            
            ts_object = f"""
    {{
        id: {final_post['id']},
        title: {json.dumps(final_post['title'])},
        excerpt: {json.dumps(final_post['excerpt'])},
        date: "{final_post['date']}",
        author: "{final_post['author']}",
        category: "{final_post['category']}",
        image: "{final_post['image']}",
        content: `
{safe_content}
        `
    }},"""
            
            new_file_content = file_content[:insert_pos] + ts_object + file_content[insert_pos:]
            
            with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(new_file_content)
                
            print(f"\n✅ SUCESSO! Post '{final_post['title']}' criado.", file=sys.stderr)
            return final_post
            
    except Exception as e:
        print(f"Erro ao salvar: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", action="store_true", help="Return JSON preview only")
    parser.add_argument("--full-json", action="store_true", help="Run full generation and return JSON")
    parser.add_argument("--topic", help="Topic for the blog post")
    args = parser.parse_args()
    
    topic = args.topic
    if not topic and len(sys.argv) > 1 and not sys.argv[1].startswith('--'):
         topic = " ".join(sys.argv[1:])
    
    if not topic:
        # Default topic if none provided
        topic = "Dicas de Viagem 2026"

    if args.preview:
        # Preview mode: Generate text only, return JSON, no saving
        data = generate_pro_post(topic)
        if data:
            # Construct preview object similar to final_post but without saving images
            preview_post = {
                "id": int(datetime.datetime.now().timestamp()),
                "title": data['title'],
                "excerpt": data['excerpt'],
                "date": datetime.datetime.now().strftime("%d %b, %Y"),
                "author": "Equipe Viaje Mais (Pro)",
                "category": data['category'],
                "image": "/assets/blog/post-placeholder.jpg",
                "content": data['content']
            }
            print(json.dumps(preview_post))
            
    elif args.full_json:
        # Full generation + JSON output for Backend
        data = generate_pro_post(topic)
        if data:
            final_post = process_and_save_post(data)
            if final_post:
                print(json.dumps(final_post))
    else:
        # Normal CLI mode
        if topic:
            data = generate_pro_post(topic)
            process_and_save_post(data)
        else:
            print("Usage: python create_pro_post.py [topic] [--preview | --full-json]", file=sys.stderr)

