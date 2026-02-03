import os
import re

file_path = r"G:\Projetos Python\Sistema Viaje Mais Tour\ViajeMaisTourSite\src\data\blogData.ts"

# The new, high-converting HTML content
new_content = """
    content: `
        <div style="font-family: sans-serif; line-height: 1.8; color: #333;">
            <h2 style="color: #1a365d; border-bottom: 2px solid #eb5757; padding-bottom: 10px;">2026: O Ano Oficial de Tirar os Sonhos do Papel! ✈️</h2>
            
            <p style="font-size: 1.1em;">Você sabia que <strong>2026 terá 9 feriados prolongados</strong>? Isso mesmo! Se você sentiu que trabalhou demais e viajou de menos em 2025, essa é a sua chance de virar o jogo.</p>
            
            <p>Nós da <strong>Viaje Mais Tour</strong> preparamos este Guia Estratégico para você planejar suas folgas com inteligência. O segredo de quem viaja muito não é ser rico, é ter <em>planejamento</em>!</p>

            <div style="background-color: #f8fafc; border-left: 4px solid #1a365d; padding: 20px; margin: 30px 0; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #1a365d;">📅 O Calendário de Ouro 2026</h3>
                <p>Já abra sua agenda e marque essas datas. Cada uma delas é uma oportunidade de viver algo novo:</p>
                
                <ul style="list-style: none; padding: 0;">
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🎭 17/02 - Carnaval (Terça):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Fuja para um Resort All-Inclusive no Nordeste ou curta a folia no Rio.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🍫 03/04 - Sexta-feira Santa (Sexta) + Páscoa:</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Gramado (RS) está mágica nessa época! Clima de outono e muito chocolate.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🇧🇷 21/04 - Tiradentes (Terça):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Que tal 4 dias em Buenos Aires ou Santiago? É a época perfeita.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>👷 01/05 - Dia do Trabalho (Sexta):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Ecoturismo na Chapada dos Veadeiros ou Bonito.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>⛪ 04/06 - Corpus Christi (Quinta):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Feriadão de 4 dias! Perfeito para o Caribe ou praias do Nordeste.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🇧🇷 07/09 - Independência (Segunda):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Foz do Iguaçu. As cataratas estão lindas e o clima agradável.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🤸 12/10 - N. Sra. Aparecida (Segunda):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Disney! Outubro é mês de Halloween em Orlando, uma experiência única.
                    </li>
                    <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
                        <strong>🙏 02/11 - Finados (Segunda):</strong> 
                        <br><span style="color: #666;">Sugestão:</span> Cruzeiro pela costa brasileira. Temporada começando!
                    </li>
                </ul>
            </div>

            <h3 style="color: #eb5757;">⚠️ O "Pulo do Gato" para Economizar até 40%</h3>
            <p>A regra é clara: <strong>quem deixa para última hora paga o dobro</strong>. Companhias aéreas e hotéis sobem os preços conforme a data se aproxima.</p>
            <p>Na Viaje Mais Tour, conseguimos travar tarifas e parcelar sua viagem no boleto ou cartão, para que você viaje sem dívidas.</p>

            <div style="background-color: #e6fffa; border: 2px solid #38b2ac; padding: 25px; border-radius: 12px; text-align: center; margin-top: 40px;">
                <h3 style="color: #234e52; margin-top: 0;">🚀 Quer um Orçamento Personalizado?</h3>
                <p style="color: #285e61; margin-bottom: 20px;">Não perca tempo pesquisando em 10 sites diferentes. Nossa consultoria é gratuita e achamos o melhor custo-benefício para você.</p>
                <a href="https://wa.me/5534998168772?text=Oi!%20Li%20o%20post%20sobre%20Feriados%202026%20e%20quero%20planejar%20minha%20viagem!" 
                   style="background-color: #25d366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1em; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" style="width: 20px; vertical-align: middle; margin-right: 8px; filter: brightness(0) invert(1);">
                   Chamar no WhatsApp Agora
                </a>
                <p style="font-size: 0.9em; color: #666; margin-top: 15px;">*Atendimento humano e especializado.*</p>
            </div>
        </div>
    `
"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        file_content = f.read()

    # Regex to find the content field of the specific post ID 1768750988
    # We look for the ID, then scan until we find the content field associated with it in the object structure.
    # Since the file structure is reliable around the ID:
    
    # 1. Find the start of the object with the ID
    post_start_index = file_content.find("id: 1768750988")
    if post_start_index == -1:
        raise Exception("Post ID 1768750988 not found in file.")

    # 2. Find the 'content:' field *after* the ID
    content_start_marker = "content: `"
    start_index = file_content.find(content_start_marker, post_start_index)
    
    # 3. Find the end of the content field (closing backtick)
    # We need to be careful about escaped backticks if any, but usually template literals end with `
    # The content ends before the closing brace of the object or the next object start.
    # A safe assumption in this generated file is the closing backtick followed by a comma or newline or closing brace.
    end_index = file_content.find("`", start_index + len(content_start_marker))
    
    if start_index == -1 or end_index == -1:
        raise Exception("Could not locate content boundaries for the post.")

    # Construct the new file content
    # We keep everything before the content start, insert new content (cleaned), and keep everything after the end backtick
    
    # Extract the replacement string from our variable, removing the variable assignment syntax
    clean_replacement = new_content.strip()[9:] # removes 'content: ' prefix from the python string definition above to match strictly what we want
    
    # Actually, simpler: The regex approach might be brittle if I don't match exact indentation. 
    # Let's perform a string slice replacement.
    
    prefix = file_content[:start_index]
    suffix = file_content[end_index+1:] # +1 to skip the closing backtick of the old content
    
    # My new_content variable has `content: ` at the start. 
    # The file has `content: ` at start_index. 
    # I want to replace from start_index to end_index+1.
    
    final_file_content = prefix + new_content.strip() + suffix

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_file_content)
    
    print("SUCCESS: Blog post 1768750988 content updated successfully.")

except Exception as e:
    print(f"ERROR: {e}")
