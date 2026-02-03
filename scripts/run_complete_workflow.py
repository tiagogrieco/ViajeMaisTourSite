"""
Workflow Completo - Script principal para executar todo o processo
1. Scraping dos blogs concorrentes
2. Reescrita com IA (Gemini)
3. Organização e calendário editorial
"""

import os
import sys
import argparse
from datetime import datetime

# Ensure imports work regardless of where script is run from
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from blog_scraper import BlogScraper
from ai_rewriter import AIRewriter
from content_manager import ContentManager


def print_header(text):
    """Imprime cabeçalho formatado"""
    print("\n" + "=" * 80)
    print(text.center(80))
    print("=" * 80 + "\n")


def print_step(number, text):
    """Imprime passo do workflow"""
    print(f"\n{'─' * 80}")
    print(f"PASSO {number}: {text}")
    print(f"{'─' * 80}\n")


def check_api_key():
    """Verifica se a API key do Gemini está configurada"""
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ ERRO: API Key do Gemini não configurada!")
        print("\nConfigure com:")
        print("   Windows: set GEMINI_API_KEY=sua_chave_aqui")
        print("   Linux/Mac: export GEMINI_API_KEY=sua_chave_aqui")
        print("\nPara obter sua chave:")
        print("   1. Acesse: https://makersuite.google.com/app/apikey")
        print("   2. Crie uma nova API key")
        print("   3. Configure a variável de ambiente\n")
        return False
    
    print(f"✅ API Key configurada: {api_key[:10]}...{api_key[-5:]}")
    return True


