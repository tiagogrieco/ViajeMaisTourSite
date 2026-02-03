@echo off
echo ========================================
echo Atualizando Ambiente Local (FIX)
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando venv...
call venv\Scripts\activate.bat

echo.
echo Instalando dependencias novas...
echo.
pip install -r scripts\requirements.txt

echo.
echo Sucesso! Iniciando servidor (porta 5000)...
echo.

set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw

cd scripts
python server.py

pause
