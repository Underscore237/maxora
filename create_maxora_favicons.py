import os
import base64
from PIL import Image

uploaded_dir = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\.user_uploaded"
dark_img_path = os.path.join(uploaded_dir, "media_1787742816041.png")

dark_img = Image.open(dark_img_path).convert("RGBA")
W, H = dark_img.size

# Extraire l'emblème seul en très haute netteté
emblem_box = (int(W * 0.355), int(H * 0.33), int(W * 0.485), int(H * 0.64))
emblem_img = dark_img.crop(emblem_box)

emblem_data = []
for p in emblem_img.getdata():
    b = max(p[0], p[1], p[2])
    if b < 18:
        emblem_data.append((p[0], p[1], p[2], 0))
    elif b < 45:
        a = int((b - 18) / (45 - 18) * 255)
        emblem_data.append((p[0], p[1], p[2], a))
    else:
        emblem_data.append(p)

emblem_clean = Image.new("RGBA", emblem_img.size)
emblem_clean.putdata(emblem_data)
bbox = emblem_clean.getbbox()
emblem_trimmed = emblem_clean.crop(bbox)

# Créer une icône carrée avec l'emblème centré
size = max(emblem_trimmed.size) + 16
square_icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
paste_x = (size - emblem_trimmed.width) // 2
paste_y = (size - emblem_trimmed.height) // 2
square_icon.paste(emblem_trimmed, (paste_x, paste_y), emblem_trimmed)

# Sauvegarder dans toutes les tailles de favicon
square_icon.resize((128, 128), Image.Resampling.LANCZOS).save("public/favicon.png", "PNG")
square_icon.resize((64, 64), Image.Resampling.LANCZOS).save("public/favicon-64.png", "PNG")
square_icon.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon-32.png", "PNG")
square_icon.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon.ico", "ICO")

# Créer un favicon SVG intégrant le PNG en base64 pour un support 100% des navigateurs
with open("public/favicon.png", "rb") as f:
    b64_png = base64.b64encode(f.read()).decode("utf-8")

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  <image width="{size}" height="{size}" href="data:image/png;base64,{b64_png}"/>
</svg>'''

with open("public/favicon.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("Favicons (PNG, ICO, SVG) generated with Maxora emblem!")
