#!/bin/bash

echo "========================================="
echo "  Deploy Automatico - Blog Server VPS"
echo "========================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Instalando dependencias do sistema...${NC}"
apt update && apt upgrade -y
apt install python3 python3-pip python3-venv nginx -y

echo -e "${GREEN}✓ Dependencias instaladas!${NC}"
echo ""

echo -e "${YELLOW}2. Criando diretorio do projeto...${NC}"
mkdir -p /var/www/blog-automation/scripts
cd /var/www/blog-automation/scripts

echo -e "${GREEN}✓ Diretorio criado!${NC}"
echo ""

echo -e "${YELLOW}3. Criando ambiente virtual...${NC}"
python3 -m venv venv
source venv/bin/activate

echo -e "${GREEN}✓ Venv criado!${NC}"
echo ""

echo -e "${YELLOW}4. Instalando dependencias Python...${NC}"
pip install Flask flask-cors requests beautifulsoup4 lxml google-genai

echo -e "${GREEN}✓ Dependencias Python instaladas!${NC}"
echo ""

echo -e "${YELLOW}5. Criando servico systemd...${NC}"
cat > /etc/systemd/system/blog-server.service << 'EOF'
[Unit]
Description=Blog Automation Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/blog-automation/scripts
Environment="GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw"
ExecStart=/var/www/blog-automation/scripts/venv/bin/python /var/www/blog-automation/scripts/server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable blog-server

echo -e "${GREEN}✓ Servico criado!${NC}"
echo ""

echo -e "${YELLOW}6. Configurando Nginx...${NC}"
cat > /etc/nginx/sites-available/blog-api << 'EOF'
server {
    listen 80;
    server_name 76.13.70.69 srv176261.hstgr.cloud;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/blog-api /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx

echo -e "${GREEN}✓ Nginx configurado!${NC}"
echo ""

echo -e "${YELLOW}7. Configurando firewall...${NC}"
ufw allow 80/tcp
ufw allow 5000/tcp
ufw --force enable

echo -e "${GREEN}✓ Firewall configurado!${NC}"
echo ""

echo "========================================="
echo -e "${GREEN}  Deploy Base Completo!${NC}"
echo "========================================="
echo ""
echo "Proximo passo:"
echo "1. Copie os arquivos para: /var/www/blog-automation/scripts/"
echo "2. Execute: systemctl start blog-server"
echo "3. Verifique: systemctl status blog-server"
echo ""
echo "Comandos uteis:"
echo "  - Ver logs: journalctl -u blog-server -f"
echo "  - Reiniciar: systemctl restart blog-server"
echo "  - Status: systemctl status blog-server"
echo ""
