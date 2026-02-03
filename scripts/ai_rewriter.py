"""
AI Rewriter - Sistema de reescrita de conteúdo usando Gemini AI
Reescreve posts mantendo SEO mas criando conteúdo único
"""

import google.generativeai as genai
import json
import os
from datetime import datetime
import time
import re

class AIRewriter:
    def __init__(self, api_key=None):
        """Inicializa o rewriter com a API do Gemini"""
        if api_key:
            genai.configure(api_key=api_key)
        else:
            # Tenta pegar da variável de ambiente
            api_key = os.getenv('GEMINI_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
            else:
                print("⚠️  AVISO: API Key do Gemini não configurada!")
                print("   Configure com: set GEMINI_API_KEY=sua_chave")
        
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        
    def rewrite_post(self, original_post, style="informativo_engajador"):
        """
        Reescreve um post completo mantendo SEO mas criando conteúdo único
        
        Styles disponíveis:
        - informativo_engajador: Tom informativo mas engajador
        - storytelling: Foco em narrativa e histórias
        - pratico_direto: Objetivo e prático
        - inspiracional: Tom motivacional e inspirador
        """
        
        print(f"\n🤖 Reescrevendo: {original_post['title'][:50]}...")
        
        # Prompt para reescrita
        prompt = self._build_rewrite_prompt(original_post, style)
        
        try:
            # Gera novo conteúdo
            response = self.model.generate_content(prompt)
            rewritten_content = response.text
            
            # Parse do conteúdo reescrito
            rewritten_post = self._parse_rewritten_content(rewritten_content, original_post)
            
            print(f"   ✅ Reescrito com sucesso!")
            print(f"   📊 Original: {original_post.get('word_count', 0)} palavras")
            print(f"   📊 Novo: {len(rewritten_post['content'].split())} palavras")
            
            return rewritten_post
            
        except Exception as e:
            print(f"   ❌ Erro na reescrita: {e}")
            return None
    
    def _build_rewrite_prompt(self, post, style):
        """Constrói o prompt para a IA"""
        
        style_guidelines = {
            "informativo_engajador": """
                - Tom: Informativo mas conversacional e engajador
                - Use perguntas retóricas para envolver o leitor
                - Inclua dados e informações práticas
                - Mantenha profissionalismo mas com personalidade
            """,
            "storytelling": """
                - Tom: Narrativo e envolvente
                - Conte histórias e experiências de viagem
                - Use descrições vívidas e sensoriais
                - Crie conexão emocional com o leitor
            """,
            "pratico_direto": """
                - Tom: Objetivo e prático
                - Vá direto ao ponto
                - Use listas e bullets quando apropriado
                - Foco em informações úteis e acionáveis
            """,
            "inspiracional": """
                - Tom: Motivacional e inspirador
                - Desperte o desejo de viajar
                - Use linguagem positiva e energética
                - Foque nos benefícios e experiências transformadoras
            """
        }
        
        prompt = f"""
Você é um redator especializado em conteúdo de viagens para o blog "Viaje Mais Tour".

TÍTULO ORIGINAL: {post['title']}
META DESCRIPTION ORIGINAL: {post.get('meta_description', '')}
CONTEÚDO ORIGINAL:
{post['content'][:3000]}  # Limita para não exceder tokens

INSTRUÇÕES DE REESCRITA:

1. TÍTULO:
   - Crie um novo título atraente e único
   - Mantenha o tema principal
   - Otimize para SEO (palavras-chave relevantes)
   - Máximo 60 caracteres

2. META DESCRIPTION:
   - Crie uma nova meta description única
   - Inclua call-to-action
   - Otimize para CTR
   - Entre 150-160 caracteres

3. CONTEÚDO:
   - Reescreva COMPLETAMENTE o conteúdo (NÃO copie frases inteiras)
   - Mantenha os tópicos principais e informações factuais
   - Adicione insights únicos e valor extra
   - Estruture com subtítulos (H2, H3)
   - Mínimo de {max(1000, len(post['content'].split()))} palavras
   
4. ESTILO:
{style_guidelines.get(style, style_guidelines["informativo_engajador"])}

5. SEO:
   - Mantenha palavras-chave principais do original
   - Adicione variações de palavras-chave
   - Use LSI keywords (palavras relacionadas)
   - Otimize para featured snippets

6. FORMATAÇÃO:
   Use o seguinte formato de saída:

   ---TITULO---
   [Novo título aqui]
   
   ---META_DESCRIPTION---
   [Nova meta description aqui]
   
   ---SLUG---
   [slug-url-amigavel]
   
   ---KEYWORDS---
   [palavras-chave separadas por vírgula]
   
   ---CONTENT---
   [Conteúdo completo reescrito em Markdown]
   
   ## [Primeiro Subtítulo]
   
   [Conteúdo do primeiro subtítulo...]
   
   ## [Segundo Subtítulo]
   
   [Conteúdo do segundo subtítulo...]
   
   [Continue com todo o conteúdo...]

IMPORTANTE: 
- NÃO use material protegido por direitos autorais
- Crie conteúdo 100% original e único
- Mantenha informações factuais corretas
- Adicione valor além do conteúdo original
"""
        
        return prompt
    
    def _parse_rewritten_content(self, rewritten_text, original_post):
        """Parse do conteúdo reescrito"""
        
        # Extrai cada seção
        title_match = re.search(r'---TITULO---\s*\n(.+?)\n', rewritten_text, re.DOTALL)
        meta_match = re.search(r'---META_DESCRIPTION---\s*\n(.+?)\n', rewritten_text, re.DOTALL)
        slug_match = re.search(r'---SLUG---\s*\n(.+?)\n', rewritten_text, re.DOTALL)
        keywords_match = re.search(r'---KEYWORDS---\s*\n(.+?)\n', rewritten_text, re.DOTALL)
        content_match = re.search(r'---CONTENT---\s*\n(.+)', rewritten_text, re.DOTALL)
        
        title = title_match.group(1).strip() if title_match else original_post['title']
        meta_desc = meta_match.group(1).strip() if meta_match else original_post.get('meta_description', '')
        slug = slug_match.group(1).strip() if slug_match else self._generate_slug(title)
        keywords = keywords_match.group(1).strip() if keywords_match else ''
        content = content_match.group(1).strip() if content_match else rewritten_text
        
        return {
            'title': title,
            'slug': slug,
            'meta_description': meta_desc,
            'keywords': keywords,
            'content': content,
            'original_source': original_post.get('source', 'Unknown'),
            'original_url': original_post.get('url', ''),
            'rewritten_at': datetime.now().isoformat(),
            'word_count': len(content.split()),
            'status': 'draft',
            'images': original_post.get('images', [])
        }
    
    def _generate_slug(self, title):
        """Gera slug URL-friendly a partir do título"""
        slug = title.lower()
        slug = re.sub(r'[áàâãä]', 'a', slug)
        slug = re.sub(r'[éèêë]', 'e', slug)
        slug = re.sub(r'[íìîï]', 'i', slug)
        slug = re.sub(r'[óòôõö]', 'o', slug)
        slug = re.sub(r'[úùûü]', 'u', slug)
        slug = re.sub(r'[ç]', 'c', slug)
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = slug.strip('-')
        return slug[:50]  # Limita tamanho
    
    def rewrite_batch(self, posts, style="informativo_engajador", delay=5):
        """Reescreve múltiplos posts"""
        rewritten_posts = []
        
        print(f"\n🔄 Iniciando reescrita em lote de {len(posts)} posts...")
        
        for i, post in enumerate(posts, 1):
            print(f"\n[{i}/{len(posts)}] ", end="")
            
            rewritten = self.rewrite_post(post, style)
            if rewritten:
                rewritten_posts.append(rewritten)
            
            # Delay entre requisições para não sobrecarregar a API
            if i < len(posts):
                time.sleep(delay)
        
        print(f"\n✅ Reescrita concluída: {len(rewritten_posts)}/{len(posts)} posts")
        
        return rewritten_posts
    
    def save_rewritten_posts(self, posts, output_dir="rewritten_content"):
        """Salva posts reescritos"""
        os.makedirs(output_dir, exist_ok=True)
        
        filename = os.path.join(
            output_dir,
            f"rewritten_posts_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        )
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Posts salvos em: {filename}")
        return filename


if __name__ == "__main__":
    # Exemplo de uso
    print("💡 Para usar este script:")
    print("1. Configure sua API key: set GEMINI_API_KEY=sua_chave")
    print("2. Execute: python ai_rewriter.py")
    print("\nOu use através do content_manager.py para workflow completo")
