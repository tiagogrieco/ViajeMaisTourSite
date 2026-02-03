import os

file_path = r"G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\src\data\blogData.ts"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements
    target1 = "10 de Abril (Sexta-feira)"
    repl1 = "3 de Abril (Sexta-feira)"
    
    target2 = "11 de Junho (Quinta-feira)"
    repl2 = "4 de Junho (Quinta-feira)"

    new_content = content.replace(target1, repl1).replace(target2, repl2)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("SUCCESS: Dates updated in blogData.ts")
    else:
        print("INFO: No changes needed or targets not found.")

except Exception as e:
    print(f"ERROR: {e}")
