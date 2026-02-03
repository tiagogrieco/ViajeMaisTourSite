@echo off
echo ==========================================
echo      INICIANDO DEPLOY AUTOMATICO
echo ==========================================
echo.
python scripts/upload_to_ftp.py
echo.
echo ==========================================
echo      PROCESSO FINALIZADO
echo ==========================================
pause
