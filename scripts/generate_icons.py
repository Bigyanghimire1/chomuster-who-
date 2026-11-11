import os
import subprocess
import tempfile
from PIL import Image

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# SVG Mascot Template with Full-Bleed Solid Midnight Background #101225
SVG_FULL_BLEED = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}">
  <rect width="100" height="100" fill="#101225"/>
  <rect x="2" y="2" width="96" height="96" stroke="#262E4C" stroke-width="2" fill="none"/>
  
  <!-- Disguised Fedora Silhouette -->
  <path d="M26 38 C28 20, 72 20, 74 38 Z" fill="#9275FF"/>
  <ellipse cx="50" cy="38" rx="34" ry="7" fill="#7859EA"/>
  <rect x="30" y="34" width="40" height="4" rx="2" fill="#FF6987"/>

  <!-- Mystery Disguise Face / Shades -->
  <circle cx="50" cy="54" r="19" fill="#1D2340" stroke="#363D5B" stroke-width="2"/>
  
  <!-- Dark Cool Sunglasses -->
  <rect x="36" y="47" width="12" height="9" rx="3" fill="#101225" stroke="#9275FF" stroke-width="1.5"/>
  <rect x="52" y="47" width="12" height="9" rx="3" fill="#101225" stroke="#9275FF" stroke-width="1.5"/>
  <line x1="47" y1="51" x2="53" y2="51" stroke="#9275FF" stroke-width="1.5"/>
  
  <!-- Glare reflections in shades -->
  <line x1="38" y1="49" x2="42" y2="49" stroke="#68D9E7" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="54" y1="49" x2="58" y2="49" stroke="#68D9E7" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Suspicious / Smirking Trench Coat Collar & Tie -->
  <path d="M24 88 L 38 68 L 50 78 L 62 68 L 76 88 Z" fill="#262E4C" stroke="#363D5B" stroke-width="2"/>
  <polygon points="50,74 53,84 50,88 47,84" fill="#FF6987"/>
</svg>"""

# Maskable SVG variant with ~75% safe area scale
SVG_MASKABLE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}">
  <rect width="100" height="100" fill="#101225"/>
  
  <g transform="translate(12.5, 12.5) scale(0.75)">
    <!-- Disguised Fedora Silhouette -->
    <path d="M26 38 C28 20, 72 20, 74 38 Z" fill="#9275FF"/>
    <ellipse cx="50" cy="38" rx="34" ry="7" fill="#7859EA"/>
    <rect x="30" y="34" width="40" height="4" rx="2" fill="#FF6987"/>

    <!-- Mystery Disguise Face / Shades -->
    <circle cx="50" cy="54" r="19" fill="#1D2340" stroke="#363D5B" stroke-width="2"/>
    
    <!-- Dark Cool Sunglasses -->
    <rect x="36" y="47" width="12" height="9" rx="3" fill="#101225" stroke="#9275FF" stroke-width="1.5"/>
    <rect x="52" y="47" width="12" height="9" rx="3" fill="#101225" stroke="#9275FF" stroke-width="1.5"/>
    <line x1="47" y1="51" x2="53" y2="51" stroke="#9275FF" stroke-width="1.5"/>
    
    <!-- Glare reflections in shades -->
    <line x1="38" y1="49" x2="42" y2="49" stroke="#68D9E7" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="49" x2="58" y2="49" stroke="#68D9E7" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Suspicious / Smirking Trench Coat Collar & Tie -->
    <path d="M24 88 L 38 68 L 50 78 L 62 68 L 76 88 Z" fill="#262E4C" stroke="#363D5B" stroke-width="2"/>
    <polygon points="50,74 53,84 50,88 47,84" fill="#FF6987"/>
  </g>
</svg>"""

TARGETS = [
    {
        "path": "public/apple-touch-icon.png",
        "size": 180,
        "svg": SVG_FULL_BLEED,
        "desc": "iOS Safari Apple Touch Icon"
    },
    {
        "path": "public/pwa-192x192.png",
        "size": 192,
        "svg": SVG_FULL_BLEED,
        "desc": "Standard PWA Launcher Icon 192"
    },
    {
        "path": "public/pwa-512x512.png",
        "size": 512,
        "svg": SVG_FULL_BLEED,
        "desc": "High-Res PWA Launcher Icon 512"
    },
    {
        "path": "public/pwa-maskable-512x512.png",
        "size": 512,
        "svg": SVG_MASKABLE,
        "desc": "Maskable PWA Icon 512 (Safe Area)"
    },
    {
        "path": "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png",
        "size": 1024,
        "svg": SVG_FULL_BLEED,
        "desc": "Native iOS Universal 1024x1024 App Icon"
    }
]

def render_icon(target):
    size = target["size"]
    out_path = os.path.abspath(target["path"])
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    
    svg_content = target["svg"].format(size=size)
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
html, body {{ width: {size}px; height: {size}px; overflow: hidden; background: #101225; }}
svg {{ width: {size}px; height: {size}px; display: block; }}
</style>
</head>
<body>
{svg_content}
</body>
</html>"""

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        html_path = f.name
        f.write(html_content)

    temp_png = html_path.replace(".html", ".png")

    try:
        cmd = [
            CHROME_PATH,
            "--headless=new",
            "--disable-gpu",
            f"--window-size={size},{size}",
            "--default-background-color=101225",
            f"--screenshot={temp_png}",
            html_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Verify and resize precisely with Pillow
        img = Image.open(temp_png)
        # Ensure exact RGB mode (no alpha channel for Apple App Store icons)
        if img.mode != "RGB":
            img = img.convert("RGB")
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(out_path, format="PNG", optimize=True)
        
        print(f"Generated: {target['path']} ({size}x{size}) - {target['desc']}")
    finally:
        if os.path.exists(html_path):
            os.remove(html_path)
        if os.path.exists(temp_png):
            os.remove(temp_png)

if __name__ == "__main__":
    for t in TARGETS:
        render_icon(t)
    print("All icons successfully generated!")
