import os
import ftplib
import json
from pathlib import Path

# --- CONFIGURATION ---
# You can either edit these directly or create a 'ftp_config.json' file
CONFIG_FILE = "ftp_config.json"

DEFAULT_CONFIG = {
    "host": "ftp.yourdomain.com",
    "user": "u123456789",
    "password": "your_password",
    "local_dir": "../dist",  # Path to your build folder
    "remote_dir": "/public_html" # Usually public_html for Hostinger
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return DEFAULT_CONFIG

def upload_files(ftp, local_path, remote_path):
    local_path = Path(local_path)
    
    for item in local_path.rglob("*"):
        if item.is_file():
            # Calculate relative path to mirror structure
            relative_path = item.relative_to(local_path)
            remote_file_path = f"{remote_path}/{relative_path.as_posix()}"
            
            # Ensure remote directory exists
            remote_parent = os.path.dirname(remote_file_path)
            try:
                ftp.mkd(remote_parent)
            except ftplib.error_perm:
                pass # Directory likely exists

            print(f"Uploading: {item.name} -> {remote_file_path}")
            with open(item, "rb") as f:
                ftp.storbinary(f"STOR {remote_file_path}", f)

def main():
    print("🚀 Starting Hostinger Deployment...")
    
    config = load_config()
    
    # Check if config is still default
    if config["host"] == "ftp.yourdomain.com":
        print("⚠️  PLEASE CONFIGURE YOUR FTP DETAILS!")
        print(f"1. Create a file named '{CONFIG_FILE}' in this folder.")
        print(f"2. Add your Hostinger FTP details like this:\n")
        print(json.dumps(DEFAULT_CONFIG, indent=4))
        return

    # Check if build exists
    dist_path = Path(config["local_dir"]).resolve()
    if not dist_path.exists():
        print(f"❌ Build folder not found at: {dist_path}")
        print("   Did you run 'npm run build'?")
        return

    try:
        print(f"🔌 Connecting to {config['host']}...")
        ftp = ftplib.FTP(config["host"])
        ftp.login(config["user"], config["password"])
        
        # Force TLS if supported (Hostinger usually supports explicit TLS)
        try:
            ftp.auth() 
            ftp.prot_p()
        except:
            pass # Fallback to plain FTP if TLS fails or not supported

        print("✅ Connected!")
        
        print("📦 Uploading files...")
        upload_files(ftp, dist_path, config["remote_dir"])
        
        ftp.quit()
        print("\n✨ Deployment Complete! Your site should be live.")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
