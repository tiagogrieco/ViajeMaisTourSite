# 🚀 Blog Content Manager - Guia Rápido

## ✅ O que foi criado:

### Backend API (Flask)
- **Arquivo**: `scripts/admin_api.py`
- **Porta**: 5001
- **Endpoints**: Scraping, AI Rewriting, Calendário, Estatísticas

### Frontend (Integrado no Admin)
- **Localização**: `/admin` (já existe!)
- **Nova seção**: "Blog Content Manager"
- **Login**: PIN `1234` (mesmo do admin existente)

---

## 🎯 Como usar:

### 1️⃣ Instalar Dependências do Backend (Uma vez só)

```bash
cd scripts
install_admin_api.bat
```

### 2️⃣ Iniciar o Backend API (Toda vez que for usar)

**Opção A - Script Automático:**
```bash
cd scripts
start_admin_api.bat
```

**Opção B - Manual:**
```bash
cd scripts
..\venv\Scripts\activate.bat
set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw
python admin_api.py
```

✅ **Você verá**: 
```
============================================================
🚀 ADMIN API SERVER - BLOG AUTOMATION
============================================================

✅ Server running on: http://localhost:5001
🔒 Password: 1234
```

### 3️⃣ Acessar o Admin

1. **Abra o site** (já deve estar rodando):
   ```
   npm run dev
   ```
   
2. **Acesse**: `http://localhost:5173/admin`

3. **Login**: PIN `1234`

4. **Role até o fim** - você verá a nova seção **"Blog Content Manager"**!

---

## 📊 Interface do Blog Content Manager:

### Cards de Status:
- 📘 **Posts Extraídos**: Quantos posts você baixou dos concorrentes
- 🎨 **Reescritos (IA)**: Quantos a IA já reescreveu
- 📅 **Agendados**: Quantos estão no calendário editorial

### 3 Passos:

#### 1. Extrair Posts 🕷️
- **Botão**: "Iniciar"
- **Faz**: Baixa posts do Melhores Destinos e Passagens Imperdíveis
- **Progresso**: Barra mostra em tempo real
- **Resultado**: Posts salvos em `scraped_content/`

#### 2. Reescrever com IA 🤖
- **Botão**: "Reescrever"
- **Faz**: Gemini reescreve TODOS os posts criando conteúdo único
- **Progresso**: Barra mostra em tempo real
- **Resultado**: Posts salvos em `rewritten_content/`

#### 3. Criar Calendário 📅
- **Botão**: "Gerar"
- **Faz**: Organiza posts em calendário de publicação (3x/semana)
- **Resultado**: 
  - `editorial_calendar.json`
  - `editorial_calendar_summary.txt`
  - `generated_blog_posts.ts` ⭐ (importar no blog!)

---

## 🎬 Workflow Completo (Exemplo):

```
1. Abrir terminal 1: npm run dev
   → Site roda em localhost:5173

2. Abrir terminal 2: start_admin_api.bat  
   → API roda em localhost:5001

3. Acessar: http://localhost:5173/admin
   → Login: 1234

4. Role até "Blog Content Manager"

5. Clicar "Iniciar" (Extrair Posts)
   → Aguardar 2-3min
   → Ver: "Posts Extraídos: 20"

6. Clicar "Reescrever" (Reescrever com IA)
   → Aguardar 10-15min  
   → Ver: "Reescritos (IA): 20"

7. Clicar "Gerar" (Criar Calendário)
   → Instantâneo
   → Ver: "Agendados: 20"

8. Pronto! Arquivo gerado: scripts/generated_blog_posts.ts
```

---

## 📁 Arquivos Importantes:

### Scripts de Inicialização:
- `scripts/install_admin_api.bat` - Instala dependências
- `scripts/start_admin_api.bat` - Inicia backend

### Backend:
- `scripts/admin_api.py` - Servidor Flask

### Frontend:
- `src/pages/Admin.tsx` - Interface (seção adicionada)

### Dados Gerados:
- `scripts/scraped_content/` - Posts originais
- `scripts/rewritten_content/` - Posts reescritos
- `scripts/editorial_calendar.json` - Calendário completo
- `scripts/generated_blog_posts.ts` - **PRONTO PARA IMPORTAR!**

---

## ⚡ Comandos Rápidos:

**Iniciar Tudo:**
```bash
# Terminal 1 (Frontend)
npm run dev

# Terminal 2 (Backend API)
cd scripts
start_admin_api.bat
```

**Parar:**
```
Ctrl + C nos dois terminais
```

---

## 🐛 Troubleshooting:

### "Erro ao carregar stats"
- ✅ Verificar se backend está rodando em `localhost:5001`
- ✅ Executar `start_admin_api.bat`

### "Botão desabilitado"
- ✅ Scraping: Sempre disponível
- ✅ Reescrever: Precisa ter posts extraídos
- ✅ Calendário: Precisa ter posts reescritos

### "API Key não configurada"
- ✅ Backend já tem a key embutida no `start_admin_api.bat`

---

## 🎉 Resultado Final:

Você terá:
- ✅ 20-40 posts únicos criados pela IA
- ✅ Calendário de 3 meses de conteúdo
- ✅ Arquivo pronto para importar no blog
- ✅ Tudo gerenciado visualmente pelo admin!

---

**Made with ❤️ - Viaje Mais Tour**
