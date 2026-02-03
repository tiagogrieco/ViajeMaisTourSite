import ftplib

host = "147.93.37.18"
user = "u183147815"
password = "Laura@3011"

# Criar arquivo de teste simples
test_content = b"<h1>TESTE OK</h1>"

print("🧪 Criando e enviando test.html para diagnosticar 403...\n")

try:
    ftp = ftplib.FTP(host)
    ftp.login(user, password)
    ftp.cwd("public_html")
    
    # Upload test.html
    from io import BytesIO
    ftp.storbinary('STOR test.html', BytesIO(test_content))
    print("✅ test.html enviado!\n")
    
    # Listar arquivos na raiz
    print("📋 ARQUIVOS NA RAIZ (public_html):")
    files = []
    ftp.retrlines('LIST', files.append)
    for f in files:
        parts = f.split()
        if len(parts) >= 9:
            permissions = parts[0]
            name = parts[-1]
            print(f"  {permissions:12} {name}")
    
    # Verificar se index.html existe
    print("\n🔍 VERIFICAÇÃO:")
    try:
        size = ftp.size("index.html")
        print(f"  ✅ index.html existe ({size} bytes)")
    except:
        print(f"  ❌ index.html NÃO EXISTE!")
    
    try:
        size = ftp.size("test.html")
        print(f"  ✅ test.html existe ({size} bytes)")
    except:
        print(f"  ❌ test.html NÃO EXISTE!")
    
    ftp.quit()
    
    print("\n🌐 Agora teste no navegador:")
    print("   https://viajemaistour.com/test.html")
    print("\n   ✅ Se abrir → problema é no index.html/build")
    print("   ❌ Se der 403 → problema é servidor/permissão")
    
except Exception as e:
    print(f"❌ Erro: {e}")
