from PIL import Image, ImageDraw, ImageFont
import os

if not os.path.exists('images'): os.makedirs('images')

def create_img(path, text, color, shape='circle'):
    img = Image.new('RGBA', (200, 200), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    if shape == 'circle': draw.ellipse([10, 10, 190, 190], fill=color)
    else: draw.rectangle([10, 10, 190, 190], fill=color)
    draw.text((100, 100), text, fill="white", anchor="mm")
    # Sauvegarde selon l'extension demandée
    img.convert('RGB').save(path) if 'png' not in path else img.save(path)

# Logos (Extensions spécifiques)
create_img('logo-premier-league.png', 'PL', '#3d195b', 'rect')
create_img('logo-laliga.png', 'LIGA', '#ff4b4b', 'rect')
create_img('logo-bundesliga.png', 'BUN', '#d20222', 'rect')
create_img('logo-ligue1.jpg', 'L1', '#dae025', 'rect')
create_img('logo-seriea.jpeg', 'SA', '#003399', 'rect')

# Joueurs (Extensions spécifiques)
create_img('player-gyokeres.jpeg', 'VG', '#38bdf8')
create_img('player-mbappe.jpeg', 'KM', '#38bdf8')
create_img('player-salah.jpg', 'MS', '#38bdf8')
create_img('player-kane.jpeg', 'HK', '#38bdf8')
create_img('player-lewandowski.jpeg', 'RL', '#38bdf8')

# Fond de stade
stadium = Image.new('RGB', (1920, 1080), color='#0f172a')
stadium.save('fond de stade.jpg')

print("Images générées avec les bonnes extensions !")