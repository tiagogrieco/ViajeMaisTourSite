import ftplib

host = "147.93.37.18"
user = "u183147815"
password = "Laura@3011"

print("🔍 Downloading index.html from FTP to verify actual content...")

try:
    ftp = ftplib.FTP(host)
    ftp.login(user, password)
    print("✅ Connected to FTP")
    
    # Download index.html
    with open("ftp_index_downloaded.html", "wb") as f:
        ftp.retrbinary("RETR public_html/index.html", f.write)
    
    print("✅ Downloaded index.html from FTP")
    
    # Read and check content
    with open("ftp_index_downloaded.html", "r", encoding="utf-8") as f:
        content = f.read()
        
    print("\n--- CONTENT VERIFICATION ---")
    print(f"File size: {len(content)} bytes")
    
    # Look for the hash
    if "gzCaT29P" in content:
        print("✅ Hash gzCaT29P FOUND in FTP file")
    else:
        print("❌ Hash gzCaT29P NOT FOUND in FTP file")
    
    if "CUHqdrZt" in content:
        print("⚠️ OLD hash CUHqdrZt found in FTP file (PROBLEMA!)")
    else:
        print("✅ Old hash CUHqdrZt not found")
    
    # Show first 500 characters
    print("\n--- FIRST 500 CHARS ---")
    print(content[:500])
    
    # Get file info from FTP
    print("\n--- FTP FILE INFO ---")
    ftp.cwd("public_html")
    files = []
    ftp.retrlines('LIST index.html', files.append)
    for line in files:
        print(line)
    
    ftp.quit()
    
except Exception as e:
    print(f"❌ Error: {e}")
