# Script para criar ZIP de deploy para EasyPanel

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Criando ZIP para Deploy EasyPanel" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$sourceDir = "G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\scripts"
$outputZip = "G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\blog-automation-deploy.zip"

# Lista de arquivos para incluir
$filesToInclude = @(
    "Dockerfile",
    "requirements.txt",
    ".dockerignore",
    "server.py",
    "blog_scraper.py",
    "ai_rewriter.py",
    "content_manager.py",
    "create_post.py",
    "create_insta_post.py",
    "visitors.json"
)

Write-Host "Preparando arquivos..." -ForegroundColor Yellow

# Criar diretório temporário
$tempDir = Join-Path $env:TEMP "blog-automation-temp"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copiar arquivos
$copiedCount = 0
foreach ($file in $filesToInclude) {
    $sourcePath = Join-Path $sourceDir $file
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $tempDir
        Write-Host "  ✓ $file" -ForegroundColor Green
        $copiedCount++
    }
    else {
        Write-Host "  ⚠ $file (não encontrado)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Criando arquivo ZIP..." -ForegroundColor Yellow

# Remover ZIP antigo se existir
if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
}

# Criar ZIP
Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -CompressionLevel Optimal

# Limpar temp
Remove-Item -Recurse -Force $tempDir

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  ZIP Criado com Sucesso!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivo: $outputZip" -ForegroundColor Cyan
Write-Host "Arquivos incluídos: $copiedCount" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Abra o EasyPanel" -ForegroundColor White
Write-Host "  2. Clique na aba 'Upload'" -ForegroundColor White
Write-Host "  3. Arraste o arquivo ZIP" -ForegroundColor White
Write-Host "  4. Configure GEMINI_API_KEY" -ForegroundColor White
Write-Host "  5. Clique em 'Deploy'!" -ForegroundColor White
Write-Host ""

# Abrir pasta do arquivo
Start-Process explorer.exe -ArgumentList "/select,`"$outputZip`""

