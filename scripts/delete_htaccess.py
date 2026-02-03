import ftplib

host = "147.93.37.18"
user = "u183147815"
password = "Laura@3011"

print("🗑️ Deletando .htaccess que está causando erro 403...")

try:
    ftp = ftplib.FTP(host)
    ftp.login(user, password)
    ftp.cwd("public_html")
    
    try:
        ftp.delete(".htaccess")
        print("✅ .htaccess DELETADO com sucesso!")
    except Exception as e:
        print(f"⚠️ Erro ao deletar: {e}")
    
    # List files to confirm
    print("\n📋 Arquivos restantes:")
    files = []
    ftp.retrlines('LIST', files.append)
    for f in files[:5]:  # Show first 5
        print(f)
    
    ftp.quit()
    
except Exception as e:
    print(f"❌ Erro: {e}")
