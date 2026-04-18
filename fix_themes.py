import os
import re

directories_to_check = [
    r"src\app",
    r"src\components"
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # In Navbar
    content = content.replace("bg-white dark:bg-[#0f1115]", "bg-[var(--bg-secondary)]")
    content = content.replace("dark:border-gray-800", "")
    content = content.replace("dark:text-white", "")
    content = content.replace("text-gray-900 dark:text-white", "text-gray-900")
    content = content.replace("text-gray-600 dark:text-gray-300", "text-gray-600")
    content = content.replace("bg-white dark:bg-[#1a1d24]", "bg-[var(--bg-secondary)]")
    content = content.replace("dark:border-gray-700", "")
    content = content.replace("text-gray-800 dark:text-gray-200", "text-gray-800")
    content = content.replace("border-gray-100 dark:border-gray-700", "border-gray-100")
    content = content.replace("dark:text-gray-500", "")
    content = content.replace("border-gray-50 dark:border-gray-800", "border-gray-50")
    content = content.replace("hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400", "hover:bg-blue-50 hover:text-blue-600")
    content = content.replace("bg-gray-900 dark:bg-white", "bg-gray-900")

    # In pages
    content = content.replace("bg-[#f4f7fb] dark:bg-[#0f1115]/50", "bg-[var(--bg-secondary)]")
    content = content.replace("bg-[#f4f7fb] dark:bg-[#0f1115]", "bg-[var(--bg-primary)]")
    content = content.replace("bg-[#f4f7fb]", "bg-[var(--bg-primary)]")
    content = content.replace("bg-gray-50 dark:bg-[#1a1d24]", "bg-[var(--bg-tertiary)]")
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for d in directories_to_check:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".tsx"):
                process_file(os.path.join(root, file))
