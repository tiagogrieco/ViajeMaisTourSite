# Script PowerShell para Upload Automatico ao VPS

$VPS_IP = "76.13.70.69"
$VPS_USER = "root"
$LOCAL_PATH = "G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\scripts"
$REMOTE_PATH = "/var/www/blog-automation/scripts"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Upload para VPS Hostinger" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Copiando arquivos para VPS..." -ForegroundColor Yellow

# Upload files
scp -r $LOCAL_PATH\server.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/
scp -r $LOCAL_PATH\blog_scraper.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/
scp -r $LOCAL_PATH\ai_rewriter.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/
scp -r $LOCAL_PATH\content_manager.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/
scp -r $LOCAL_PATH\create_post.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/
scp -r $LOCAL_PATH\create_insta_post.py $VPS_USER@${VPS_IP}:$REMOTE_PATH/

Write-Host ""
Write-Host "Arquivos copiados!" -ForegroundColor Green
Write-Host ""

Write-Host "Reiniciando servidor no VPS..." -ForegroundColor Yellow
ssh $VPS_USER@$VPS_IP "systemctl restart blog-server"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Deploy Concluido!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Verifique o status:"
Write-Host "  ssh root@76.13.70.69"
Write-Host "  systemctl status blog-server"
Write-Host ""
