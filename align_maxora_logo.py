import os
from PIL import Image

uploaded_dir = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\.user_uploaded"
dark_img_path = os.path.join(uploaded_dir, "media_1787742816041.png")

dark_img = Image.open(dark_img_path).convert("RGBA")
W, H = dark_img.size

# 1. Découper l'emblème doré (avec son halo et pointe)
emblem_box = (int(W * 0.355), int(H * 0.33), int(W * 0.485), int(H * 0.64))
emblem_img = dark_img.crop(emblem_box)

# Rendre le fond transparent
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
# Trim transparent edges
emblem_bbox = emblem_clean.getbbox()
emblem_trimmed = emblem_clean.crop(emblem_bbox)
emblem_trimmed.save("public/assets/maxora_emblem.png", "PNG")

# 2. Découper le texte MAXORA seul
text_box = (int(W * 0.49), int(H * 0.44), int(W * 0.965), int(H * 0.60))
text_img = dark_img.crop(text_box)

text_data = []
for p in text_img.getdata():
    b = max(p[0], p[1], p[2])
    if b < 18:
        text_data.append((p[0], p[1], p[2], 0))
    elif b < 45:
        a = int((b - 18) / (45 - 18) * 255)
        text_data.append((p[0], p[1], p[2], a))
    else:
        text_data.append(p)
text_clean = Image.new("RGBA", text_img.size)
text_clean.putdata(text_data)
text_bbox = text_clean.getbbox()
text_trimmed = text_clean.crop(text_bbox)
text_trimmed.save("public/assets/maxora_text.png", "PNG")

# 3. Assembler avec un CENTRAGE VERTICAL PARFAIT
# On veut que le texte MAXORA soit parfaitement centré sur le corps principal du symbole
ew, eh = emblem_trimmed.size
tw, th = text_trimmed.size

target_h = max(eh, th) + 20
target_w = ew + tw + 24

canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))

# Position de l'emblème
ey = (target_h - eh) // 2
canvas.paste(emblem_trimmed, (0, ey), emblem_trimmed)

# Position du texte MAXORA (parfaitement centré verticalement sur l'emblème)
# Le centre du texte s'aligne exactement sur le centre optique du symbole
ty = ey + int(eh * 0.52) - (th // 2)
canvas.paste(text_trimmed, (ew + 20, ty), text_trimmed)

canvas_bbox = canvas.getbbox()
centered_logo = canvas.crop(canvas_bbox)
centered_logo.save("public/assets/maxora_logo_centered.png", "PNG")
centered_logo.save("public/assets/maxora_logo_transparent.png", "PNG")

print(f"Emblem trimmed: {emblem_trimmed.size}, Text trimmed: {text_trimmed.size}")
print(f"Centered Logo size: {centered_logo.size}")
print("Centered Maxora Logo created successfully!")
