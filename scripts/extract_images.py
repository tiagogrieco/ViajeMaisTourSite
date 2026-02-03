"""
Script para extrair imagens Base64 do blogData.ts para arquivos separados
"""
import re
import base64
import os

# Caminho do arquivo
blog_data_path = r"D:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\src\data\blogData.ts"
output_dir = r"D:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\public\images\blog"

# Criar diretório de saída se não existir
os.makedirs(output_dir, exist_ok=True)

# Ler o arquivo
with open(blog_data_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todos os Base64 e substituir
pattern = r'image:\s*"data:image/(png|jpeg|jpg);base64,([^"]+)"'
matches = re.findall(pattern, content)

print(f"Encontradas {len(matches)} imagens Base64")

new_content = content
image_count = 0

for match in re.finditer(pattern, content):
    image_count += 1
    ext = match.group(1)
    base64_data = match.group(2)
    
    # Salvar imagem
    filename = f"blog_image_{image_count}.{ext}"
    filepath = os.path.join(output_dir, filename)
    
    try:
        with open(filepath, 'wb') as f:
            f.write(base64.b64decode(base64_data))
        print(f"Salva: {filename}")
        
        # Substituir no content
        old_value = match.group(0)
        new_value = f'image: "/images/blog/{filename}"'
        new_content = new_content.replace(old_value, new_value, 1)
    except Exception as e:
        print(f"Erro ao salvar {filename}: {e}")

# Salvar arquivo modificado
with open(blog_data_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\n✅ {image_count} imagens extraídas para {output_dir}")
print("✅ blogData.ts atualizado com referências a arquivos")
