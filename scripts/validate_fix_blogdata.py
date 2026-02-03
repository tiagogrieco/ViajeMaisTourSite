import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")

def validate_and_fix():
    print(f"Checking {BLOG_DATA_PATH}...", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!", file=sys.stderr)
        return

    # Check for the new post
    if "Guia Completo Paris 2026" not in content:
        print("❌ 'Guia Completo Paris 2026' NOT found in file.", file=sys.stderr)
    else:
        print("✅ 'Guia Completo Paris 2026' found.", file=sys.stderr)

    # Check basic structure
    # It should end with ];
    # But it might have garbage appended.
    
    # We look for the last occurrence of "export const BLOG_POSTS"
    # And then ensure it ends properly.
    
    # Let's clean up the end.
    # We assume the file contains a list of objects. 
    # We want to find the last closing brace `}` of an object, and close the array `];`
    
    # Remove whitespace from right
    content_stripped = content.rstrip()
    
    if content_stripped.endswith("];"):
        print("✅ File structure looks okay (ends with ];).", file=sys.stderr)
        # However, checking if there are multiple ]; or garbage before it.
        # If the file was appended naively, it might look like:
        # ... ]; export const ...
        # or ... ]; { ... } ];
        
        # New approach: Find all object blocks `{ ... }` inside the main array.
        # But constructing via regex is hard with nested braces.
        pass
    else:
        print("⚠️ File does NOT end with ];. Attempting fix...", file=sys.stderr)
        
        # Find the last `}`
        last_brace_index = content_stripped.rfind("}")
        if last_brace_index != -1:
            # Check if it looks like the end of an object
            print(f"Found last closing brace at {last_brace_index}", file=sys.stderr)
            
            # Truncate and add ];
            new_content = content_stripped[:last_brace_index+1] + "\n];"
            
            with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
                f.write(new_content)
            print("✅ Fixed file ending.", file=sys.stderr)
        else:
            print("❌ Could not find any closing brace to fix.", file=sys.stderr)

    # Deduplication Check
    # Sometimes naive appends cause duplication of the whole array or items.
    # Simple check: count "Guia Completo Paris 2026"
    count = content.count("Guia Completo Paris 2026")
    if count > 1:
        print(f"⚠️ Warning: Found {count} occurrences of the new post. Possible duplication.", file=sys.stderr)
        # Deduplication logic could be complex without parsing TS. 
        # For now, let's just report.

if __name__ == "__main__":
    validate_and_fix()
