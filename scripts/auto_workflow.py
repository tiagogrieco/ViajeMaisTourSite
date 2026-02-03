"""
Workflow Completo Automatizado - Execução com configurações pré-definidas
Gera 40 posts (20 de cada site) com calendário de 3 posts/semana
"""

import os
import sys
from blog_scraper import BlogScraper
from ai_rewriter import AIRewriter
from content_manager import ContentManager

def print_banner(text):
    print("\n" + "="*80)
    print(text.center(80))
    print("="*80 + "\n")

def main():
    print_banner("🚀 WORKFLOW AUTOMÁTICO - VIAJE MAIS TOUR")
    
    print("⚙️  CONFIGURAÇÕES:")
    print("   • Posts por site: 20")
    print("   • Posts por semana: 3 (Seg, Qua, Sex)")
    print("   • Horário: 10:00")
    print("   • Estilo: Informativo e Engajador")
    print("   • Duração: ~13 semanas (3+ meses)\n")
    
    # Verifica API Key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ ERRO: API Key não configurada!")
        print("Execute: set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw\n")
        return
    
    print(f"✅ API Key: {api_key[:10]}...{api_key[-5:]}\n")
    
    # PASSO 1: SCRAPING
    print("─"*80)
    print("PASSO 1/4: SCRAPING DE BLOGS")
    print("─"*80 + "\n")
    
    scraper = BlogScraper(output_dir="scraped_content")
    all_posts = scraper.scrape_all(max_posts_per_source=20)
    
    if not all_posts:
        print("❌ Nenhum post extraído. Abortando...\n")
        return
    
    print(f"\n✅ {len(all_posts)} posts extraídos!")
    
    # PASSO 2: REESCRITA COM IA
    print("\n" + "─"*80)
    print("PASSO 2/4: REESCRITA COM IA (GEMINI)")
    print("─"*80 + "\n")
    
    print(f"⏳ Reescrevendo {len(all_posts)} posts...")
    print("   Isso pode levar 15-20 minutos...\n")
    
    rewriter = AIRewriter()
    rewritten_posts = rewriter.rewrite_batch(
        all_posts,
        style="informativo_engajador",
        delay=3  # 3 segundos entre posts para não sobrecarregar API
    )
    
    if not rewritten_posts:
        print("❌ Erro na reescrita. Abortando...\n")
        return
    
    # Salva
    output_file = rewriter.save_rewritten_posts(rewritten_posts, output_dir="rewritten_content")
    
    # PASSO 3: CALENDÁRIO EDITORIAL
    print("\n" + "─"*80)
    print("PASSO 3/4: CRIAÇÃO DO CALENDÁRIO EDITORIAL")
    print("─"*80 + "\n")
    
    manager = ContentManager(rewritten_dir="rewritten_content")
    manager.posts = rewritten_posts
    
    calendar = manager.create_publishing_schedule(
        start_date=None,  # Próxima segunda
        posts_per_week=3,
        posting_days=[0, 2, 4],  # Seg, Qua, Sex
        posting_time="10:00"
    )
    
    manager.save_calendar("editorial_calendar.json")
    
    # PASSO 4: EXPORTAÇÃO
    print("\n" + "─"*80)
    print("PASSO 4/4: EXPORTAÇÃO PARA O BLOG")
    print("─"*80 + "\n")
    
    manager.export_to_blogdata("generated_blog_posts.ts")
    
    # RESUMO FINAL
    print_banner("✅ WORKFLOW CONCLUÍDO COM SUCESSO!")
    
    print("📊 RESUMO FINAL:")
    print(f"   • Posts extraídos: {len(all_posts)}")
    print(f"   • Posts reescritos: {len(rewritten_posts)}")
    print(f"   • Posts agendados: {len(calendar)}")
    print(f"   • Período: {calendar[0]['scheduled_date']} até {calendar[-1]['scheduled_date']}")
    print(f"   • Frequência: 3 posts/semana (Seg, Qua, Sex às 10h)")
    
    # Calcula semanas
    weeks = len(calendar) // 3 + (1 if len(calendar) % 3 else 0)
    print(f"   • Duração total: ~{weeks} semanas ({weeks//4} meses)\n")
    
    print("📁 ARQUIVOS GERADOS:")
    print("   ✅ scraped_content/ - Posts originais")
    print("   ✅ rewritten_content/ - Posts reescritos")
    print("   ✅ editorial_calendar.json - Calendário completo")
    print("   ✅ editorial_calendar_summary.txt - Resumo visual")
    print("   ✅ generated_blog_posts.ts - PRONTO PARA IMPORTAR!\n")
    
    print("🚀 PRÓXIMOS PASSOS:")
    print("   1. Importe 'generated_blog_posts.ts' no blogData.ts")
    print("   2. Confira o calendário: editorial_calendar_summary.txt")
    print("   3. Os posts serão publicados automaticamente conforme agendado!")
    
    print("\n" + "="*80)
    
    # Mostra próximos 5 posts
    print("\n📅 PRÓXIMOS 5 POSTS AGENDADOS:")
    print("─"*80 + "\n")
    
    for i, post in enumerate(calendar[:5], 1):
        print(f"{i}. {post['scheduled_datetime']}")
        print(f"   📝 {post['title']}")
        print(f"   🔗 /{post['slug']}")
        print()
    
    print("="*80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Workflow interrompido pelo usuário")
    except Exception as e:
        print(f"\n\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
