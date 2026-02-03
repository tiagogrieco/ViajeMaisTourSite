# 🤖 Sistema de Automação de Blog - Viaje Mais Tour

Sistema completo para extrair, reescrever com IA e agendar publicações de blog, mantendo SEO otimizado e conteúdo 100% único.

## 📋 O que o sistema faz?

1. **Scraping Inteligente**: Extrai posts dos principais blogs de viagem do Brasil
   - Melhores Destinos
   - Passagens Imperdíveis
   
2. **Reescrita com IA**: Usa Google Gemini para criar conteúdo único
   - 100% original (não é cópia)
   - Mantém SEO otimizado
   - Múltiplos estilos de escrita
   - Adiciona valor ao conteúdo original

3. **Calendário Editorial**: Organiza publicações automaticamente
   - Agenda posts de forma inteligente
   - Distribui temas variados
   - Gera formato pronto para o blog

## 🚀 Instalação Rápida

### 1. Instalar Dependências

```bash
cd scripts
pip install -r requirements_blog.txt
```

### 2. Configurar API Key do Gemini

**Windows:**
```bash
set GEMINI_API_KEY=sua_chave_aqui
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY=sua_chave_aqui
```

> 💡 **Como obter sua API Key:**
> 1. Acesse: https://makersuite.google.com/app/apikey
> 2. Faça login com sua conta Google
> 3. Clique em "Create API Key"
> 4. Copie a chave gerada

## 🎯 Uso Simples - Workflow Completo

Execute tudo com um único comando:

```bash
python run_complete_workflow.py
```

O script irá:
1. Perguntar quantos posts extrair (recomendado: 15-20 por site)
2. Perguntar quantos posts publicar por semana (recomendado: 3)
3. Perguntar o estilo de escrita desejado
4. Executar todo o processo automaticamente

### Estilos de Escrita Disponíveis

1. **Informativo e Engajador** (Recomendado)
   - Tom profissional mas conversacional
   - Envolve o leitor com perguntas retóricas
   - Mantém credibilidade

2. **Storytelling**
   - Narrativo e envolvente
   - Usa histórias e experiências
   - Conexão emocional

3. **Prático e Direto**
   - Objetivo e acionável
   - Listas e informações práticas
   - Sem enrolação

4. **Inspiracional**
   - Motivacional
   - Desperta desejo de viajar
   - Linguagem positiva

## 📁 Estrutura de Arquivos Gerados

Após executar o workflow, você terá:

```
scripts/
├── scraped_content/          # Posts originais extraídos
│   ├── melhoresdestinos_*.json
│   └── passagensimperdiveis_*.json
│
├── rewritten_content/        # Posts reescritos pela IA
│   └── rewritten_posts_*.json
│
├── editorial_calendar.json   # Calendário completo
├── editorial_calendar_summary.txt  # Resumo visual
└── blog_posts_generated.ts   # Pronto para importar!
```

## 📝 Como Usar os Posts Gerados

### Opção 1: Importação Automática

1. Abra `src/data/blogData.ts`

2. Importe os posts gerados:
```typescript
import { generatedBlogPosts } from './generated_blog_posts';
```

3. Adicione ao array principal:
```typescript
export const blogPosts = [
  ...existingPosts,
  ...generatedBlogPosts
];
```

### Opção 2: Revisão Manual

1. Abra `editorial_calendar_summary.txt` para ver todos os posts

2. Para cada post no calendário:
   - Revise o conteúdo
   - Faça ajustes se necessário
   - Adicione manualmente ao blogData.ts

## 🔧 Uso Avançado - Scripts Individuais

### 1. Apenas Scraping

```bash
python blog_scraper.py
```

Extrai posts e salva em `scraped_content/`

### 2. Apenas Reescrita

```python
from ai_rewriter import AIRewriter
import json

# Carrega posts scraped
with open('scraped_content/melhoresdestinos_20240118.json') as f:
    posts = json.load(f)

# Reescreve
rewriter = AIRewriter()
rewritten = rewriter.rewrite_batch(posts, style="informativo_engajador")

# Salva
rewriter.save_rewritten_posts(rewritten)
```

### 3. Apenas Calendário

```python
from content_manager import ContentManager

manager = ContentManager()
manager.load_rewritten_posts()

calendar = manager.create_publishing_schedule(
    start_date="2024-02-01",
    posts_per_week=3,
    posting_days=[1, 3, 5]  # Seg, Qua, Sex
)

manager.save_calendar()
manager.export_to_blogdata()
```

## 📊 Personalização

