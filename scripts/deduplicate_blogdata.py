import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")

def deduplicate():
    print(f"Reading {BLOG_DATA_PATH}...", file=sys.stderr)
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!", file=sys.stderr)
        return

    # 1. Identify the array content
    # Look for start of array
    start_marker = "export const BLOG_POSTS: BlogPost[] = ["
    start_pos = content.find(start_marker)
    if start_pos == -1:
        print("Could not find start of BLOG_POSTS array.", file=sys.stderr)
        return

    # Identify end of array (last ];)
    end_pos = content.rfind("];")
    if end_pos == -1:
        print("Could not find end of BLOG_POSTS array.", file=sys.stderr)
        return

    header = content[:start_pos + len(start_marker)]
    array_content = content[start_pos + len(start_marker):end_pos]
    footer = content[end_pos:]

    # 2. Split into objects
    # We essentially want to split by "  {" ensuring we capture the whole object.
    # A safe splitting pattern is roughly `,\n  {` or just `  {` if we are careful.
    # But nested braces in content (HTML) makes this hard.
    
    # Better approach: Regular expression to find `id: ...` which is a required field.
    # We can assume each object starts with `{` followed eventually by `id:`.
    # And they are separated by `,`.
    
    # Let's try splitting by the specific indentation pattern used in the file for new objects:
    # "\n  {"
    
    # However, sometimes there might be slight variations.
    # Let's split by `\n  {\n    id:` effectively.
    
    # Actually, we can just scan for IDs and extract titles.
    # But we want to preserve the full text of the object.
    
    # Strategy:
    # Iterate through the string. Count braces to find objects.
    
    objects = []
    current_object = ""
    brace_count = 0
    in_object = False
    
    # We will ignore the commas between objects for the parsing, then verify valid TS format later.
    
    # Simple state machine to extract objects { ... } at top level of array
    
    for char in array_content:
        if char == '{':
            if brace_count == 0:
                in_object = True
                current_object = "" # Start new
            brace_count += 1
            current_object += char
        elif char == '}':
            brace_count -= 1
            current_object += char
            if brace_count == 0 and in_object:
                in_object = False
                objects.append(current_object.strip())
        else:
            if in_object:
                current_object += char
            # else: ignoring whitespace/commas between objects
            
    print(f"Found {len(objects)} objects.", file=sys.stderr)
    
    # 3. Deduplicate
    unique_objects_map = {}
    unique_objects_list = []
    
    for obj_str in objects:
        # Extract Title to use as key (ID might be non-unique if generated poorly, Title is safer for user intent)
        # title: "..."
        title_match = re.search(r'title:\s*"(.*?)"', obj_str)
        if not title_match:
             title_match = re.search(r"title:\s*'(.*?)'", obj_str)
        
        if title_match:
            title = title_match.group(1)
            # Map overwrites previous entry with same title -> Keeps the LATEST version
            if title in unique_objects_map:
                print(f"Duplicate found for '{title}'. Keeping latest.", file=sys.stderr)
                # Remove the old one from the ordered list to maintain order but update content
                # Actually, simpler: maintain order of FIRST appearance? Or LAST?
                # Usually LAST is better for updates.
                
                # Let's rebuild the list.
                # If we encounter a title we've seen, we replace the version we have in our map.
                # But to preserve order:
                # If we want to keep the LATEST and put it in the LATEST position: just process normally.
                # unique_objects_map[title] = obj_str
                pass
            
            unique_objects_map[title] = obj_str
        else:
            print("Could not parse title for an object. Keeping it to be safe.", file=sys.stderr)
            # Use a random key or the content itself
            unique_objects_map[f"__unknown_{len(unique_objects_map)}"] = obj_str

    # Reconstruct list from the map keys
    # The map in Python 3.7+ preserves insertion order.
    # If we processed sequentially, we have the last occurrences in the map, but the order of keys is "first insertion"
    # Wait: `d[k] = v` updates value, but key position remains unless deleted.
    # We want the latest version.
    
    # Let's iterate again? No.
    # Let's just use the list of keys.
    # If we want the position of the NEWEST post to be at the END (which it likely is), this works.
    # If duplicates were "Paris", "London", "Paris_v2".
    # Map key order: "Paris", "London". Value of "Paris" is "Paris_v2".
    # So "Paris_v2" stays at the start.
    
    # This is fine. The user just wants valid data.
    
    cleaned_objects = list(unique_objects_map.values())
    print(f"Reduced to {len(cleaned_objects)} unique objects.", file=sys.stderr)
    
    # 4. Write back
    new_array_content = "\n  " + ",\n  ".join(cleaned_objects) + "\n"
    
    full_new_content = header + new_array_content + footer
    
    with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
        f.write(full_new_content)
        
    print("✅ Successfully deduplicated blogData.ts", file=sys.stderr)

if __name__ == "__main__":
    deduplicate()
