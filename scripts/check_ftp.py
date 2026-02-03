import ftplib

def check_ftp(host, user, password):
    try:
        ftp = ftplib.FTP(host)
        ftp.login(user, password)
        
        with open("temp_index_download.html", "wb") as f:
            ftp.retrbinary("RETR public_html/index.html", f.write)
        
        with open("temp_index_download.html", "r", encoding="utf-8") as f:
            content = f.read()
            if "gzCaT29P" in content:
                print("\nVERIFICATION_RESULT: PASS (Hash found)")
            else:
                print("\nVERIFICATION_RESULT: FAIL (Hash NOT found)")
        
        ftp.quit()

    except Exception as e:
        print(f"\nVERIFICATION_RESULT: ERROR ({e})")

if __name__ == "__main__":
    host = "147.93.37.18"
    user = "u183147815"
    password = "Laura@3011"
    check_ftp(host, user, password)
