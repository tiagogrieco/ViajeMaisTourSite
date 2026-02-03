@echo off
echo ==========================================
echo   Configurando Servidor (Modo Seguro)
echo ==========================================

cd /d "%~dp0"

IF NOT EXIST "venv" (
    echo [1/5] Criando ambiente virtual limpo...
    python -m venv venv --without-pip
)

IF NOT EXIST "venv\installed.flag" (
    echo [2/5] Baixando instalador do PIP...
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

    echo [3/5] Instalando PIP no ambiente virtual...
    venv\Scripts\python get-pip.py

    echo [4/5] Instalando dependencias do projeto...
    venv\Scripts\pip install -r scripts/requirements.txt
    
    echo. > venv\installed.flag
    echo [OK] Instalação concluída.
    if exist "get-pip.py" del "get-pip.py"
) ELSE (
    echo [Skipping] Dependencias ja instaladas.
)

echo.
echo [5/5] INICIANDO SERVIDOR...
echo ==========================================
echo   Servidor online na porta 5000.
echo   Pode minimizar esta janela.
echo ==========================================
echo.
venv\Scripts\python scripts/server.py
pause
