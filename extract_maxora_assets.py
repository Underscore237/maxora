import os
from PIL import Image

uploaded_dir = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\.user_uploaded"
dark_img_path = os.path.join(uploaded_dir, "media_1787742816041.png")
white_img_path = os.path.join(uploaded_dir, "media_1787742816057.png")

dark_img = Image.open(dark_img_path).convert("RGBA")
W, H = dark_img.size

# 1. Icône Carrée Arrondie (App Icon & Favicon)
# Découpe centrée sur l'icône de gauche
icon_crop = dark_img.crop((int(W * 0.03), int(H * 0.26), int(W * 0.32), int(H * 0.72)))
app_icon_512 = icon_crop.resize((512, 512), Image.Resampling.LANCZOS)
app_icon_512.save("public/assets/maxora_app_icon.png", "PNG")
app_icon_512.resize((192, 192), Image.Resampling.LANCZOS).save("public/assets/maxora_icon_192.png", "PNG")
app_icon_512.resize((64, 64), Image.Resampling.LANCZOS).save("public/favicon.png", "PNG")
app_icon_512.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon.ico", "ICO")

# 2. Logo Horizontal Complet MAXORA (Emblème + Typographie)
logo_crop = dark_img.crop((int(W * 0.355), int(H * 0.33), int(W * 0.965), int(H * 0.64)))
logo_crop.save("public/assets/maxora_logo.png", "PNG")

# 3. Logo Transparent (Fond noir converti en transparence propre pour fusion parfaite dans le header)
datas = logo_crop.getdata()
new_data = []
for item in datas:
    # Si le pixel est presque noir (fond sombre #050608), on le rend transparent avec fondu
    brightness = max(item[0], item[1], item[2])
    if brightness < 18:
        new_data.append((item[0], item[1], item[2], 0))
    elif brightness < 40:
        alpha = int((brightness - 18) / (40 - 18) * 255)
        new_data.append((item[0], item[1], item[2], alpha))
    else:
        new_data.append(item)

logo_transparent = Image.new("RGBA", logo_crop.size)
logo_transparent.putdata(new_data)
logo_transparent.save("public/assets/maxora_logo_transparent.png", "PNG")

# 4. Emblème seul transparent
emblem_crop = dark_img.crop((int(W * 0.355), int(H * 0.33), int(W * 0.485), int(H * 0.64)))
emblem_datas = emblem_crop.getdata()
new_emblem_data = []
for item in emblem_datas:
    brightness = max(item[0], item[1], item[2])
    if brightness < 18:
        new_emblem_data.append((item[0], item[1], item[2], 0))
    elif brightness < 40:
        alpha = int((brightness - 18) / (40 - 18) * 255)
        new_emblem_data.append((item[0], item[1], item[2], alpha))
    else:
        new_emblem_data.append(item)

emblem_transparent = Image.new("RGBA", emblem_crop.size)
emblem_transparent.putdata(new_emblem_data)
emblem_transparent.save("public/assets/maxora_emblem.png", "PNG")

print("All clean transparent Maxora assets generated successfully!")
