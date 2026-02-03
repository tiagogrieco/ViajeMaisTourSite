
import urllib.request
import re

url = "https://viajemaistour.com/"
try:
    print(f"🕵️ Checking live URL: {url}")
    with urllib.request.urlopen(url) as response:
        headers = response.info()
        content = response.read().decode('utf-8')
        
        print("\n--- 📡 HTTP Headers ---")
        for k, v in headers.items():
            if k.lower() in ['server', 'date', 'etag', 'last-modified', 'cache-control', 'cf-cache-status', 'x-cache', 'x-ls-cache']:
                print(f"{k}: {v}")
        
        print("\n--- 🔍 Content Analysis ---")
        # Check for the specific JS hash we know is on the server
        if "gzCaT29P" in content:
            print("✅ SUCCESS: Live site is serving the NEW Javascript hash (gzCaT29P).")
        else:
            print("❌ FAILURE: Live site is serving OLD content.")
            # Find what hash it IS serving
            match = re.search(r'index-([a-zA-Z0-9]+)\.js', content)
            if match:
                print(f"👉 Current Live Hash: {match.group(1)}")
            else:
                print("❓ Could not find any index-*.js hash pattern.")

except Exception as e:
    print(f"❌ Error fetching URL: {e}")
