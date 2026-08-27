from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import math

input_path = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\.user_uploaded\media_1787834784495.jpg"
output_path = r"c:\Users\Rostand JK\Desktop\Projet youtube\glow up\public\assets\rostand_maxed_result.jpg"
artifact_output_path = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\rostand_maxed_result.jpg"

print("Chargement de l'image source avec PIL...")
img = Image.open(input_path).convert('RGB')
w, h = img.size
print(f"Image chargée: {w}x{h}")

# Déformation bilinéaire sur le maillage (Mesh deformation)
# Décongestion des joues et sculpture mandibulaire
mesh = []
grid_size = 32
dx_step = w / grid_size
dy_step = h / grid_size

# Centre du visage
cx = w * 0.48
cy = h * 0.52

# Création du maillage de déformation
quads = []
for i in range(grid_size):
    for j in range(grid_size):
        x1 = i * dx_step
        y1 = j * dy_step
        x2 = (i + 1) * dx_step
        y2 = (j + 1) * dy_step
        
        # Fonction de déformation
        def warp_pt(px, py):
            # Décongestion joue gauche
            d_left = math.hypot(px - (w * 0.41), py - (h * 0.53))
            if d_left < w * 0.14:
                factor = (1.0 - (d_left / (w * 0.14))) ** 2
                px += factor * (w * 0.022) # vers l'intérieur droit
                py -= factor * (h * 0.008) # léger lift
            
            # Décongestion joue droite
            d_right = math.hypot(px - (w * 0.55), py - (h * 0.53))
            if d_right < w * 0.14:
                factor = (1.0 - (d_right / (w * 0.14))) ** 2
                px -= factor * (w * 0.022) # vers l'intérieur gauche
                py -= factor * (h * 0.008)
                
            # Resserrement angle mandibulaire & sous-menton
            d_chin = math.hypot(px - cx, py - (h * 0.60))
            if d_chin < w * 0.12:
                factor = (1.0 - (d_chin / (w * 0.12))) ** 2
                py -= factor * (h * 0.012)
            
            return px, py
        
        src_box = (int(x1), int(y1), int(x2), int(y2))
        wx1, wy1 = warp_pt(x1, y1)
        wx2, wy2 = warp_pt(x2, y1)
        wx3, wy3 = warp_pt(x2, y2)
        wx4, wy4 = warp_pt(x1, y2)
        
        quads.append((src_box, (wx1, wy1, wx4, wy4, wx3, wy3, wx2, wy1)))

sculpted_img = img.transform((w, h), Image.MESH, quads, resample=Image.BICUBIC)

# ==============================================================================
# AMÉLIORATION DU TEINT, NETTETÉ ET ÉCLAT
# ==============================================================================
# 1. Éclat et hydratation (Teint riche, chaleureux et vibrant)
color_enhancer = ImageEnhance.Color(sculpted_img)
vibrant_img = color_enhancer.enhance(1.08)

# 2. Contraste lumineux et relief des pommettes
contrast_enhancer = ImageEnhance.Contrast(vibrant_img)
contrasted_img = contrast_enhancer.enhance(1.07)

# 3. Luminosité satinée douce
bright_enhancer = ImageEnhance.Brightness(contrasted_img)
bright_img = bright_enhancer.enhance(1.04)

# 4. Netteté cristalline (Regard intense, traçage barbe et détails)
sharp_enhancer = ImageEnhance.Sharpness(bright_img)
final_img = sharp_enhancer.enhance(1.45)

# Sauvegarde
final_img.save(output_path, quality=96)
final_img.save(artifact_output_path, quality=96)

print("Traitement terminé avec succès !")
print(f"Image enregistrée: {output_path}")
