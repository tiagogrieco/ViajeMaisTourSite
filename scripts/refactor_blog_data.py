
import os

# Absolute path in WSL
file_path = "/home/seenuseenu/projects/ViajeMaisTourSite/src/data/blogData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Define the old and new start blocks
old_start = """export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
  readTime?: string;
  slug?: string;
  content?: string;
}

// Exporting blog posts data
export const BLOG_POSTS: BlogPost[] = ["""

new_start = """import { generatedBlogPosts } from './generated_blog_posts';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  author: string;
  readTime?: string | number;
  slug?: string;
  content?: string;
  metaDescription?: string;
  tags?: string[];
}

// Exporting blog posts data
const STATIC_BLOG_POSTS: BlogPost[] = ["""

# Replace the start
if old_start in content:
    content = content.replace(old_start, new_start)
    print("Start block replaced.")
else:
    print("Start block NOT found (maybe whitespace mismatch).")
    # Fallback details:
    # 1. Check if import already exists
    if "import { generatedBlogPosts }" not in content:
        content = "import { generatedBlogPosts } from './generated_blog_posts';\n" + content
    
    # 2. Update interface
    content = content.replace("readTime?: string;", "readTime?: string | number;")
    
    # 3. Rename array
    content = content.replace("export const BLOG_POSTS: BlogPost[] = [", "const STATIC_BLOG_POSTS: BlogPost[] = [")

# Replace the end
# We look for the last occurrence of "];"
last_bracket_index = content.rfind("];")

# Check if ALREADY exported
if "export const BLOG_POSTS = [...STATIC_BLOG_POSTS" in content:
    print("Already exported.")
elif last_bracket_index != -1:
    content = content[:last_bracket_index + 2] + "\n\nexport const BLOG_POSTS: BlogPost[] = [...STATIC_BLOG_POSTS, ...generatedBlogPosts];"
    print("End block appended.")
else:
    print("End block '];' NOT found.")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done Refactoring.")
