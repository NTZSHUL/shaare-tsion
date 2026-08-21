import re, base64, pathlib

def datauri(p):
    b = pathlib.Path(p).read_bytes()
    return "data:image/jpeg;base64," + base64.b64encode(b).decode()

imgs = {f"{n}.jpg": datauri(f"{n}.jpg") for n in ["synagogue","jardin","rav"]}

def extract(path):
    s = pathlib.Path(path).read_text()
    inner = re.search(r"<x-dc>(.*)</x-dc>", s, re.S).group(1)
    inner = inner.replace("<helmet>","").replace("</helmet>","")
    for k,v in imgs.items():
        inner = inner.replace(f'src="{k}"', f'src="{v}"')
    return inner.strip()

A = extract("Main.dc.html")
B = extract("Heritage.dc.html")
C = extract("Midnight.dc.html")

def block(letter, name, blurb, content):
    return f'''
  <section class="dir">
    <div class="dir-head">
      <span class="dir-tag">Option {letter}</span>
      <div>
        <h2 class="dir-name">{name}</h2>
        <p class="dir-blurb">{blurb}</p>
      </div>
    </div>
    <div class="frame-scroll"><div class="frame">{content}</div></div>
  </section>'''

page = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shaaré Tsion Design Directions</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Karla:wght@400;500;600;700&family=Frank+Ruhl+Libre:wght@400;500;700;900&family=Assistant:wght@400;500;600;700&family=Marcellus&family=Jost:wght@300;400;500&display=swap">
<style>
  :root{{--bg:#e8e4da;--panel:#f4f1ea;--ink:#20242d;--muted:#6c6a62;--line:rgba(30,34,44,.14);--accent:#a97b33;}}
  :root:not([data-theme="light"]){{@media (prefers-color-scheme: dark){{}}}}
  @media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--bg:#15171c;--panel:#1d2027;--ink:#ece7dc;--muted:#9a968b;--line:rgba(255,255,255,.12);--accent:#d9b978;}}}}
  :root[data-theme="dark"]{{--bg:#15171c;--panel:#1d2027;--ink:#ece7dc;--muted:#9a968b;--line:rgba(255,255,255,.12);--accent:#d9b978;}}
  *{{box-sizing:border-box;}}
  body{{margin:0;background:var(--bg);color:var(--ink);font-family:'Karla',system-ui,sans-serif;}}
  .intro{{max-width:840px;margin:0 auto;padding:56px 28px 20px;text-align:center;}}
  .intro .ey{{font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--accent);}}
  .intro h1{{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:46px;margin:.2em 0 .3em;color:var(--ink);text-wrap:balance;}}
  .intro p{{color:var(--muted);font-size:17px;line-height:1.6;margin:0 auto;max-width:600px;}}
  .dir{{max-width:1360px;margin:0 auto;padding:34px 28px;}}
  .dir-head{{display:flex;gap:20px;align-items:flex-start;max-width:1200px;margin:0 auto 18px;}}
  .dir-tag{{flex:none;font-family:'Karla',sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:var(--accent);padding:7px 13px;border-radius:100px;margin-top:4px;}}
  .dir-name{{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:30px;margin:0;color:var(--ink);}}
  .dir-blurb{{margin:2px 0 0;color:var(--muted);font-size:15px;line-height:1.5;max-width:640px;}}
  .frame-scroll{{overflow-x:auto;border:1px solid var(--line);border-radius:14px;box-shadow:0 24px 60px -34px rgba(0,0,0,.4);}}
  .frame{{width:1200px;margin:0 auto;}}
  .frame img{{max-width:none;}}
  .foot{{text-align:center;color:var(--muted);font-size:14px;padding:26px 20px 60px;}}
</style>
</head>
<body>
  <div class="intro">
    <div class="ey">Shaaré Tsion · Refonte</div>
    <h1>Trois directions</h1>
    <p>Trois pistes visuelles pour le nouveau site, avec vos vraies photos et vos horaires. Choisissez celle qui vous parle — je construirai ensuite le site complet dans cette direction.</p>
  </div>
  {block("A","Warm editorial","Clair, raffiné, boutique — une version élevée de votre navy + or + crème actuels. Serif Cormorant, photo en arche.",A)}
  {block("B","Heritage","Pierre de Jérusalem, sensation typographiée, mise en page symétrique encadrée. Frank Ruhl Libre (hébreu + latin), olive + terracotta. Traditionnel et chaleureux.",B)}
  {block("C","Midnight & gold","Sombre, lumineux, solennel. Display Marcellus sur photo tamisée, filets d'or. Dramatique et moderne-luxe.",C)}
  <p class="foot">Dites-moi : A, B ou C — ou un mélange (« le hero de C avec les couleurs de A »).</p>
</body>
</html>'''

pathlib.Path("shul-directions.html").write_text(page)
print("wrote shul-directions.html", len(page), "bytes")
