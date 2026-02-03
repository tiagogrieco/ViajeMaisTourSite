
import os
import shutil
import subprocess
import argparse
import sys
from datetime import datetime

# Paths (Absolute paths in standard Linux format for WSL compatibility)
PROJECT_ROOT = "/home/seenuseenu/projects/ViajeMaisTourSite"
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "scripts")
SRC_DATA_DIR = os.path.join(PROJECT_ROOT, "src/data")

GENERATED_FILE_NAME = "generated_blog_posts.ts"
SOURCE_GENERATED_FILE = os.path.join(SCRIPTS_DIR, GENERATED_FILE_NAME)
DEST_GENERATED_FILE = os.path.join(SRC_DATA_DIR, GENERATED_FILE_NAME)

def run_command(command, cwd=None):
    """Runs a shell command and prints output"""
    print(f"🚀 Running: {command}")
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            cwd=cwd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running command: {command}")
        print(e.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description="Auto Deploy Blog Posts")
    parser.add_argument("--generate", action="store_true", help="Run the content generation workflow first")
    parser.add_argument("--push", action="store_true", help="Push changes to Git")
    parser.add_argument("--message", type=str, default="Auto: New Blog Posts", help="Git commit message")
    
    args = parser.parse_args()
    
    print("🤖 STARTING AUTO DEPLOY SYSTEM")
    print(f"📂 Project Root: {PROJECT_ROOT}")
    
    # 1. Generate Content (Optional)
    if args.generate:
        print("\n📝 Generating content...")
        cmd = "python3 run_complete_workflow.py --headless"
        if not run_command(cmd, cwd=SCRIPTS_DIR):
            print("❌ Generation failed. Aborting.")
            return

    # 2. Check if generated file exists
    if not os.path.exists(SOURCE_GENERATED_FILE):
        print(f"❌ Generated file not found at {SOURCE_GENERATED_FILE}")
        if args.generate:
             print("   Generation might have failed or produced no output.")
        else:
             print("   Try running with --generate.")
        return

    # 3. Move/Copy to src/data
    print(f"\n📦 Deploying {GENERATED_FILE_NAME} to src/data...")
    try:
        shutil.copy(SOURCE_GENERATED_FILE, DEST_GENERATED_FILE)
        print(f"✅ File copied to {DEST_GENERATED_FILE}")
    except Exception as e:
        print(f"❌ Error copying file: {e}")
        return

    # 4. Git Operations
    print("\nworking on git...")
    if not os.path.exists(os.path.join(PROJECT_ROOT, ".git")):
        print("❌ Not a git repository. Skipping git operations.")
        return

    # Add specific files
    if not run_command(f"git add {DEST_GENERATED_FILE}", cwd=PROJECT_ROOT):
         return
    
    # Check if there are changes
    status_proc = subprocess.run("git status --porcelain", shell=True, cwd=PROJECT_ROOT, stdout=subprocess.PIPE, text=True)
    if not status_proc.stdout.strip():
        print("✨ No changes to commit.")
        return

    # Commit
    date_str = datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_msg = f"{args.message} - {date_str}"
    if not run_command(f'git commit -m "{commit_msg}"', cwd=PROJECT_ROOT):
        return

    # Push
    if args.push:
        print("\n⬆️ Pushing to remote...")
        if run_command("git push", cwd=PROJECT_ROOT):
            print("✅ Successfully pushed to repository!")
        else:
            print("❌ Failed to push.")
    else:
        print("\n⚠️  --push not specified. Skipping git push.")
        print("   Run 'git push' manually or use --push flag.")

    print("\n🎉 Auto Deploy Completed!")

if __name__ == "__main__":
    main()
