import sys
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 620
DARK = (55, 3, 59)
S = sys.argv[1]
def build(photo_path, crop_box, lines, out, eyebrow):
    photo = Image.open(photo_path).convert('RGB').crop(crop_box)
    scale = H / photo.height
    photo = photo.resize((round(photo.width * scale), H), Image.LANCZOS)
    x0 = W - photo.width + 30
    bg = Image.new('RGB', (W, H)); d0 = ImageDraw.Draw(bg)
    col = photo.crop((0, 0, 3, H)).resize((1, H))
    for y in range(H):
        d0.line([(0, y), (W, y)], fill=col.getpixel((0, y)))
    tint = Image.new('RGB', (W, H), (164, 96, 170))
    tm = Image.new('L', (W, H), 0); dt = ImageDraw.Draw(tm)
    for x in range(max(1, x0 - 40)):
        dt.line([(x, 0), (x, H)], fill=int(115 * (1 - x / (x0 - 40)) ** 1.2))
    bg = Image.composite(tint, bg, tm)
    mask = Image.new('L', photo.size, 255); dm = ImageDraw.Draw(mask)
    fe = 45
    for x in range(fe):
        dm.line([(x, 0), (x, H)], fill=int(255 * (x / fe)))
    bg.paste(photo, (x0, 0), mask)
    d = ImageDraw.Draw(bg)
    def jos(size, w):
        f = ImageFont.truetype(f'{S}/fonts/JosefinSans[wght].ttf', size); f.set_variation_by_name(w); return f
    ser = ImageFont.truetype(f'{S}/fonts/InstrumentSerif-Italic.ttf', 118)
    logo = Image.open(f'{S}/cluma-logo-white@2x.png').convert('RGBA')
    lh = 50; logo = logo.resize((round(logo.width * lh / logo.height), lh), Image.LANCZOS)
    a = logo.split()[3]; dark = Image.new('RGBA', logo.size, DARK + (255,)); dark.putalpha(a)
    bg.paste(dark, (72, 64), dark)
    small = jos(26, 'SemiBold'); x = 74
    for ch in eyebrow:
        d.text((x, 214), ch, font=small, fill=DARK); x += small.getlength(ch) + 4
    d.text((70, 262), lines[0], font=jos(92, 'Regular'), fill=DARK)
    d.text((66, 352), lines[1], font=ser, fill=DARK)
    rad = 32; corner = Image.new('L', (W, H), 0); cd = ImageDraw.Draw(corner)
    cd.rounded_rectangle([0, 0, W, H + rad], radius=rad, fill=255)
    Image.composite(bg, Image.new('RGB', (W, H), (245, 245, 245)), corner).save(out, quality=88, optimize=True, progressive=True)
M = '/Users/chris/code/cluma-assets/monsters'
build(f'{M}/flicker/flicker-01.jpg', (60, 90, 1120, 990), ('Welcome to', 'Cluma.'), f'{S}/hero-welcome-en.jpg', 'PAYMENT RECEIVED')
