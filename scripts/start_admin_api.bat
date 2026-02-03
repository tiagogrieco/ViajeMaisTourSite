@echo off
echo ========================================
echo Iniciando Admin API Server
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Configurando API Key do Gemini...
set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw

echo.
echo Iniciando servidor...
cd scripts
python admin_api.py

pause
