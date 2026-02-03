"""
Content Manager - Gerenciador de conteúdo e calendário editorial
Organiza posts reescritos e cria calendário de publicação
"""

import json
import os
from datetime import datetime, timedelta
import random


class ContentManager:
    def __init__(self, rewritten_dir="rewritten_content", schedule_file="editorial_calendar.json"):
        self.rewritten_dir = rewritten_dir
        self.schedule_file = schedule_file
        self.posts = []
        self.calendar = []
        
    def load_rewritten_posts(self, filename=None):
        """Carrega posts reescritos"""
        if filename:
            filepath = filename
        else:
            # Pega o arquivo mais recente
            files = [f for f in os.listdir(self.rewritten_dir) if f.endswith('.json')]
            if not files:
                print("❌ Nenhum arquivo de posts reescritos encontrado!")
                return []
            
            files.sort(reverse=True)
            filepath = os.path.join(self.rewritten_dir, files[0])
        
        with open(filepath, 'r', encoding='utf-8') as f:
            self.posts = json.load(f)
        
        print(f"📂 {len(self.posts)} posts carregados de: {filepath}")
        return self.posts
    
    def create_publishing_schedule(self, 
                                   start_date=None,
                                   posts_per_week=3,
                                   posting_days=[1, 3, 5],  # Segunda, Quarta, Sexta
                                   posting_time="10:00"):
        """
        Cria calendário de publicação
        
        Args:
            start_date: Data de início (default: próxima segunda)
            posts_per_week: Quantidade de posts por semana
            posting_days: Dias da semana para postar (0=Segunda, 6=Domingo)
            posting_time: Horário da publicação
        """
        
        if not self.posts:
            print("❌ Carregue os posts primeiro com load_rewritten_posts()")
            return []
        
        # Define data de início
        if start_date is None:
            today = datetime.now()
            # Próxima segunda-feira
            days_ahead = 0 - today.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            start_date = today + timedelta(days=days_ahead)
        elif isinstance(start_date, str):
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
        
        print(f"\n📅 Criando calendário editorial...")
        print(f"   Data início: {start_date.strftime('%d/%m/%Y')}")
        print(f"   Posts por semana: {posts_per_week}")
        print(f"   Dias de postagem: {posting_days}")
        
        # Randomiza ordem dos posts (para variar temas)
        posts_to_schedule = self.posts.copy()
        random.shuffle(posts_to_schedule)
        
        calendar = []
        current_date = start_date
        posts_scheduled = 0
        
        while posts_scheduled < len(posts_to_schedule):
            # Verifica se é um dia de postagem
            if current_date.weekday() in posting_days:
                post = posts_to_schedule[posts_scheduled]
                
                # Cria entrada do calendário
                schedule_entry = {
                    'post_id': posts_scheduled,
                    'title': post['title'],
                    'slug': post['slug'],
                    'scheduled_date': current_date.strftime('%Y-%m-%d'),
                    'scheduled_time': posting_time,
                    'scheduled_datetime': f"{current_date.strftime('%Y-%m-%d')} {posting_time}",
                    'status': 'scheduled',
                    'meta_description': post['meta_description'],
                    'keywords': post['keywords'],
                    'content': post['content'],
                    'images': post.get('images', []),
                    'original_source': post.get('original_source', ''),
                    'week_number': posts_scheduled // posts_per_week + 1
                }
                
                calendar.append(schedule_entry)
                posts_scheduled += 1
            
            current_date += timedelta(days=1)
        
        self.calendar = calendar
        
        print(f"   ✅ {len(calendar)} posts agendados")
        print(f"   🗓️  Período: {calendar[0]['scheduled_date']} até {calendar[-1]['scheduled_date']}")
        
        # Estatísticas
        weeks = (posts_scheduled // posts_per_week) + (1 if posts_scheduled % posts_per_week else 0)
        print(f"   📊 Total de semanas: {weeks}")
        
        return calendar
    
    def save_calendar(self, filename=None):
        """Salva calendário editorial"""
        if not self.calendar:
            print("❌ Crie o calendário primeiro com create_publishing_schedule()")
            return
        
        filepath = filename or self.schedule_file
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.calendar, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Calendário salvo em: {filepath}")
        
        # Também cria versão resumida para visualização rápida
        summary_file = filepath.replace('.json', '_summary.txt')
        self._save_calendar_summary(summary_file)
    
    def _save_calendar_summary(self, filename):
        """Salva resumo do calendário em texto"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("=" * 80 + "\n")
            f.write("CALENDÁRIO EDITORIAL - VIAJE MAIS TOUR\n")
            f.write("=" * 80 + "\n\n")
            
            current_week = 0
            for entry in self.calendar:
                if entry['week_number'] != current_week:
                    current_week = entry['week_number']
                    f.write(f"\n{'─' * 80}\n")
                    f.write(f"SEMANA {current_week}\n")
                    f.write(f"{'─' * 80}\n\n")
                
                f.write(f"📅 {entry['scheduled_datetime']}\n")
                f.write(f"   📝 {entry['title']}\n")
                f.write(f"   🔗 /{entry['slug']}\n")
                f.write(f"   🔍 {entry['meta_description'][:100]}...\n")
                f.write(f"   🏷️  {entry['keywords']}\n")
                f.write("\n")
        
        print(f"   📄 Resumo salvo em: {filename}")
    
    def get_posts_by_week(self, week_number):
        """Retorna posts de uma semana específica"""
        return [post for post in self.calendar if post['week_number'] == week_number]
    
    def get_next_posts(self, count=5):
        """Retorna próximos posts agendados"""
        today = datetime.now().strftime('%Y-%m-%d')
        upcoming = [post for post in self.calendar if post['scheduled_date'] >= today]
        return upcoming[:count]
    
    def export_to_blogdata(self, output_file=None):
        """
        Exporta calendário para formato compatível com blogData.ts
        """
        if output_file is None:
            output_file = "blog_posts_ready.ts"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("// Posts gerados automaticamente - prontos para publicação\n\n")
            f.write("export const generatedBlogPosts = [\n")
            
            for i, post in enumerate(self.calendar):
                # Pega primeira imagem se disponível
                image = post['images'][0] if post['images'] else '/default-blog-image.jpg'
                
                # Extrai primeiro parágrafo para excerpt
                content_lines = post['content'].split('\n')
                excerpt = next((line for line in content_lines if len(line.strip()) > 50), '')
                excerpt = excerpt[:200] + '...' if len(excerpt) > 200 else excerpt
                
                # Prepara conteúdo escapado
                content_escaped = post['content'].replace('`', '').replace('$', '\\$')
                
                f.write("  {\n")
                f.write(f"    id: {1000 + i},\n")
                f.write(f"    title: `{post['title'].replace('`', '')}`,\n")
                f.write(f"    slug: '{post['slug']}',\n")
                f.write(f"    excerpt: `{excerpt.replace('`', '')}`,\n")
                f.write(f"    content: `{content_escaped}`,\n")
                f.write(f"    image: '{image}',\n")
                f.write(f"    date: '{post['scheduled_date']}',\n")
                f.write(f"    author: 'Equipe Viaje Mais Tour',\n")
                f.write(f"    category: 'Dicas de Viagem',\n")
                
                # Prepara tags
                tags_list = [f"'{tag.strip()}'" for tag in post['keywords'].split(',')[:5]]
                tags_str = ', '.join(tags_list)
                f.write(f"    tags: [{tags_str}],\n")
                f.write(f"    readTime: {max(3, post['content'].count(' ') // 200)},\n")
                f.write(f"    metaDescription: `{post['meta_description'].replace('`', '')}`,\n")
                f.write("  },\n")
            
            f.write("];\n")
        
        print(f"\n✅ Posts exportados para TypeScript: {output_file}")
        print(f"   Importe no blogData.ts e adicione ao array principal")


def main():
    """Workflow completo de gerenciamento de conteúdo"""
    print("\n" + "=" * 80)
    print("📊 GERENCIADOR DE CONTEÚDO - VIAJE MAIS TOUR")
    print("=" * 80 + "\n")
    
    manager = ContentManager()
    
    # 1. Carrega posts reescritos
    posts = manager.load_rewritten_posts()
    
    if not posts:
        print("\n⚠️  Nenhum post encontrado. Execute primeiro:")
        print("   1. blog_scraper.py (para baixar conteúdo)")
        print("   2. ai_rewriter.py (para reescrever)")
        return
    
    # 2. Cria calendário editorial
    calendar = manager.create_publishing_schedule(
        start_date=None,  # Próxima segunda
        posts_per_week=3,
        posting_days=[1, 3, 5],  # Seg, Qua, Sex
        posting_time="10:00"
    )
    
    # 3. Salva calendário
    manager.save_calendar("editorial_calendar.json")
    
    # 4. Exporta para formato do blog
    manager.export_to_blogdata("src/data/generated_blog_posts.ts")
    
    # 5. Mostra próximos posts
    print("\n" + "─" * 80)
    print("📅 PRÓXIMOS 5 POSTS AGENDADOS:")
    print("─" * 80 + "\n")
    
    next_posts = manager.get_next_posts(5)
    for post in next_posts:
        print(f"📅 {post['scheduled_datetime']}")
        print(f"   📝 {post['title']}")
        print(f"   🔗 /{post['slug']}")
        print()
    
    print("\n✅ Gerenciamento de conteúdo concluído!")
    print("\nPasos seguintes:")
    print("1. Revise os posts no calendário")
    print("2. Importe generated_blog_posts.ts no blogData.ts")
    print("3. Agende as publicações conforme o calendário")


if __name__ == "__main__":
    main()
