import ftplib

host = "147.93.37.18"
user = "u183147815"
password = "Laura@3011"

print("🔍 Listando TODOS os arquivos em public_html...")

try:
    ftp = ftplib.FTP(host)
    ftp.login(user, password)
    ftp.cwd("public_html")
    
    print("\n=== ARQUIVOS NA RAIZ (public_html) ===")
    files = []
    ftp.retrlines('LIST', files.append)
    for f in files:
        print(f)
    
    print("\n=== VERIFICANDO SE INDEX.HTML EXISTE ===")
    try:
        size = ftp.size("index.html")
        print(f"✅ index.html EXISTE! Tamanho: {size} bytes")
    except:
        print("❌ index.html NÃO EXISTE!")
    
    print("\n=== VERIFICANDO PASTA ASSETS ===")
    try:
        ftp.cwd("assets")
        assets = []
        ftp.retrlines('LIST', assets.append)
        print(f"✅ Pasta assets existe com {len(assets)} itens")
        ftp.cwd("..")
    except:
        print("❌ Pasta assets NÃO existe!")
    
    ftp.quit()
    
except Exception as e:
    print(f"❌ Erro: {e}")
