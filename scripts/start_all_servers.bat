@echo off
echo ========================================
echo Iniciando TODOS os Servidores Admin
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Configurando API Keys...
set GEMINI_API_KEY=AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw

echo.
echo ========================================
echo Iniciando Servidor Unificado (Frontend + Backend)...
cd scripts
start "Servidor Unificado ViajeMais" cmd /k "..\venv\Scripts\python.exe unified_server.py"

echo.
echo ========================================
echo Servidores iniciados!
echo ========================================
echo.
echo Aguarde 5 segundos para os servidores iniciarem...
timeout /t 5 >nul

echo.
echo PRONTO! Acesse:
echo   - Admin: http://localhost:5173/admin
echo   - PIN: 1234
echo.
echo Mantenha essa janela aberta!
echo.
pause
