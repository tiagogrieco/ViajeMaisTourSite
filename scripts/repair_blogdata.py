import os

file_path = r"G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\src\data\blogData.ts"

try:
    with open(file_path, "rb+") as f:
        f.seek(0, os.SEEK_END)
        size = f.tell()
        
        # Read the last 100 bytes to check for corruption
        f.seek(max(0, size - 100), os.SEEK_SET)
        tail = f.read()
        print(f"Current tail (hex): {tail.hex()}")
        print(f"Current tail (repr): {tail}")
        
        # Find the last occurrence of ]; which marks the clean end of the file
        # We look for bytes corresponding to ];\n or just ];
        
        # Search backwards for ];
        content = f.read() # Re-reading tail just to be sure
        
        # We need to scan the file to find the end of the array.
        # Since the file is huge, let's look at the end.
        
        # Let's try to find the last valid closure
        marker = b"];"
        pos = tail.rfind(marker)
        
        if pos != -1:
             # Calculate absolute position
             trunc_pos = max(0, size - 100) + pos + len(marker)
             print(f"Found marker at absolute pos: {trunc_pos}")
             f.seek(trunc_pos)
             f.truncate()
             print("File truncated successfully.")
        else:
             print("Could not find closing marker '];' in the last 100 bytes.")
             # Fallback: Read more if needed, but usually the corruption is just the appended part.
             
except Exception as e:
    print(f"Error: {e}")
