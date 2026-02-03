"""
Teste do Scraper - Extrai apenas 2 posts de cada site para demonstração
"""

from blog_scraper import BlogScraper

def test_scraper():
    print("\n" + "="*60)
    print("🧪 TESTE DO SCRAPER - DEMO")
    print("="*60 + "\n")
    
    print("Extraindo 2 posts de cada site para teste...\n")
    
    scraper = BlogScraper(output_dir="test_scraped")
    
    # Teste com apenas 2 posts de cada
    all_posts = scraper.scrape_all(max_posts_per_source=2)
    
    print("\n" + "="*60)
    print("📊 RESULTADO DO TESTE")
    print("="*60 + "\n")
    
    if all_posts:
        print(f"✅ {len(all_posts)} posts extraídos com sucesso!\n")
        
        # Mostra resumo de cada post
        for i, post in enumerate(all_posts, 1):
            print(f"Post {i}:")
            print(f"  🌐 Fonte: {post['source']}")
            print(f"  📝 Título: {post['title'][:70]}...")
            print(f"  📊 Palavras: {post['word_count']}")
            print(f"  🔍 Meta: {post['meta_description'][:80]}...")
            print(f"  🖼️  Imagens: {len(post.get('images', []))}")
            print()
        
        print("✅ Scraping funcionando perfeitamente!")
        print(f"📁 Arquivos salvos em: test_scraped/\n")
    else:
        print("❌ Nenhum post foi extraído. Pode ser um problema de conexão.\n")

if __name__ == "__main__":
    test_scraper()
