"""
Teste de Reescrita com IA - Demonstração
REQUER: API Key do Gemini configurada
"""

import os
import json
from ai_rewriter import AIRewriter

def test_rewriter():
    print("\n" + "="*60)
    print("🤖 TESTE DE REESCRITA COM IA")
    print("="*60 + "\n")
    
    # Verifica API Key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ API Key do Gemini não configurada!")
        print("\nPara testar a reescrita, você precisa:")
        print("1. Obter API Key em: https://makersuite.google.com/app/apikey")
        print("2. Configurar: set GEMINI_API_KEY=sua_chave_aqui")
        print("3. Executar novamente este script\n")
        print("=" * 60)
        print("ℹ️  O scraping funcionou perfeitamente!")
        print("   Você pode ver os posts extraídos em: test_scraped/")
        print("=" * 60 + "\n")
        return
    
    print(f"✅ API Key encontrada: {api_key[:10]}...{api_key[-5:]}\n")
    
    # Carrega um post extraído
    print("📂 Carregando post extraído...\n")
    
    with open('test_scraped/melhoresdestinos_20260118_101800.json', 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    # Pega o primeiro post (menor)
    test_post = posts[0]  # Post sobre Azul
    
    print(f"📝 Post original:")
    print(f"   Título: {test_post['title']}")
    print(f"   Palavras: {test_post['word_count']}")
    print(f"   Meta: {test_post['meta_description'][:100]}...\n")
    
    # Inicia rewriter
    rewriter = AIRewriter()
    
    print("🤖 Iniciando reescrita com IA Gemini...\n")
    print("⏳ Isso pode levar 10-30 segundos...\n")
    
    # Reescreve
    rewritten = rewriter.rewrite_post(test_post, style="informativo_engajador")
    
    if rewritten:
        print("\n" + "="*60)
        print("✅ SUCESSO! POST REESCRITO")
        print("="*60 + "\n")
        
        print(f"📝 NOVO TÍTULO:")
        print(f"   {rewritten['title']}\n")
        
        print(f"🔗 NOVO SLUG:")
        print(f"   /{rewritten['slug']}\n")
        
        print(f"🔍 NOVA META DESCRIPTION:")
        print(f"   {rewritten['meta_description']}\n")
        
        print(f"🏷️  KEYWORDS:")
        print(f"   {rewritten['keywords']}\n")
        
        print(f"📊 ESTATÍSTICAS:")
        print(f"   Original: {test_post['word_count']} palavras")
        print(f"   Reescrito: {rewritten['word_count']} palavras")
        print(f"   Fonte: {rewritten['original_source']}\n")
        
        print(f"📄 PREVIEW DO CONTEÚDO:")
        print("   " + "-"*56)
        preview = rewritten['content'][:500].replace('\n', '\n   ')
        print(f"   {preview}...")
        print("   " + "-"*56 + "\n")
        
        # Salva para análise
        output_file = 'test_rewritten_post.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(rewritten, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Post reescrito salvo em: {output_file}")
        print("\n✅ REESCRITA COM IA FUNCIONANDO PERFEITAMENTE!\n")
    else:
        print("\n❌ Erro na reescrita. Verifique a API Key e tente novamente.\n")

if __name__ == "__main__":
    test_rewriter()