def main():
    """Executa o workflow completo"""
    
    parser = argparse.ArgumentParser(description="Workflow de Automação de Blog")
    parser.add_argument("--headless", action="store_true", help="Executar sem interação do usuário (usando padrões)")
    parser.add_argument("--posts-per-site", type=int, default=15, help="Número de posts por site")
    parser.add_argument("--posts-per-week", type=int, default=3, help="Posts por semana")
    parser.add_argument("--style", type=str, default="informativo_engajador", help="Estilo de escrita")
    
    args = parser.parse_args()
    
    print_header("🚀 WORKFLOW COMPLETO DE CONTEÚDO - VIAJE MAIS TOUR")
    
    # Configurações
    print("⚙️  CONFIGURAÇÕES:")
    
    if args.headless:
        posts_per_site = args.posts_per_site
        posts_per_week = args.posts_per_week
        style = args.style
        proceed = 's'
        print(f"   [HEADLESS] Usando configurações padrão: {posts_per_site} posts/site, {posts_per_week} posts/semana, estilo '{style}'")
    else:
        print("Este script irá:")
        print("  1. Fazer scraping dos blogs concorrentes")
        print("  2. Reescrever o conteúdo com IA (Gemini)")
        print("  3. Criar calendário editorial")
        print("  4. Exportar posts prontos para publicação\n")
        
        posts_per_site = int(input("   Quantos posts extrair de cada site? (padrão: 15): ") or "15")
        posts_per_week = int(input("   Quantos posts publicar por semana? (padrão: 3): ") or "3")
        
        style_options = {
            "1": "informativo_engajador",
            "2": "storytelling",
            "3": "pratico_direto",
            "4": "inspiracional"
        }
        
        print("\n   Estilo de escrita:")
        print("   1. Informativo e Engajador (recomendado)")
        print("   2. Storytelling (narrativo)")
        print("   3. Prático e Direto")
        print("   4. Inspiracional")
        
        style_choice = input("   Escolha o estilo (1-4, padrão: 1): ") or "1"
        style = style_options.get(style_choice, "informativo_engajador")
        
        print(f"\n   ✅ Configurado: {posts_per_site} posts/site, {posts_per_week} posts/semana, estilo '{style}'")
        proceed = input("\n   🚀 Iniciar workflow? (S/n): ").lower()

    if proceed == 'n':
        print("❌ Cancelado pelo usuário")
        return
    
    # PASSO 1: SCRAPING
    print_step(1, "SCRAPING DE BLOGS CONCORRENTES")
    
    scraper = BlogScraper(output_dir="scraped_content")
    all_posts = scraper.scrape_all(max_posts_per_source=posts_per_site)
    
    if not all_posts:
        print("❌ Nenhum post foi extraído. Verifique a conexão e tente novamente.")
        return
    
    print(f"\n✅ {len(all_posts)} posts extraídos com sucesso!")
    
    # PASSO 2: REESCRITA COM IA
    print_step(2, "REESCRITA COM IA (GEMINI)")
    
    if not check_api_key():
        print("\n⚠️  Não é possível continuar sem a API Key do Gemini")
        return
    
    rewriter = AIRewriter()
    
    # Pergunta quantos posts reescrever (pode ser menos que o total extraído)
    max_to_rewrite = len(all_posts)
    
    if args.headless:
        num_to_rewrite = max_to_rewrite # Rewrite all in headless mode
    else:
        num_to_rewrite = int(input(f"\n   Quantos posts reescrever? (máx: {max_to_rewrite}, padrão: todos): ") or str(max_to_rewrite))
    
    num_to_rewrite = min(num_to_rewrite, max_to_rewrite)
    
    posts_to_rewrite = all_posts[:num_to_rewrite]
    
    rewritten_posts = rewriter.rewrite_batch(
        posts_to_rewrite,
        style=style,
        delay=5  # 5 segundos entre cada post
    )
    
    if not rewritten_posts:
        print("❌ Nenhum post foi reescrito. Verifique a API Key e tente novamente.")
        return
    
    # Salva posts reescritos
    output_file = rewriter.save_rewritten_posts(rewritten_posts)
    
    # PASSO 3: CALENDÁRIO EDITORIAL
    print_step(3, "CRIAÇÃO DO CALENDÁRIO EDITORIAL")
    
    manager = ContentManager(rewritten_dir="rewritten_content")
    manager.posts = rewritten_posts  # Usa posts já em memória
    
    # Pergunta data de início
    if args.headless:
        start_date = None # Next monday default
    else:
        start_date_input = input("\n   Data de início (YYYY-MM-DD, Enter para próxima segunda): ").strip()
        start_date = start_date_input if start_date_input else None
    
    # Cria calendário
    calendar = manager.create_publishing_schedule(
        start_date=start_date,
        posts_per_week=posts_per_week,
        posting_days=[1, 3, 5],  # Segunda, Quarta, Sexta
        posting_time="10:00"
    )
    
    # Salva calendário
    manager.save_calendar("editorial_calendar.json")
    
    # PASSO 4: EXPORTAÇÃO
    print_step(4, "EXPORTAÇÃO PARA O BLOG")
    
    # Always export to generated_blog_posts.ts in scripts folder
    manager.export_to_blogdata("generated_blog_posts.ts")
    
    # RESUMO FINAL
    print_header("✅ WORKFLOW CONCLUÍDO COM SUCESSO!")
    
    print("📊 RESUMO:")
    print(f"   • Posts extraídos: {len(all_posts)}")
    print(f"   • Posts reescritos: {len(rewritten_posts)}")
    print(f"   • Posts agendados: {len(calendar)}")
    print(f"   • Período: {calendar[0]['scheduled_date']} até {calendar[-1]['scheduled_date']}")
    print(f"   • Frequência: {posts_per_week} posts/semana")
    
    print("\n📁 ARQUIVOS GERADOS:")
    print(f"   • scraped_content/ - Posts originais extraídos")
    print(f"   • rewritten_content/ - Posts reescritos pela IA")
    print(f"   • editorial_calendar.json - Calendário completo")
    print(f"   • editorial_calendar_summary.txt - Resumo visual")
    print(f"   • generated_blog_posts.ts - Pronto para importar no blog")
    
    
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Workflow interrompido pelo usuário")
    except Exception as e:
        print(f"\n\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
