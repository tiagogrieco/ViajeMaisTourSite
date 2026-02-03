import threading
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from server import app as app_main
    from admin_api import app as app_admin
except ImportError as e:
    print(f"Erro ao importar apps: {e}")
    sys.exit(1)

def run_main():
    print("🚀 Inciando API Principal (Porta 5000)...")
    # Disable reloader to avoid duplicate threads/processes issue in this unified mode
    app_main.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)

def run_admin():
    print("🚀 Iniciando API Admin (Porta 5001)...")
    app_admin.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)

if __name__ == "__main__":
    print("="*50)
    print("    GERENCIADOR DE SERVIDORES UNIFICADO")
    print("="*50)
    
    t1 = threading.Thread(target=run_main)
    t2 = threading.Thread(target=run_admin)
    
    t1.daemon = True
    t2.daemon = True
    
    t1.start()
    t2.start()
    
    try:
        # Keep main thread alive
        while True:
            import time
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nParando servidores...")
