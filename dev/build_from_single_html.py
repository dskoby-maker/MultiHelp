import re, json, base64, io, sys
from PIL import Image, ImageDraw, ImageFont
src = open('/home/claude/multihelp-site/index.html', encoding='utf-8').read()
out = '/home/claude/multihelp-repo'
style = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
scripts = re.findall(r'<script>(.*?)</script>', src, re.S)
cfg, main = scripts[0], scripts[1]
body = re.search(r'<body>\s*(.*?)\s*<script>', src, re.S).group(1)
cfg = cfg.replace('window.MULTIHELP = {', 'window.MULTIHELP = window.MULTIHELP || {')
# root wrapper: cover the whole viewport inside Tilda / any host page
style = style.replace('html,body{margin:0;height:100%}', 'html,body{margin:0;height:100%}\n  #mh-root{position:fixed;inset:0;z-index:9990;overflow:hidden;background:var(--bg);font-family:\'Jost\',system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased;text-align:left;line-height:normal}\n  #mh-root *{box-sizing:border-box}')
style = style.replace('*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}', '#mh-root *{-webkit-tap-highlight-color:transparent}')
style = style.replace('@media (min-width:760px){\n    body{background:#e9e8e4}', '@media (min-width:760px){\n    body,#mh-root{background:#e9e8e4}')
style = style.replace('body{background:#161616}', 'body,#mh-root{background:#161616}')
icon = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', src).group(1)
app = f"""/* MultiHelp — сайт-каталог мастеров. Этот файл подгружают Тильда (multihelp.es) и GitHub Pages.
   Правки делаются здесь, в репозитории; Тильду трогать не нужно. */
(function(){{
if (window.__mhLoaded) return; window.__mhLoaded = true;
{cfg}
var root = document.getElementById('mh-root');
if (!root) {{ root = document.createElement('div'); root.id = 'mh-root'; document.body.appendChild(root); }}
var head = document.head;
function add(tag, attrs){{ var e = document.createElement(tag); for (var k in attrs) e.setAttribute(k, attrs[k]); head.appendChild(e); return e; }}
if (!document.querySelector('meta[name=viewport]')) add('meta', {{name:'viewport', content:'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1'}});
add('link', {{rel:'preconnect', href:'https://fonts.googleapis.com'}});
add('link', {{rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap'}});
var st = document.createElement('style'); st.textContent = {json.dumps(style, ensure_ascii=False)}; head.appendChild(st);
root.innerHTML = {json.dumps(body, ensure_ascii=False)};
{main}
}})();
"""
open(f'{out}/app.js','w',encoding='utf-8').write(app)
# icons
def make(size, pad=0.0, path=None):
    im = Image.new('RGB',(size,size),'#0b0b0b'); d = ImageDraw.Draw(im)
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf', int(size*0.66*(1-pad)))
    b = d.textbbox((0,0),'M',font=f); w=b[2]-b[0]; h=b[3]-b[1]
    d.text(((size-w)/2-b[0],(size-h)/2-b[1]),'M',fill='white',font=f); im.save(path, optimize=True)
make(192, path=f'{out}/icon-192.png'); make(512, path=f'{out}/icon-512.png'); make(512, pad=0.25, path=f'{out}/icon-maskable-512.png'); make(180, path=f'{out}/apple-touch-icon.png'); make(64, path=f'{out}/favicon.png')
ver = sys.argv[1] if len(sys.argv)>1 else 'dev'
meta = re.search(r'(<meta name="description".*?)<link rel="apple-touch-icon"', src, re.S).group(1)
index = f"""<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1">{meta}<link rel="manifest" href="manifest.webmanifest"><link rel="icon" type="image/png" href="favicon.png"><link rel="apple-touch-icon" href="apple-touch-icon.png"><title>MultiHelp — специалисты рядом</title></head><body style="margin:0;background:#fff"><div id="mh-root"></div><script src="app.js?v={ver}"></script></body></html>
"""
open(f'{out}/index.html','w',encoding='utf-8').write(index)
manifest = {"name":"MultiHelp","short_name":"MultiHelp","description":"Мастера и специалисты рядом с вами в Испании","start_url":"./","scope":"./","display":"standalone","background_color":"#ffffff","theme_color":"#0b0b0b","lang":"es","icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
open(f'{out}/manifest.webmanifest','w').write(json.dumps(manifest, ensure_ascii=False, indent=2))
print('ok', len(app))
