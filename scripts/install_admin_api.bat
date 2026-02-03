@echo off
echo ========================================
echo Instalando dependencias do Admin API
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Instalando Flask e dependencias...
cd scripts
pip install -r requirements_admin.txt

echo.
echo ========================================
echo Instalacao concluida!
echo ========================================
echo.
echo Para iniciar o servidor:
echo   cd scripts
echo   python admin_api.py
echo.
echo API rodara em: http://localhost:5001
echo.
pause
