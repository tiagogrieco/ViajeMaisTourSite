@echo off
echo ========================================
echo Instalando ferramentas de automacao de blog
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Instalando dependencias...
pip install requests beautifulsoup4 google-generativeai lxml

echo.
echo ========================================
echo Instalacao concluida!
echo ========================================
echo.
echo Proximos passos:
echo 1. Configure sua API Key do Gemini:
echo    set GEMINI_API_KEY=sua_chave_aqui
echo.
echo 2. Execute o workflow completo:
echo    cd scripts
echo    python run_complete_workflow.py
echo.
pause
