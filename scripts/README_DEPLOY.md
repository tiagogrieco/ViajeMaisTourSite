# Scripts de Deploy - EasyPanel

Este diretório contém os arquivos para deploy no EasyPanel:

## 📁 Arquivos Necessários

### Para Deploy:
- ✅ `Dockerfile` - Container configuration
- ✅ `requirements.txt` - Python dependencies
- ✅ `.dockerignore` - Files to exclude from build
- ✅ `server.py` - Main application
- ✅ `blog_scraper.py` - Blog scraper
- ✅ `ai_rewriter.py` - AI rewriter
- ✅ `content_manager.py` - Content manager
- ✅ `create_post.py` - Post generator
- ✅ `create_insta_post.py` - Instagram post generator
- ✅ `visitors.json` - Visitor tracking

### Guia:
📄 Ver: `DEPLOY_EASYPANEL.md` (nos artifacts)

## 🚀 Deploy Rápido

1. Faça upload destes arquivos no EasyPanel
2. Configure variável: `GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw`
3. Clique em "Deploy"
4. Aguarde ~5min
5. ✅ Pronto!

## 🌐 URL Final

Após deploy:
```
https://server-blog-automation.easypanel.app
```

Configure domínio:
```
https://api.viajemaistour.com
```

## 📝 Notas

- Porta: 5000
- Debug: OFF (production)
- SSL: Automático
- Restart: Sempre
