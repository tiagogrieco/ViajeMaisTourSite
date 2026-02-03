"""
Blog Scraper - Scraping de conteúdo de blogs concorrentes
Extrai posts, metadados SEO e estrutura de conteúdo
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import os
from datetime import datetime
from urllib.parse import urljoin, urlparse
import re

class BlogScraper:
    def __init__(self, output_dir="scraped_content"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
    def scrape_melhoresdestinos(self, max_posts=50):
        """Scraping de posts do Melhores Destinos"""
        print(f"🎯 Iniciando scraping do Melhores Destinos...")
        posts = []
        
        # URLs de categorias principais
        category_urls = [
            "https://www.melhoresdestinos.com.br/",
            "https://www.melhoresdestinos.com.br/noticias-milhas-e-cartoes"
        ]
        
        for category_url in category_urls:
            print(f"   Processando categoria: {category_url}")
            
            for page_num in range(1, 6):  # Primeiras 5 páginas
                if len(posts) >= max_posts:
                    break
                    
                page_url = f"{category_url}/page/{page_num}" if page_num > 1 else category_url
                
                try:
                    response = requests.get(page_url, headers=self.headers, timeout=10)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
                    # Encontra links de posts
                    post_links = soup.find_all('a', href=True)
                    article_links = [
                        link['href'] for link in post_links 
                        if link['href'].endswith('.html') and '/promocao/' not in link['href']
                    ]
                    
                    # Remove duplicados e limita
                    article_links = list(set(article_links))[:10]
                    
                    for post_url in article_links:
                        if len(posts) >= max_posts:
                            break
                            
                        post_data = self._scrape_melhoresdestinos_post(post_url)
                        if post_data:
                            posts.append(post_data)
                            print(f"   ✅ Post extraído: {post_data['title'][:50]}...")
                        
                        time.sleep(2)  # Respeita o servidor
                        
                except Exception as e:
                    print(f"   ❌ Erro na página {page_url}: {e}")
                    continue
        
        # Salva os dados
        self._save_posts(posts, "melhoresdestinos")
        return posts
    
    def _scrape_melhoresdestinos_post(self, url):
        """Extrai dados de um post específico do Melhores Destinos"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Título
            title_tag = soup.find('h1', class_='h1post')
            title = title_tag.get_text(strip=True) if title_tag else ""
            
            # Conteúdo principal
            content_div = soup.find('div', class_='corpo-artigo') or soup.find('div', id='corpo_artigo')
            content = ""
            if content_div:
                # Remove scripts e styles
                for script in content_div(["script", "style"]):
                    script.decompose()
                content = content_div.get_text(separator='\n', strip=True)
            
            # Meta tags SEO
            meta_desc = ""
            meta_keywords = ""
            
            meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_desc_tag:
                meta_desc = meta_desc_tag.get('content', '')
            
            og_desc_tag = soup.find('meta', attrs={'property': 'og:description'})
            if og_desc_tag and not meta_desc:
                meta_desc = og_desc_tag.get('content', '')
            
            meta_keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
            if meta_keywords_tag:
                meta_keywords = meta_keywords_tag.get('content', '')
            
            # Imagens
            images = []
            if content_div:
                img_tags = content_div.find_all('img')
                images = [img.get('src', '') for img in img_tags if img.get('src')]
            
            return {
                'source': 'Melhores Destinos',
                'url': url,
                'title': title,
                'content': content,
                'meta_description': meta_desc,
                'meta_keywords': meta_keywords,
                'images': images,
                'scraped_at': datetime.now().isoformat(),
                'word_count': len(content.split())
            }
            
        except Exception as e:
            print(f"   ❌ Erro ao extrair post {url}: {e}")
            return None
    
    def scrape_passagensimperdiveis(self, max_posts=50):
        """Scraping de posts do Passagens Imperdíveis"""
        print(f"🎯 Iniciando scraping do Passagens Imperdíveis...")
        posts = []
        
        base_url = "https://dicas.passagensimperdiveis.com.br"
        
        for page_num in range(1, 11):  # Primeiras 10 páginas
            if len(posts) >= max_posts:
                break
                
            page_url = f"{base_url}/page/{page_num}/" if page_num > 1 else base_url
            
            try:
                response = requests.get(page_url, headers=self.headers, timeout=10)
                response.raise_for_status()
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Encontra links de posts
                post_links = soup.find_all('a', href=True)
                article_links = [
                    link['href'] for link in post_links 
                    if '/dicas-de-viagem/' in link['href'] and link['href'].count('/') >= 5
                ]
                
                # Remove duplicados
                article_links = list(set(article_links))[:10]
                
                for post_url in article_links:
                    if len(posts) >= max_posts:
                        break
                        
                    post_data = self._scrape_passagensimperdiveis_post(post_url)
                    if post_data:
                        posts.append(post_data)
                        print(f"   ✅ Post extraído: {post_data['title'][:50]}...")
                    
                    time.sleep(2)  # Respeita o servidor
                    
            except Exception as e:
                print(f"   ❌ Erro na página {page_url}: {e}")
                continue
        
        # Salva os dados
        self._save_posts(posts, "passagensimperdiveis")
        return posts
    
    def _scrape_passagensimperdiveis_post(self, url):
        """Extrai dados de um post específico do Passagens Imperdíveis"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Título
            title_tag = soup.find('h1')
            title = title_tag.get_text(strip=True) if title_tag else ""
            
            # Conteúdo principal
            content_div = soup.find('div', class_='content_custom')
            content = ""
            if content_div:
                # Remove scripts e styles
                for script in content_div(["script", "style"]):
                    script.decompose()
                content = content_div.get_text(separator='\n', strip=True)
            
            # Meta tags SEO
            meta_desc = ""
            meta_keywords = ""
            
            meta_desc_tag = soup.find('meta', attrs={'name': 'description'})
            if meta_desc_tag:
                meta_desc = meta_desc_tag.get('content', '')
            
            og_desc_tag = soup.find('meta', attrs={'property': 'og:description'})
            if og_desc_tag and not meta_desc:
                meta_desc = og_desc_tag.get('content', '')
            
            # Categorias
            categories = []
            breadcrumb = soup.find_all(class_='breadcrumb-custom-taxonomy')
            categories = [cat.get_text(strip=True) for cat in breadcrumb]
            
            # Imagens
            images = []
            if content_div:
                img_tags = content_div.find_all('img')
                images = [img.get('src', '') for img in img_tags if img.get('src')]
            
            return {
                'source': 'Passagens Imperdíveis',
                'url': url,
                'title': title,
                'content': content,
                'meta_description': meta_desc,
                'meta_keywords': meta_keywords,
                'categories': categories,
                'images': images,
                'scraped_at': datetime.now().isoformat(),
                'word_count': len(content.split())
            }
            
        except Exception as e:
            print(f"   ❌ Erro ao extrair post {url}: {e}")
            return None
    
    def _save_posts(self, posts, source_name):
        """Salva os posts em arquivo JSON"""
        if not posts:
            print(f"   ⚠️  Nenhum post para salvar de {source_name}")
            return
            
        filename = os.path.join(
            self.output_dir, 
            f"{source_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        
        print(f"   💾 {len(posts)} posts salvos em: {filename}")
    
    def scrape_all(self, max_posts_per_source=30):
        """Scraping de todos os sites"""
        all_posts = []
        
        print("\n" + "="*60)
        print("🚀 INICIANDO SCRAPING DE BLOGS")
        print("="*60 + "\n")
        
        # Melhores Destinos
        md_posts = self.scrape_melhoresdestinos(max_posts_per_source)
        all_posts.extend(md_posts)
        
        print("\n" + "-"*60 + "\n")
        
        # Passagens Imperdíveis
        pi_posts = self.scrape_passagensimperdiveis(max_posts_per_source)
        all_posts.extend(pi_posts)
        
        print("\n" + "="*60)
        print(f"✅ SCRAPING CONCLUÍDO: {len(all_posts)} posts extraídos")
        print("="*60 + "\n")
        
        return all_posts


if __name__ == "__main__":
    scraper = BlogScraper()
    scraper.scrape_all(max_posts_per_source=20)  # 20 posts de cada site
