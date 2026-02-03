@echo off
title Viaje Mais Tour Auto-Updater
color 0B

echo ==================================================
echo   VIAJE MAIS TOUR AUTO-UPDATER
echo ==================================================
echo.
echo Este script vai atualizar as fotos do Instagram a cada 1 hora.
echo Para parar, apenas feche esta janela.
echo.

:loop
echo [ %TIME% ] Verificando novas fotos...
venv\Scripts\python scripts/update_feed.py

echo.
echo [ %TIME% ] Atualizacao concluida!
echo Proxima verificacao em 1 hora...
echo.

:: Wait for 3600 seconds (1 hour)
timeout /t 3600 /nobreak >nul

goto loop
