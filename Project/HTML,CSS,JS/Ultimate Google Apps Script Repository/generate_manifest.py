import os
import json

# Scans folder locally where it is executed
REPO_ROOT = '.'  

# Skip local web operational files and configuration caches
IGNORE_DIRS = {'.git', '.github', 'assets', 'node_modules', 'MERN', '.gitignore'}
# These are the main files for the website viewer itself, not the content.
# We'll exclude them from the manifest to avoid them being displayed as "programs".
CORE_VIEWER_FILES = {'index.html', 'script.js', 'style.css', 'generate_manifest.py', 'README.md'}
def build_flat_tree(root_dir):
    flat_tree = []
    
    for root, dirs, files in os.walk(root_dir):
        # Prevent indexing tracking loops
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        dirs.sort()
        
        for d in dirs:
            rel_path = os.path.relpath(os.path.join(root, d), root_dir).replace('\\', '/')
            flat_tree.append({
                "path": rel_path,
                "type": "tree"
            })

        files.sort()
        for f in files:
            abs_path = os.path.join(root, f)
            rel_path = os.path.relpath(abs_path, root_dir).replace('\\', '/')

            # Skip core site files, dotfiles, and compiled python files based on their relative path.
            if rel_path in CORE_VIEWER_FILES or f.startswith('.') or rel_path.endswith(('.pyc', '.json')):
                continue

            entry = {
                "path": rel_path,
                "type": "blob"
            }
            flat_tree.append(entry)
            
    return flat_tree


if __name__ == "__main__":
    print("Compiling localized workspace configuration blueprint mapping...")
    manifest_data = build_flat_tree(REPO_ROOT)
    
    # Outputs right next to index.html file
    output_file = './tree_manifest.json'
    
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(manifest_data, json_file, indent=2, ensure_ascii=False)
        
    print(f"Success! {output_file} generated locally with {len(manifest_data)} mapped records.")