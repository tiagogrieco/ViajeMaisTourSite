@echo off
echo ========================================
echo WORKFLOW DE AUTOMACAO DE BLOG
echo Viaje Mais Tour
echo ========================================
echo.

cd /d "%~dp0"
cd ..

echo Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo Verificando API Key do Gemini...
if "%GEMINI_API_KEY%"=="" (
    echo.
    echo ERRO: API Key do Gemini nao configurada!
    echo.
    echo Configure com:
    echo   set GEMINI_API_KEY=sua_chave_aqui
    echo.
    echo Para obter sua chave:
    echo   1. Acesse: https://makersuite.google.com/app/apikey
    echo   2. Crie uma nova API key
    echo   3. Configure a variavel de ambiente
    echo.
    pause
    exit /b 1
)

echo API Key encontrada!
echo.
echo Iniciando workflow...
cd scripts
python run_complete_workflow.py

echo.
pause
