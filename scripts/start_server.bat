@echo off
echo ========================================
echo Iniciando Servidor Admin UNIFICADO
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Configurando API Key...
set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw

echo.
echo ========================================
echo Iniciando server.py (porta 5000)
echo.
echo Funcionalidades:
echo   - Auto Blog AI
echo   - Instagram Auto-Feed
echo   - Marketing Zap
echo   - Consulta IA
echo   - Blog Content Manager (NOVO!)
echo   - Scraping
echo   - AI Rewriter
echo   - Calendario Editorial
echo ========================================
echo.

cd scripts
python server.py

pause
