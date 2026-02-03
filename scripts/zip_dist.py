import shutil
import os

def zip_dist():
    source_dir = "dist"
    output_filename = "deploy"
    
    if not os.path.exists(source_dir):
        print(f"Error: '{source_dir}' folder not found. Run 'npm run build' first.")
        return

    # Create a zip file
    shutil.make_archive(output_filename, 'zip', source_dir)
    print(f"Success! Created {output_filename}.zip containing all files from {source_dir}")

if __name__ == "__main__":
    zip_dist()
