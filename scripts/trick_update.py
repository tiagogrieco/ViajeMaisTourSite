
import os

file_path = r"G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\src\data\blogData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_title = '    title: "Melhores Lugares para Viajar em Família no Brasil em 2026",'
new_title = '    title: "Melhores Lugares para Viajar em Família no Brasil em 2026 [ATUALIZADO]",'

if old_title in content:
    new_content = content.replace(old_title, new_title)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ Title updated successfully!")
else:
    print("⚠️ Title not found (maybe already updated?)")
