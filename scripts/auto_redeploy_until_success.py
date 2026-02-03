"""
Auto Re-Deploy Script - Viaje Mais Tour
========================================
This script repeatedly deploys and verifies until the live site shows the correct hash.

How it works:
1. Runs the upload_to_ftp.py script
2. Waits 30 seconds for CDN propagation
3. Checks if live site has the correct hash
4. If not, deletes all files from public_html and tries again
5. Repeats until success (max 5 attempts)
"""

import subprocess
import time
import urllib.request
import re
import ftplib

# FTP credentials
FTP_HOST = "147.93.37.18"
FTP_USER = "u183147815"
FTP_PASSWORD = "Laura@3011"
REMOTE_DIR = "public_html"

# Expected hash (from current build)
EXPECTED_HASH = "gzCaT29P"
MAX_ATTEMPTS = 5
WAIT_TIME = 30  # seconds


def get_live_hash():
    """Check what hash the live site is currently serving"""
    url = "https://viajemaistour.com/"
    try:
        with urllib.request.urlopen(url) as response:
            content = response.read().decode('utf-8')
            match = re.search(r'index-([a-zA-Z0-9]+)\.js', content)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"❌ Error checking live site: {e}")
    return None


def delete_all_remote_files():
    """Delete all files from public_html to force complete refresh"""
    print("\n🗑️ NUCLEAR OPTION: Deleting all files from public_html...")
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASSWORD)
        ftp.cwd(REMOTE_DIR)
        
        # Get list of all items
        items = []
        ftp.retrlines('LIST', items.append)
        
        for item in items:
            parts = item.split()
            if len(parts) < 9:
                continue
            
            name = parts[-1]
            if name in ['.', '..']:
                continue
            
            # Check if directory or file
            if item.startswith('d'):
                # Directory - delete recursively
                print(f"   📁 Deleting directory: {name}")
                delete_directory_recursive(ftp, name)
            else:
                # File
                print(f"   🗑️ Deleting file: {name}")
                try:
                    ftp.delete(name)
                except:
                    pass
        
        ftp.quit()
        print("✅ All files deleted!")
        return True
        
    except Exception as e:
        print(f"❌ Error deleting files: {e}")
        return False


def delete_directory_recursive(ftp, path):
    """Recursively delete a directory and its contents"""
    try:
        ftp.cwd(path)
        items = []
        ftp.retrlines('LIST', items.append)
        
        for item in items:
            parts = item.split()
            if len(parts) < 9:
                continue
            name = parts[-1]
            if name in ['.', '..']:
                continue
            
            if item.startswith('d'):
                delete_directory_recursive(ftp, name)
            else:
                try:
                    ftp.delete(name)
                except:
                    pass
        
        ftp.cwd('..')
        ftp.rmd(path)
    except:
        pass


def run_deploy():
    """Run the upload_to_ftp.py script"""
    print("\n🚀 Running deployment...")
    try:
        result = subprocess.run(
            ["python", "scripts/upload_to_ftp.py"],
            check=True,
            shell=True,
            capture_output=True,
            text=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed: {e}")
        print(e.stdout)
        print(e.stderr)
        return False


def main():
    print("=" * 60)
    print("🔄 AUTO RE-DEPLOY UNTIL SUCCESS")
    print("=" * 60)
    print(f"Expected hash: {EXPECTED_HASH}")
    print(f"Max attempts: {MAX_ATTEMPTS}")
    print(f"Wait time between checks: {WAIT_TIME}s")
    print("=" * 60)
    
    for attempt in range(1, MAX_ATTEMPTS + 1):
        print(f"\n\n{'='*60}")
        print(f"🔄 ATTEMPT {attempt}/{MAX_ATTEMPTS}")
        print(f"{'='*60}")
        
        # If not first attempt, delete all files first
        if attempt > 1:
            if not delete_all_remote_files():
                print("⚠️ Failed to delete files, but continuing anyway...")
            time.sleep(2)
        
        # Run deployment
        if not run_deploy():
            print(f"⚠️ Attempt {attempt} deployment failed, trying again...")
            time.sleep(5)
            continue
        
        # Wait for CDN propagation
        print(f"\n⏳ Waiting {WAIT_TIME} seconds for CDN propagation...")
        for i in range(WAIT_TIME, 0, -5):
            print(f"   {i} seconds remaining...")
            time.sleep(5)
        
        # Check live site
        print("\n🔍 Checking live site...")
        live_hash = get_live_hash()
        
        if live_hash == EXPECTED_HASH:
            print(f"\n{'='*60}")
            print(f"✅✅✅ SUCCESS! ✅✅✅")
            print(f"{'='*60}")
            print(f"Live site is now serving the correct hash: {EXPECTED_HASH}")
            print(f"Total attempts needed: {attempt}")
            print(f"{'='*60}")
            return True
        else:
            print(f"\n❌ Attempt {attempt} failed:")
            print(f"   Expected: {EXPECTED_HASH}")
            print(f"   Got: {live_hash or 'Unknown'}")
            if attempt < MAX_ATTEMPTS:
                print(f"\n🔄 Trying again (nuclear option - deleting all files)...")
    
    print(f"\n{'='*60}")
    print(f"❌ FAILED AFTER {MAX_ATTEMPTS} ATTEMPTS")
    print(f"{'='*60}")
    print("Possible solutions:")
    print("1. Clear cache manually in Hostinger hPanel")
    print("2. Contact Hostinger support about aggressive CDN caching")
    print("3. Wait longer (cache may expire in 24-48 hours)")
    return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
