"""Renders the Cluma email images (brand fonts baked in, because Gmail ignores web fonts)."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = sys.argv[1]
WHITE = (255, 255, 255); DARK = (55, 3, 59); PAGE = (245, 245, 245)
def jos(size, w='Regular'):
    f = ImageFont.truetype(f'{S}/fonts/JosefinSans[wght].ttf', size); f.set_variation_by_name(w); return f
def ser(size): return ImageFont.truetype(f'{S}/fonts/InstrumentSerif-Italic.ttf', size)

def gradient(W, H):
    # website: linear-gradient(135deg, #a460aabf 40%, #ffb4ba) on #f5f5f5
    a = (184, 133, 189); b = (255, 180, 186)
    g = Image.new('RGB', (W, H)); px = g.load()
    for y in range(H):
        for x in range(W):
            t = (x / W * 0.55 + y / H * 0.45)
            t = max(0.0, (t - 0.40) / 0.60)
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return g

def rounded(img, rad, bg=PAGE):
    m = Image.new('L', img.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius=rad, fill=255)
    return Image.composite(img, Image.new('RGB', img.size, bg), m)

def hero(cut, eyebrow, line1, accent, sub, out, mon_h=400):
    W, H = 1200, 560
    img = gradient(W, H)
    mon = Image.open(f'{S}/{cut}').convert('RGBA')
    mon = mon.resize((round(mon.width * mon_h / mon.height), mon_h), Image.LANCZOS)
    mx = W - mon.width - 50; my = H - mon.height - 44
    sh = Image.new('L', (W, H), 0)
    ImageDraw.Draw(sh).ellipse([mx + mon.width * 0.12, my + mon.height - 22, mx + mon.width * 0.92, my + mon.height + 22], fill=90)
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    img = Image.composite(Image.new('RGB', (W, H), (120, 60, 110)), img, sh)
    img.paste(mon, (mx, my), mon)
    d = ImageDraw.Draw(img)
    logo = Image.open(f'{S}/cluma-logo-white@2x.png').convert('RGBA')
    lh = 48; logo = logo.resize((round(logo.width * lh / logo.height), lh), Image.LANCZOS)
    img.paste(logo, (72, 64), logo)
    f = jos(30, 'SemiBold'); x = 74
    for ch in eyebrow:
        d.text((x, 186), ch, font=f, fill=WHITE); x += f.getlength(ch) + 5
    size = 112
    d.text((66, 332), line1.strip(), font=jos(size), fill=WHITE, anchor='ls')
    d.text((62, 450), accent, font=ser(round(size * 0.95)), fill=WHITE, anchor='ls')
    rounded(img, 32).save(f'{S}/{out}', quality=88, optimize=True, progressive=True)

def heading(parts, out, size=52):
    j = jos(size, 'Medium'); sr = ser(round(size * 0.95))
    w = int(sum((j if k == 'j' else sr).getlength(t) for t, k in parts)) + 8
    img = Image.new('RGB', (w, 80), PAGE); d = ImageDraw.Draw(img); x = 0
    for t, k in parts:
        f = j if k == 'j' else sr
        d.text((x, 60), t, font=f, fill=DARK, anchor='ls'); x += f.getlength(t)
    img.save(f'{S}/{out}', optimize=True); return img.size

def signature(out):
    f = ser(58); w = int(f.getlength('Christoph Bogatzki')) + 8
    img = Image.new('RGB', (w, 76), PAGE); ImageDraw.Draw(img).text((0, 58), 'Christoph Bogatzki', font=f, fill=DARK, anchor='ls')
    img.save(f'{S}/{out}', optimize=True); return img.size

def step_node(n, out):
    # white square tile like the website's process nodes, numeral like the stats sections
    W = 112; img = Image.new('RGB', (W, W), PAGE)
    sh = Image.new('L', (W, W), 0); ImageDraw.Draw(sh).rounded_rectangle([10, 12, W - 8, W - 6], radius=20, fill=40)
    sh = sh.filter(ImageFilter.GaussianBlur(5))
    img = Image.composite(Image.new('RGB', (W, W), (200, 190, 205)), img, sh)
    ImageDraw.Draw(img).rounded_rectangle([8, 8, W - 10, W - 10], radius=20, fill=WHITE)
    ImageDraw.Draw(img).text(((W - 2) / 2, (W - 2) / 2 + 2), n, font=ser(56), fill=DARK, anchor='mm')
    img.save(f'{S}/{out}', optimize=True)

if __name__ == '__main__':
    for n in ('01', '02', '03'):
        step_node(n, f'step-{n}.png')
    hero('flicker-cut.png', 'PAYMENT RECEIVED', 'Welcome to', 'Cluma.', [], 'hero-welcome-en.jpg')
    print(heading([('What happens ', 'j'), ('next', 's')], 'h-next-en.png'))
    print(signature('signature.png'))
