import os
import ftplib
import getpass
import subprocess
import time
import shutil

def upload_to_ftp(host, user, password):
    local_dist_dir = "dist"
    
    # 1. Run Build
    print("🔨 Building project (npm run build)...")
    try:
        # Use shell=True for Windows compatibility with npm
        subprocess.run(["npm", "run", "build"], check=True, shell=True)
        print("✅ Build successful!")
    except subprocess.CalledProcessError:
        print("❌ Error: Build failed. Aborting upload.")
        return

    local_dist_dir = "dist"
    remote_base_dir = "public_html"

    if not os.path.exists(local_dist_dir):
        print(f"❌ Error: Local '{local_dist_dir}' folder not found. Run 'npm run build' first.")
        return

    print(f"🚀 Connecting to FTP {host}...")
    try:
        ftp = ftplib.FTP(host)
        ftp.login(user, password)
        print("✅ Connected!")
        
        # Navigate to public_html or ensure it exists
        try:
            ftp.cwd(remote_base_dir)
        except ftplib.error_perm:
            print(f"ℹ️ Creating remote directory: {remote_base_dir}")
            ftp.mkd(remote_base_dir)
            ftp.cwd(remote_base_dir)

        print(f"📂 Uploading files from '{local_dist_dir}' to '{remote_base_dir}'...")

        ignore_files = ['.DS_Store', 'Thumbs.db']

        for root, dirs, files in os.walk(local_dist_dir):
            # Create relative path structure
            rel_path = os.path.relpath(root, local_dist_dir)
            if rel_path == ".":
                remote_path = ""
            else:
                remote_path = rel_path.replace("\\", "/")

            # Create directories on FTP
            if remote_path:
                try:
                    ftp.mkd(remote_path)
                    print(f"   📁 Created remote dir: {remote_path}")
                except ftplib.error_perm:
                    pass # Directory likely exists

            # Upload files
            for file in files:
                if file in ignore_files:
                    continue

                local_file_path = os.path.join(root, file)
                
                if remote_path:
                    remote_file_path = f"{remote_path}/{file}"
                else:
                    remote_file_path = file

                # Delete old file first to force new timestamp (especially for index.html)
                if file == "index.html" or file == ".htaccess":
                    try:
                        ftp.delete(remote_file_path)
                        print(f"   🗑️ Deleted old: {remote_file_path}")
                        time.sleep(1)  # Force different timestamp
                    except ftplib.error_perm:
                        pass  # File doesn't exist, that's fine
                
                print(f"   ⬆️ Uploading: {remote_file_path}")
                with open(local_file_path, 'rb') as f:
                    ftp.storbinary(f'STOR {remote_file_path}', f)

        ftp.quit()
        print("\n🎉 Deployment Complete! Your site is live.")

    except Exception as e:
        print(f"\n❌ FTP Error: {e}")

if __name__ == "__main__":
    print("--- 🚀 Auto Deploy via FTP (Configured) ---")
    
    host = "147.93.37.18"
    user = "u183147815"
    password = "Laura@3011"

    if host and user and password:
        upload_to_ftp(host, user, password)
    else:
        print("❌ Missing credentials.")
