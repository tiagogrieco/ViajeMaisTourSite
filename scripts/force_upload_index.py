
import ftplib
import os

host = "147.93.37.18"
user = "u183147815"
password = "Laura@3011"
local_file = "dist/index.html"
remote_file = "public_html/index.html"

if not os.path.exists(local_file):
    print(f"❌ Error: {local_file} not found!")
    exit(1)

print(f"🚀 Force uploading {local_file} to {remote_file}...")

try:
    ftp = ftplib.FTP(host)
    ftp.login(user, password)
    print("✅ Connected to FTP")
    
    with open(local_file, "rb") as f:
        ftp.storbinary(f"STOR {remote_file}", f)
    
    print("✅ Upload successful!")
    
    # Check timestamp/size
    files = []
    ftp.cwd("public_html")
    ftp.dir("index.html", files.append)
    for line in files:
        print(f"Server file info: {line}")
        
    ftp.quit()

except Exception as e:
    print(f"❌ Error: {e}")