### Modificar Frequência de Postagem

Edite em `run_complete_workflow.py`:
```python
calendar = manager.create_publishing_schedule(
    posts_per_week=5,  # Mais posts por semana
    posting_days=[0, 1, 2, 3, 4],  # Seg a Sex
    posting_time="14:00"  # Horário diferente
)
```

### Criar Seu Próprio Estilo

Edite `ai_rewriter.py` e adicione em `style_guidelines`:
```python
"meu_estilo": """
    - Tom: [seu tom]
    - Características: [suas características]
    - Foco: [seu foco]
"""
```

### Adicionar Mais Sites para Scraping

Edite `blog_scraper.py` e crie novo método:
```python
def scrape_novo_site(self, max_posts=50):
    # Seu código de scraping aqui
    pass
```

## ⚠️ Considerações Legais e Éticas

### ✅ O que fazemos:
- Usamos conteúdo como **inspiração**
- IA reescreve **completamente** o texto
- Adicionamos **valor** e **insights** únicos
- Mantemos informações **factuais** corretas
- Citamos fontes quando apropriado

### ❌ O que NÃO fazemos:
- Copiar texto palavra por palavra
- Usar conteúdo protegido por copyright
- Plagiar ou violar direitos autorais

### 📜 Boas Práticas:
1. Sempre revise o conteúdo gerado
2. Adicione experiências pessoais
3. Atualize informações desatualizadas
4. Adicione fotos próprias quando possível
5. Cite fontes de dados específicos

## 🔍 SEO - O que é preservado

✅ **Mantido e Otimizado:**
- Palavras-chave principais
- Estrutura de tópicos (H2, H3)
- Meta descriptions únicas
- URLs amigáveis (slugs)
- Densidade de keywords
- LSI keywords (palavras relacionadas)

✅ **Melhorado:**
- Originalidade (conteúdo único)
- Qualidade do texto
- Legibilidade
- Call-to-actions
- Engajamento do usuário

## 🐛 Troubleshooting

### Erro: "API Key não configurada"
**Solução:** Configure a variável de ambiente GEMINI_API_KEY

### Erro: "Nenhum post extraído"
**Possíveis causas:**
- Conexão com internet
- Sites mudaram estrutura
- Firewall/antivírus bloqueando

**Solução:** Execute novamente ou verifique conexão

### Posts muito curtos após reescrita
**Solução:** Ajuste o prompt em `_build_rewrite_prompt()` aumentando o mínimo de palavras

### IA gerando conteúdo em inglês
**Solução:** Adicione ao prompt: "IMPORTANTE: Escreva APENAS em português do Brasil"

## 📈 Métricas e Analytics

Para acompanhar performance dos posts gerados:

1. Configure Google Analytics no site
2. Use UTM tags nos links internos
3. Monitore:
   - Taxa de cliques (CTR) no Google
   - Tempo na página
   - Taxa de rejeição
   - Palavras-chave que rankiam

## 🔄 Workflow Recomendado Semanal

**Segunda-feira:**
- Execute o scraper para coletar novos posts
- Reescreva 5-10 posts com IA

**Terça-feira:**
- Revise posts reescritos
- Faça ajustes finais
- Adicione imagens próprias

**Quarta-feira:**
- Publique primeiro post da semana
- Compartilhe nas redes sociais

**Sexta-feira:**
- Publique segundo post
- Atualize calendário

**Domingo:**
- Analise performance
- Planeje próxima semana

## 💡 Dicas Pro

1. **Varie os temas**: Não publique posts similares consecutivos
2. **Atualize dados**: Sempre verifique se preços/informações ainda são atuais
3. **Adicione CTA**: Inclua chamadas para ação (orçamento, contato)
4. **Otimize imagens**: Use ferramentas como TinyPNG antes de publicar
5. **Interno link**: Adicione links para outros posts do seu blog
6. **FAQ**: Adicione seção de perguntas frequentes
7. **Schema markup**: Considere adicionar JSON-LD para rich snippets

## 🤝 Suporte

Em caso de dúvidas ou problemas:
1. Verifique este README
2. Veja os comentários no código
3. Teste com poucos posts primeiro (2-3)
4. Documente erros específicos para análise

## 🎉 Resultado Esperado

Após configurar o sistema, você terá:

✅ Pipeline automático de conteúdo
✅ Posts SEO-otimizados
✅ Calendário editorial organizado
✅ Conteúdo 100% único e original
✅ Economia de tempo (horas → minutos)
✅ Blog sempre atualizado

---

**Made with ❤️ for Viaje Mais Tour**
