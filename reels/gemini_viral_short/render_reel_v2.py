import os
import sys
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION = 7.5
TOTAL_FRAMES = int(FPS * DURATION) # 225 frames

work_dir = "/media/parvej/68CAB4DDCAB4A9281/Web Projects New/parvejs-portfolio/reels/gemini_viral_short"
frames_dir = os.path.join(work_dir, "frames")
os.makedirs(frames_dir, exist_ok=True)

# Load font paths
bold_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
reg_font_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"

def get_font(size, bold=True):
    path = bold_font_path if bold else reg_font_path
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

# Pre-load assets
diorama_img = Image.open(os.path.join(work_dir, "diorama.jpg")).convert("RGBA")
home_ui = Image.open(os.path.join(work_dir, "gemini_home_screen.png")).convert("RGBA")
active_ui = Image.open(os.path.join(work_dir, "gemini_prompt_active.png")).convert("RGBA")
videos_ui = Image.open(os.path.join(work_dir, "gemini_videos_view.png")).convert("RGBA")

# Extract center prompt crops from the real browser captures (1920x921)
# Center prompt area is roughly x: 450..1750, y: 150..850
def get_browser_crop(img, zoom=1.0):
    # Base center crop focused on prompt container
    cx, cy = 1150, 480
    w = int(1200 / zoom)
    h = int(w * (9/16) * 1.3)
    x1 = max(0, cx - w//2)
    y1 = max(0, cy - h//2)
    x2 = min(img.width, x1 + w)
    y2 = min(img.height, y1 + h)
    crop = img.crop((x1, y1, x2, y2))
    return crop

def draw_pill(draw, xy, fill=None, outline=None, width=1, radius=20):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_text_centered(draw, text, y, font, fill=(255,255,255,255), shadow_color=(0,0,0,230), shadow_offset=(3,3)):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (WIDTH - w) // 2
    if shadow_color:
        draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=fill)
    return y + h

print(f"Rendering {TOTAL_FRAMES} high-authenticity frames...")

for f in range(TOTAL_FRAMES):
    t = f / FPS
    progress = f / (TOTAL_FRAMES - 1)
    
    # 1. Base canvas: Deep futuristic dark gradient (#0a0d18)
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (10, 13, 24, 255))
    draw = ImageDraw.Draw(frame)
    
    # Background subtle tech grid
    for gy in range(0, HEIGHT, 140):
        draw.line([(0, gy), (WIDTH, gy)], fill=(30, 45, 75, 40), width=1)
    for gx in range(0, WIDTH, 140):
        draw.line([(gx, 0), (gx, HEIGHT)], fill=(30, 45, 75, 40), width=1)
        
    # Top Progress Line (Viral retention cue)
    bar_width = int(WIDTH * progress)
    draw.rectangle([(0, 0), (WIDTH, 10)], fill=(20, 25, 40, 255))
    draw.rectangle([(0, 0), (bar_width, 10)], fill=(0, 235, 255, 255))
    
    # Top Live URL & Category Pill
    badge_pulse = 0.85 + 0.15 * math.sin(t * 6.0)
    badge_w, badge_h = 520, 64
    bx1 = (WIDTH - badge_w) // 2
    by1 = 65
    draw.rounded_rectangle([(bx1, by1), (bx1 + badge_w, by1 + badge_h)], radius=32, fill=(18, 24, 45, 240), outline=(0, 210, 255, int(255 * badge_pulse)), width=2)
    draw.ellipse([(bx1 + 24, by1 + 24), (bx1 + 40, by1 + 40)], fill=(0, 255, 170, 255))
    draw.text((bx1 + 52, by1 + 18), "gemini.google.com/app • LIVE", font=get_font(25, bold=True), fill=(240, 245, 255, 255))

    # --- SCENE 1: THE DISRUPTION HOOK (0.0s - 2.3s | frames 0 - 69) ---
    if t < 2.3:
        # Kinetic Typography
        shake = 4 * math.sin(t * 30) if t < 0.4 else 0
        
        font_h1 = get_font(52, bold=True)
        draw_text_centered(draw, "STOP PAYING FOR", 175 + int(shake), font_h1, fill=(255, 255, 255, 255))
        
        # Red/Amber glowing banner
        font_h2 = get_font(66, bold=True)
        h2_w = 780
        h2_x1 = (WIDTH - h2_w) // 2
        h2_y1 = 250 + int(shake)
        draw.rounded_rectangle([(h2_x1, h2_y1), (h2_x1 + h2_w, h2_y1 + 95)], radius=20, fill=(255, 45, 85, 245), outline=(255, 180, 200, 255), width=3)
        draw_text_centered(draw, "3D ANIMATION 🛑", h2_y1 + 14, font_h2, fill=(255, 255, 255, 255), shadow_color=(80, 0, 20, 220))
        
        font_sub = get_font(38, bold=True)
        draw_text_centered(draw, "Gemini 3.7 just made this 100% FREE 🤯", 370, font_sub, fill=(0, 235, 255, 255))
        
        # Real Gemini Web App Screen inside a sleek floating browser window
        zoom = 1.0 + 0.15 * (t / 2.3)
        crop = get_browser_crop(home_ui, zoom=zoom)
        card_w = 980
        card_h = 750
        crop_resized = crop.resize((card_w, card_h), Image.Resampling.LANCZOS)
        
        cx1 = (WIDTH - card_w) // 2
        cy1 = 460
        
        # Browser mockup frame
        draw.rounded_rectangle([(cx1 - 6, cy1 - 46), (cx1 + card_w + 6, cy1 + card_h + 6)], radius=28, fill=(30, 35, 55, 255), outline=(0, 200, 255, 180), width=3)
        # Browser top bar
        draw.rounded_rectangle([(cx1, cy1 - 40), (cx1 + card_w, cy1)], radius=15, fill=(22, 26, 42, 255))
        draw.ellipse([(cx1 + 20, cy1 - 28), (cx1 + 36, cy1 - 12)], fill=(255, 95, 86, 255))
        draw.ellipse([(cx1 + 46, cy1 - 28), (cx1 + 62, cy1 - 12)], fill=(255, 189, 46, 255))
        draw.ellipse([(cx1 + 72, cy1 - 28), (cx1 + 88, cy1 - 12)], fill=(39, 201, 63, 255))
        draw.text((cx1 + 110, cy1 - 30), "https://gemini.google.com/app", font=get_font(22, bold=False), fill=(160, 180, 210, 255))
        
        frame.paste(crop_resized, (cx1, cy1))
        
        # Call to Action cue at bottom
        font_cue = get_font(34, bold=True)
        draw_pill(draw, [(WIDTH//2 - 280, HEIGHT - 180), (WIDTH//2 + 280, HEIGHT - 105)], fill=(12, 16, 28, 220), outline=(0, 220, 255, 220), radius=38, width=2)
        draw_text_centered(draw, "Watch What Happens Next 👇", HEIGHT - 158, font_cue, fill=(255, 255, 255, 255))

    # --- SCENE 2: LIVE PROMPT & GENERATION (2.3s - 4.4s | frames 69 - 132) ---
    elif t < 4.4:
        t_scene2 = t - 2.3
        
        # Upper Headline
        font_h1 = get_font(54, bold=True)
        draw_text_centered(draw, "THE EXACT 3D PROMPT ⚡", 165, font_h1, fill=(255, 225, 0, 255), shadow_color=(100, 75, 0, 230))
        
        font_h2 = get_font(34, bold=True)
        draw_text_centered(draw, "Gemini Veo Engine • 3D Tiny World Preset", 235, font_h2, fill=(180, 215, 255, 255))
        
        # Real Gemini Web App Active Prompt Screen
        zoom = 1.15 + 0.1 * (t_scene2 / 2.1)
        crop = get_browser_crop(active_ui, zoom=zoom)
        card_w = 980
        card_h = 750
        crop_resized = crop.resize((card_w, card_h), Image.Resampling.LANCZOS)
        
        cx1 = (WIDTH - card_w) // 2
        cy1 = 320
        
        draw.rounded_rectangle([(cx1 - 6, cy1 - 46), (cx1 + card_w + 6, cy1 + card_h + 6)], radius=28, fill=(30, 35, 55, 255), outline=(0, 230, 255, 240), width=3)
        draw.rounded_rectangle([(cx1, cy1 - 40), (cx1 + card_w, cy1)], radius=15, fill=(22, 26, 42, 255))
        draw.ellipse([(cx1 + 20, cy1 - 28), (cx1 + 36, cy1 - 12)], fill=(255, 95, 86, 255))
        draw.ellipse([(cx1 + 46, cy1 - 28), (cx1 + 62, cy1 - 12)], fill=(255, 189, 46, 255))
        draw.ellipse([(cx1 + 72, cy1 - 28), (cx1 + 88, cy1 - 12)], fill=(39, 201, 63, 255))
        draw.text((cx1 + 110, cy1 - 30), "https://gemini.google.com/app (Prompt Active)", font=get_font(22, bold=False), fill=(0, 230, 255, 255))
        
        frame.paste(crop_resized, (cx1, cy1))
        
        # Live Prompt Highlight Card
        font_prompt = get_font(32, bold=True)
        ph_y = 1120
        draw.rounded_rectangle([(cx1, ph_y), (cx1 + card_w, ph_y + 200)], radius=25, fill=(18, 24, 45, 245), outline=(0, 230, 255, 220), width=3)
        draw.text((cx1 + 40, ph_y + 25), "PROMPT APPLIED:", font=get_font(24, bold=True), fill=(0, 230, 255, 255))
        draw.text((cx1 + 40, ph_y + 65), '"Tiny isometric cyberpunk diorama,', font=font_prompt, fill=(255, 255, 255, 255))
        draw.text((cx1 + 40, ph_y + 115), ' tilt-shift, photorealistic 8K"', font=font_prompt, fill=(255, 230, 100, 255))
        
        # Generation Progress Bar
        gen_prog = min(1.0, t_scene2 / 1.7)
        draw.rounded_rectangle([(cx1, ph_y + 230), (cx1 + card_w, ph_y + 290)], radius=20, fill=(16, 20, 35, 255), outline=(60, 80, 120, 200), width=2)
        draw.rounded_rectangle([(cx1, ph_y + 230), (cx1 + int(card_w * gen_prog), ph_y + 290)], radius=20, fill=(0, 255, 170, 255))
        status_txt = f"⚡ Gemini 3.7 Rendering: {int(gen_prog*100)}%" if gen_prog < 1.0 else "✨ RENDER COMPLETE (Instant)"
        draw_text_centered(draw, status_txt, ph_y + 245, get_font(26, bold=True), fill=(10, 15, 25, 255) if gen_prog > 0.4 else (255, 255, 255, 255), shadow_color=None)
        
        # Flash burst on transition (around frame 125 ~ 4.1s)
        if t_scene2 > 1.8:
            flash_alpha = int(200 * (1.0 - (4.4 - t) / 0.3))
            flash_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, flash_alpha))
            frame = Image.alpha_composite(frame, flash_overlay)

    # --- SCENE 3: THE MIND-BLOWING REVEAL & CALL-TO-ACTION (4.4s - 7.5s | frames 132 - 225) ---
    else:
        t_scene3 = t - 4.4
        # Slow cinematic camera zoom & pan across the 3D diorama
        zoom_factor = 1.0 + 0.08 * (t_scene3 / 3.1)
        dw = int(WIDTH * zoom_factor)
        dh = int(dw * (diorama_img.height / diorama_img.width))
        
        diorama_resized = diorama_img.resize((dw, dh), Image.Resampling.LANCZOS)
        
        # Center crop into 1080x1920
        pan_y = int(t_scene3 * 22)
        crop_x = (dw - WIDTH) // 2
        crop_y = min(dh - HEIGHT, max(0, (dh - HEIGHT) // 2 + pan_y))
        
        diorama_view = diorama_resized.crop((crop_x, crop_y, crop_x + WIDTH, crop_y + HEIGHT))
        frame.paste(diorama_view, (0, 0))
        
        # Dark Gradients for readability
        grad_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(grad_overlay)
        for y in range(430):
            a = int(220 * (1.0 - y / 430))
            g_draw.line([(0, y), (WIDTH, y)], fill=(8, 12, 22, a))
        for y in range(HEIGHT - 550, HEIGHT):
            a = int(240 * ((y - (HEIGHT - 550)) / 550))
            g_draw.line([(0, y), (WIDTH, y)], fill=(6, 8, 16, a))
            
        frame = Image.alpha_composite(frame, grad_overlay)
        draw = ImageDraw.Draw(frame)
        
        # Progress bar & badge
        draw.rectangle([(0, 0), (bar_width, 10)], fill=(0, 235, 255, 255))
        draw.rounded_rectangle([(bx1, by1), (bx1 + badge_w, by1 + badge_h)], radius=32, fill=(18, 24, 45, 240), outline=(0, 210, 255, int(255 * badge_pulse)), width=2)
        draw.ellipse([(bx1 + 24, by1 + 24), (bx1 + 40, by1 + 40)], fill=(0, 255, 170, 255))
        draw.text((bx1 + 52, by1 + 18), "gemini.google.com/app • LIVE", font=get_font(25, bold=True), fill=(240, 245, 255, 255))
        
        # Floating Bokeh
        for i in range(12):
            px = int((i * 97 + t_scene3 * 110) % WIDTH)
            py = int((i * 163 - t_scene3 * 75) % HEIGHT)
            pr = 3 + (i % 4)
            draw.ellipse([(px, py), (px + pr, py + pr)], fill=(0, 240, 255, 160))
            
        # Top Headline
        font_h1 = get_font(56, bold=True)
        draw_text_centered(draw, "100% GENERATED BY GEMINI 🤯", 175, font_h1, fill=(255, 255, 255, 255), shadow_color=(0, 0, 0, 250))
        
        font_h2 = get_font(38, bold=True)
        draw_text_centered(draw, "NO 3D SOFTWARE NEEDED", 250, font_h2, fill=(0, 235, 255, 255), shadow_color=(0, 0, 0, 250))
        
        # High Converting CTA Box
        cta_pulse = 1.0 + 0.04 * math.sin(t_scene3 * 8.0)
        cta_w = int(920 * cta_pulse)
        cta_h = int(140 * cta_pulse)
        cx1 = (WIDTH - cta_w) // 2
        cy1 = HEIGHT - 420
        draw.rounded_rectangle([(cx1, cy1), (cx1 + cta_w, cy1 + cta_h)], radius=35, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=4)
        
        font_cta = get_font(42, bold=True)
        draw_text_centered(draw, "COMMENT 'PROMPT' FOR PRESET 👇", cy1 + int(42 * cta_pulse), font_cta, fill=(15, 15, 20, 255), shadow_color=(255, 255, 255, 120), shadow_offset=(1,1))
        
        # Creator Watermark & Subscribe Hook
        font_handle = get_font(34, bold=True)
        draw_pill(draw, [(WIDTH//2 - 380, HEIGHT - 220), (WIDTH//2 + 380, HEIGHT - 145)], fill=(12, 16, 28, 230), outline=(0, 210, 255, 200), radius=35, width=2)
        draw_text_centered(draw, "Follow @parvejshahlabib9167 for AI Hacks", HEIGHT - 192, font_handle, fill=(240, 245, 255, 255))
        
        # Seamless loop transition on final 5 frames
        if f >= TOTAL_FRAMES - 5:
            fade_alpha = int(255 * (f - (TOTAL_FRAMES - 5)) / 5)
            fade_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (10, 13, 24, fade_alpha))
            frame = Image.alpha_composite(frame, fade_overlay)
            
    # Save frame
    frame_path = os.path.join(frames_dir, f"frame_{f:04d}.png")
    frame.convert("RGB").save(frame_path, "PNG")

print("All v2 frames rendered successfully!")
