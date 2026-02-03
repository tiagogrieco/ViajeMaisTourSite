# Script de Atualização Rápida - EasyPanel

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Atualização Rápida - EasyPanel" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Criando novo ZIP..." -ForegroundColor Yellow

# Criar ZIP atualizado
$zipPath = "..\blog-automation-deploy.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path Dockerfile, requirements.txt, .dockerignore, server.py, blog_scraper.py, ai_rewriter.py, content_manager.py, create_post.py, create_insta_post.py, visitors.json -DestinationPath $zipPath -Force

Write-Host "  ✓ ZIP criado!" -ForegroundColor Green
Write-Host ""

Write-Host "=========================================" -ForegroundColor Green
Write-Host "  Arquivo pronto para upload!" -ForegroundColor Green  
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo: $(Resolve-Path $zipPath)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos no EasyPanel:" -ForegroundColor Yellow
Write-Host "  1. Acesse seu serviço 'docker'" -ForegroundColor White
Write-Host "  2. Vá na aba 'Upload'" -ForegroundColor White
Write-Host "  3. Arraste o novo ZIP" -ForegroundColor White
Write-Host "  4. Vá em 'Implantações' (Deployments)" -ForegroundColor White
Write-Host "  5. Clique em 'Redeploy' ou 'Deploy'" -ForegroundColor White
Write-Host "  6. Aguarde rebuild (~3min)" -ForegroundColor White
Write-Host "  7. ✅ Servidor atualizado!" -ForegroundColor White
Write-Host ""

# Abrir explorador
Start-Process explorer.exe -ArgumentList "/select,$(Resolve-Path $zipPath)"
