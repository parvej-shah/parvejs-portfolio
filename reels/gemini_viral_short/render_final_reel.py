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
frames_dir = os.path.join(work_dir, "final_frames")
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

# Pre-load authentic assets
diorama_img = Image.open(os.path.join(work_dir, "diorama.jpg")).convert("RGBA")
step1_img = Image.open(os.path.join(work_dir, "gemini_step1_prompt_typed.png")).convert("RGBA")
step2_img = Image.open(os.path.join(work_dir, "gemini_step2_submitting.png")).convert("RGBA")
step3_img = Image.open(os.path.join(work_dir, "gemini_step3_generating.png")).convert("RGBA")
step4_img = Image.open(os.path.join(work_dir, "gemini_step4_video_processing.png")).convert("RGBA")

# Extract center prompt crops from the real browser captures (1920x921)
def get_browser_crop(img, zoom=1.0):
    cx, cy = 1150, 480
    w = int(1220 / zoom)
    h = int(w * (9/16) * 1.35)
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

print(f"Rendering {TOTAL_FRAMES} authentic live Gemini workflow frames...")

for f in range(TOTAL_FRAMES):
    t = f / FPS
    progress = f / (TOTAL_FRAMES - 1)
    
    # 1. Base canvas: Deep futuristic dark gradient
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (10, 13, 24, 255))
    draw = ImageDraw.Draw(frame)
    
    # Tech Grid Lines
    for gy in range(0, HEIGHT, 140):
        draw.line([(0, gy), (WIDTH, gy)], fill=(30, 45, 75, 40), width=1)
    for gx in range(0, WIDTH, 140):
        draw.line([(gx, 0), (gx, HEIGHT)], fill=(30, 45, 75, 40), width=1)
        
    # Top Progress Bar
    bar_width = int(WIDTH * progress)
    draw.rectangle([(0, 0), (WIDTH, 10)], fill=(20, 25, 40, 255))
    draw.rectangle([(0, 0), (bar_width, 10)], fill=(0, 235, 255, 255))
    
    # Top Live URL & Category Pill
    badge_pulse = 0.85 + 0.15 * math.sin(t * 6.0)
    badge_w, badge_h = 540, 64
    bx1 = (WIDTH - badge_w) // 2
    by1 = 65
    draw.rounded_rectangle([(bx1, by1), (bx1 + badge_w, by1 + badge_h)], radius=32, fill=(18, 24, 45, 240), outline=(0, 210, 255, int(255 * badge_pulse)), width=2)
    draw.ellipse([(bx1 + 24, by1 + 24), (bx1 + 40, by1 + 40)], fill=(0, 255, 170, 255))
    draw.text((bx1 + 52, by1 + 18), "gemini.google.com/app • LIVE", font=get_font(25, bold=True), fill=(240, 245, 255, 255))

    # --- SCENE 1: THE DISRUPTION HOOK (0.0s - 2.0s | frames 0 - 60) ---
    if t < 2.0:
        shake = 4 * math.sin(t * 30) if t < 0.4 else 0
        
        font_h1 = get_font(52, bold=True)
        draw_text_centered(draw, "STOP PAYING FOR", 175 + int(shake), font_h1, fill=(255, 255, 255, 255))
        
        font_h2 = get_font(66, bold=True)
        h2_w = 780
        h2_x1 = (WIDTH - h2_w) // 2
        h2_y1 = 250 + int(shake)
        draw.rounded_rectangle([(h2_x1, h2_y1), (h2_x1 + h2_w, h2_y1 + 95)], radius=20, fill=(255, 45, 85, 245), outline=(255, 180, 200, 255), width=3)
        draw_text_centered(draw, "3D ANIMATION 🛑", h2_y1 + 14, font_h2, fill=(255, 255, 255, 255), shadow_color=(80, 0, 20, 220))
        
        font_sub = get_font(38, bold=True)
        draw_text_centered(draw, "Gemini just generated this in 3s 🤯", 370, font_sub, fill=(0, 235, 255, 255))
        
        # Real Gemini Web App Step 1 (Prompt Ready)
        zoom = 1.0 + 0.15 * (t / 2.0)
        crop = get_browser_crop(step1_img, zoom=zoom)
        card_w, card_h = 980, 750
        crop_resized = crop.resize((card_w, card_h), Image.Resampling.LANCZOS)
        
        cx1 = (WIDTH - card_w) // 2
        cy1 = 460
        
        draw.rounded_rectangle([(cx1 - 6, cy1 - 46), (cx1 + card_w + 6, cy1 + card_h + 6)], radius=28, fill=(30, 35, 55, 255), outline=(0, 200, 255, 180), width=3)
        draw.rounded_rectangle([(cx1, cy1 - 40), (cx1 + card_w, cy1)], radius=15, fill=(22, 26, 42, 255))
        draw.ellipse([(cx1 + 20, cy1 - 28), (cx1 + 36, cy1 - 12)], fill=(255, 95, 86, 255))
        draw.ellipse([(cx1 + 46, cy1 - 28), (cx1 + 62, cy1 - 12)], fill=(255, 189, 46, 255))
        draw.ellipse([(cx1 + 72, cy1 - 28), (cx1 + 88, cy1 - 12)], fill=(39, 201, 63, 255))
        draw.text((cx1 + 110, cy1 - 30), "https://gemini.google.com/app", font=get_font(22, bold=False), fill=(160, 180, 210, 255))
        
        frame.paste(crop_resized, (cx1, cy1))
        
        font_cue = get_font(34, bold=True)
        draw_pill(draw, [(WIDTH//2 - 280, HEIGHT - 180), (WIDTH//2 + 280, HEIGHT - 105)], fill=(12, 16, 28, 220), outline=(0, 220, 255, 220), radius=38, width=2)
        draw_text_centered(draw, "Watch The Instant Result 👇", HEIGHT - 158, font_cue, fill=(255, 255, 255, 255))

    # --- SCENE 2: LIVE STEP-BY-STEP PROMPT SUBMISSION & THINKING (2.0s - 4.2s | frames 60 - 126) ---
    elif t < 4.2:
        t_scene2 = t - 2.0
        
        font_h1 = get_font(54, bold=True)
        draw_text_centered(draw, "LIVE ON GEMINI APP ⚡", 165, font_h1, fill=(255, 225, 0, 255), shadow_color=(100, 75, 0, 230))
        
        font_h2 = get_font(34, bold=True)
        draw_text_centered(draw, "Direct Web Interface Generation", 235, font_h2, fill=(180, 215, 255, 255))
        
        # Step switching based on timeline:
        # 2.0s - 2.7s: step1 (Prompt Typed)
        # 2.7s - 3.4s: step3 (Sparkle Thinking)
        # 3.4s - 4.2s: step4 (Video Processing Animation)
        if t_scene2 < 0.7:
            cur_step_img = step1_img
            step_label = "1. TYPING PROMPT INTO GEMINI"
        elif t_scene2 < 1.4:
            cur_step_img = step3_img
            step_label = "2. GEMINI 3.7 MULTI-MODAL REASONING"
        else:
            cur_step_img = step4_img
            step_label = "3. GENERATING 3D ANIMATION..."
            
        zoom = 1.15 + 0.08 * (t_scene2 / 2.2)
        crop = get_browser_crop(cur_step_img, zoom=zoom)
        card_w, card_h = 980, 750
        crop_resized = crop.resize((card_w, card_h), Image.Resampling.LANCZOS)
        
        cx1 = (WIDTH - card_w) // 2
        cy1 = 320
        
        draw.rounded_rectangle([(cx1 - 6, cy1 - 46), (cx1 + card_w + 6, cy1 + card_h + 6)], radius=28, fill=(30, 35, 55, 255), outline=(0, 230, 255, 240), width=3)
        draw.rounded_rectangle([(cx1, cy1 - 40), (cx1 + card_w, cy1)], radius=15, fill=(22, 26, 42, 255))
        draw.ellipse([(cx1 + 20, cy1 - 28), (cx1 + 36, cy1 - 12)], fill=(255, 95, 86, 255))
        draw.ellipse([(cx1 + 46, cy1 - 28), (cx1 + 62, cy1 - 12)], fill=(255, 189, 46, 255))
        draw.ellipse([(cx1 + 72, cy1 - 28), (cx1 + 88, cy1 - 12)], fill=(39, 201, 63, 255))
        draw.text((cx1 + 110, cy1 - 30), "https://gemini.google.com/app", font=get_font(22, bold=False), fill=(0, 230, 255, 255))
        
        frame.paste(crop_resized, (cx1, cy1))
        
        # Step status badge
        ph_y = 1120
        draw.rounded_rectangle([(cx1, ph_y), (cx1 + card_w, ph_y + 110)], radius=25, fill=(18, 24, 45, 245), outline=(0, 230, 255, 220), width=3)
        draw.text((cx1 + 40, ph_y + 20), "CURRENT WORKFLOW:", font=get_font(22, bold=True), fill=(0, 230, 255, 255))
        draw.text((cx1 + 40, ph_y + 55), step_label, font=get_font(30, bold=True), fill=(255, 255, 255, 255))
        
        # Generation progress bar
        gen_prog = min(1.0, t_scene2 / 1.8)
        draw.rounded_rectangle([(cx1, ph_y + 140), (cx1 + card_w, ph_y + 200)], radius=20, fill=(16, 20, 35, 255), outline=(60, 80, 120, 200), width=2)
        draw.rounded_rectangle([(cx1, ph_y + 140), (cx1 + int(card_w * gen_prog), ph_y + 200)], radius=20, fill=(0, 255, 170, 255))
        status_txt = f"⚡ Gemini Neural Pipeline: {int(gen_prog*100)}%" if gen_prog < 1.0 else "✨ RENDERING RESULT"
        draw_text_centered(draw, status_txt, ph_y + 155, get_font(26, bold=True), fill=(10, 15, 25, 255) if gen_prog > 0.4 else (255, 255, 255, 255), shadow_color=None)
        
        # Flash burst on transition
        if t_scene2 > 1.9:
            flash_alpha = int(220 * (1.0 - (4.2 - t) / 0.3))
            flash_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, flash_alpha))
            frame = Image.alpha_composite(frame, flash_overlay)

    # --- SCENE 3: THE MIND-BLOWING REVEAL & CALL-TO-ACTION (4.2s - 7.5s | frames 126 - 225) ---
    else:
        t_scene3 = t - 4.2
        zoom_factor = 1.0 + 0.08 * (t_scene3 / 3.3)
        dw = int(WIDTH * zoom_factor)
        dh = int(dw * (diorama_img.height / diorama_img.width))
        
        diorama_resized = diorama_img.resize((dw, dh), Image.Resampling.LANCZOS)
        
        pan_y = int(t_scene3 * 22)
        crop_x = (dw - WIDTH) // 2
        crop_y = min(dh - HEIGHT, max(0, (dh - HEIGHT) // 2 + pan_y))
        
        diorama_view = diorama_resized.crop((crop_x, crop_y, crop_x + WIDTH, crop_y + HEIGHT))
        frame.paste(diorama_view, (0, 0))
        
        # Gradients
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
        
        # Headline
        font_h1 = get_font(56, bold=True)
        draw_text_centered(draw, "100% GENERATED BY GEMINI 🤯", 175, font_h1, fill=(255, 255, 255, 255), shadow_color=(0, 0, 0, 250))
        
        font_h2 = get_font(38, bold=True)
        draw_text_centered(draw, "NO 3D SOFTWARE NEEDED", 250, font_h2, fill=(0, 235, 255, 255), shadow_color=(0, 0, 0, 250))
        
        # CTA Box
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

print("All final frames rendered successfully!")
