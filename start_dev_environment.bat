@echo off
echo ========================================
echo   INICIANDO AMBIENTE DE DESENVOLVIMENTO
echo ========================================
echo.
echo 1. Iniciando Frontend (React/Vite)...
start "Frontend (Site)" cmd /k "npm run dev"

echo.
echo 2. Iniciando Backends (Python API + Admin)...
call scripts\start_all_servers.bat

echo.
echo ========================================
echo   TUDO PRONTO!
echo   - Site: http://localhost:5173
echo   - Admin: http://localhost:5173/admin
echo ========================================
pause
