import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import math

input_path = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\.user_uploaded\media_1787834784495.jpg"
output_path = r"c:\Users\Rostand JK\Desktop\Projet youtube\glow up\public\assets\rostand_maxed_result.jpg"
artifact_output_path = r"C:\Users\Rostand JK\.gemini\antigravity-ide\brain\a445a3ba-9160-4b38-b642-104eec70dd9b\rostand_maxed_result.jpg"

print(f"Chargement de l'image source: {input_path}")
img = cv2.imread(input_path)
if img is None:
    raise ValueError("Impossible de charger l'image")

h, w, c = img.shape
print(f"Dimensions: {w}x{h}")

# ==============================================================================
# ÉTAPE 2 : AMÉLIORATION CIBLÉE GÉOMÉTRIQUE (MESH WARPING SUR JOUES & MÂCHOIRE)
# ==============================================================================
# Coordonnées du visage sur cette photo spécifique :
# Centre du visage : x ≈ 485, y ≈ 520 (dans une image 1024x1024)
face_cx = int(w * 0.475)
face_cy = int(h * 0.51)

# Création de la grille de déformation (Remap)
map_x = np.zeros((h, w), np.float32)
map_y = np.zeros((h, w), np.float32)

for y in range(h):
    for x in range(w):
        map_x[y, x] = x
        map_y[y, x] = y

def apply_radial_warp(map_x, map_y, cx, cy, radius, strength, direction=(0, 0)):
    y_indices, x_indices = np.indices((h, w))
    dx = x_indices - cx
    dy = y_indices - cy
    dist = np.sqrt(dx**2 + dy**2)
    mask = dist < radius
    
    factor = (1 - (dist / radius)) ** 2 * strength
    factor = np.where(mask, factor, 0)
    
    # Déplacement vers le centre + direction
    map_x += (dx * factor * -0.5 + direction[0] * factor * radius * 0.2).astype(np.float32)
    map_y += (dy * factor * -0.5 + direction[1] * factor * radius * 0.2).astype(np.float32)
    return map_x, map_y

# 1. Décongestion Joue Gauche (amincissement vers l'intérieur)
cheek_left_x = int(w * 0.41)
cheek_left_y = int(h * 0.52)
map_x, map_y = apply_radial_warp(map_x, map_y, cheek_left_x, cheek_left_y, int(w * 0.13), 0.16, (0.5, -0.2))

# 2. Décongestion Joue Droite (amincissement vers l'intérieur)
cheek_right_x = int(w * 0.54)
cheek_right_y = int(h * 0.52)
map_x, map_y = apply_radial_warp(map_x, map_y, cheek_right_x, cheek_right_y, int(w * 0.13), 0.16, (-0.5, -0.2))

# 3. Affinement & Sculpture Angle Gonial / Mâchoire
jaw_left_x = int(w * 0.43)
jaw_left_y = int(h * 0.58)
map_x, map_y = apply_radial_warp(map_x, map_y, jaw_left_x, jaw_left_y, int(w * 0.11), 0.14, (0.3, -0.4))

jaw_right_x = int(w * 0.52)
jaw_right_y = int(h * 0.58)
map_x, map_y = apply_radial_warp(map_x, map_y, jaw_right_x, jaw_right_y, int(w * 0.11), 0.14, (-0.3, -0.4))

# 4. Resserrement sous-mentonnier (anti-rétention d'eau)
chin_y = int(h * 0.61)
map_x, map_y = apply_radial_warp(map_x, map_y, face_cx, chin_y, int(w * 0.10), 0.12, (0, -0.5))

# Application du remappage bilinéaire haute fidélité
sculpted = cv2.remap(img, map_x, map_y, interpolation=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

# ==============================================================================
# QUALITÉ DE PEAU & ÉCLAT NATUREL (SAVON NOIR & KARITÉ BRUT)
# ==============================================================================
# Lissage doux sélectif avec préservation des bords et de la texture
smooth_skin = cv2.bilateralFilter(sculpted, d=7, sigmaColor=35, sigmaSpace=35)

# Masque de fusion doux pour le visage
face_mask = np.zeros((h, w), np.float32)
cv2.ellipse(face_mask, (face_cx, int(face_cy + h*0.02)), (int(w*0.16), int(h*0.17)), 0, 0, 360, 1.0, -1)
face_mask = cv2.GaussianBlur(face_mask, (51, 51), 0)
face_mask_3c = np.dstack([face_mask]*3)

# Fusion de la peau lisse sur le visage
skin_enhanced = (smooth_skin * face_mask_3c + sculpted * (1 - face_mask_3c)).astype(np.uint8)

# Rehaussement de l'éclat (luminosité dorée et contraste net du regard)
hsv = cv2.cvtColor(skin_enhanced, cv2.COLOR_BGR2HSV).astype(np.float32)
# Rehaussement léger de la saturation du teint doré
hsv[:, :, 1] *= 1.06
hsv[:, :, 1] = np.clip(hsv[:, :, 1], 0, 255)
# Micro-boost de luminosité sur les pommettes
hsv[:, :, 2] = np.clip(hsv[:, :, 2] * 1.04 + 3, 0, 255)
radiant_bgr = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)

# Netteté et piqué de l'image (regard magnétique & barbe tracée)
gaussian_blur = cv2.GaussianBlur(radiant_bgr, (0, 0), 2.0)
sharpened = cv2.addWeighted(radiant_bgr, 1.35, gaussian_blur, -0.35, 0)

# Enregistrement du résultat final
cv2.imwrite(output_path, sharpened, [cv2.IMWRITE_JPEG_QUALITY, 96])
cv2.imwrite(artifact_output_path, sharpened, [cv2.IMWRITE_JPEG_QUALITY, 96])
print(f"Image Maxée générée avec succès !")
print(f"Fichier sauvegardé dans : {output_path}")
