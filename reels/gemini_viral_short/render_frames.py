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
ui_img = Image.open(os.path.join(work_dir, "gemini_ui.jpg")).convert("RGBA")

# Helper: Draw rounded rectangle with optional fill and border
def draw_pill(draw, xy, fill=None, outline=None, width=1, radius=20):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

# Helper: Centered text with shadow/glow
def draw_text_centered(draw, text, y, font, fill=(255,255,255,255), shadow_color=(0,0,0,220), shadow_offset=(3,3)):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    x = (WIDTH - w) // 2
    if shadow_color:
        draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=fill)
    return y + h

def draw_text_box(draw, text, x, y, font, fill=(255,255,255,255), shadow_color=(0,0,0,220), shadow_offset=(2,2)):
    if shadow_color:
        draw.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color)
    draw.text((x, y), text, font=font, fill=fill)

print(f"Rendering {TOTAL_FRAMES} frames...")

for f in range(TOTAL_FRAMES):
    t = f / FPS # seconds
    progress = f / (TOTAL_FRAMES - 1)
    
    # 1. Base canvas: Deep futuristic dark gradient
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (10, 13, 24, 255))
    draw = ImageDraw.Draw(frame)
    
    # Subtle animated gradient / ambient light glow
    glow_y = int(HEIGHT * 0.4 + 100 * math.sin(t * 1.5))
    glow_x = int(WIDTH * 0.5 + 150 * math.cos(t * 1.2))
    
    # Draw dark background decorative grid lines
    grid_alpha = 30
    for gy in range(0, HEIGHT, 120):
        draw.line([(0, gy), (WIDTH, gy)], fill=(40, 60, 100, grid_alpha), width=1)
    for gx in range(0, WIDTH, 120):
        draw.line([(gx, 0), (gx, HEIGHT)], fill=(40, 60, 100, grid_alpha), width=1)
        
    # Top Progress Bar (Viewer retention indicator)
    bar_width = int(WIDTH * progress)
    draw.rectangle([(0, 0), (WIDTH, 8)], fill=(30, 40, 60, 255))
    draw.rectangle([(0, 0), (bar_width, 8)], fill=(0, 240, 255, 255))
    
    # Top Category Badge (Always visible, pulsing)
    badge_pulse = 0.85 + 0.15 * math.sin(t * 6.0)
    badge_w, badge_h = 440, 60
    bx1 = (WIDTH - badge_w) // 2
    by1 = 70
    draw.rounded_rectangle([(bx1, by1), (bx1 + badge_w, by1 + badge_h)], radius=30, fill=(18, 24, 45, 230), outline=(0, 210, 255, int(255 * badge_pulse)), width=2)
    
    # Pulsing red/green dot in badge
    draw.ellipse([(bx1 + 25, by1 + 22), (bx1 + 41, by1 + 38)], fill=(0, 255, 170, 255))
    font_badge = get_font(26, bold=True)
    draw.text((bx1 + 55, by1 + 16), "GEMINI 3.7 • 3D VEO HACK", font=font_badge, fill=(240, 245, 255, 255))

    # --- SCENE 1: THE DISRUPTION HOOK (0.0s - 2.2s | frames 0 - 66) ---
    if t < 2.2:
        # Scale phone UI mockup with entry zoom
        scale = 0.95 + 0.05 * (t / 2.2)
        ui_w = int(WIDTH * 0.78 * scale)
        ui_h = int(ui_w * (ui_img.height / ui_img.width))
        resized_ui = ui_img.resize((ui_w, ui_h), Image.Resampling.LANCZOS)
        
        ui_x = (WIDTH - ui_w) // 2
        ui_y = 520
        frame.paste(resized_ui, (ui_x, ui_y), resized_ui)
        
        # Giant Hook Typography (Top Banner)
        # Shake effect on frame 0-15
        shake = 5 * math.sin(t * 30) if t < 0.5 else 0
        
        # Box 1: STOP PAYING FOR
        font_h1 = get_font(52, bold=True)
        draw_text_centered(draw, "STOP PAYING FOR", 190 + int(shake), font_h1, fill=(255, 255, 255, 255))
        
        # Box 2: 3D ANIMATION with glowing banner
        font_h2 = get_font(68, bold=True)
        h2_w = 780
        h2_x1 = (WIDTH - h2_w) // 2
        h2_y1 = 265 + int(shake)
        draw.rounded_rectangle([(h2_x1, h2_y1), (h2_x1 + h2_w, h2_y1 + 95)], radius=20, fill=(255, 45, 85, 240), outline=(255, 180, 200, 255), width=3)
        draw_text_centered(draw, "3D ANIMATION 🛑", h2_y1 + 12, font_h2, fill=(255, 255, 255, 255), shadow_color=(80, 0, 20, 200))
        
        # Sub-hook
        font_sub = get_font(38, bold=True)
        draw_text_centered(draw, "Gemini just made this 100% FREE 🤯", 385, font_sub, fill=(0, 235, 255, 255))
        
        # Bottom cue
        font_cue = get_font(32, bold=True)
        draw_pill(draw, [(WIDTH//2 - 260, HEIGHT - 180), (WIDTH//2 + 260, HEIGHT - 110)], fill=(0, 0, 0, 180), outline=(0, 210, 255, 180), radius=35, width=2)
        draw_text_centered(draw, "Watch the 3-second result 👇", HEIGHT - 162, font_cue, fill=(255, 255, 255, 255))

    # --- SCENE 2: THE PROMPT REVEAL (2.2s - 4.2s | frames 66 - 126) ---
    elif t < 4.2:
        t_scene2 = t - 2.2
        # Dynamic typing effect
        full_prompt = 'Tiny cyberpunk city, tilt-shift, photorealistic 8k'
        chars_to_show = int(len(full_prompt) * min(1.0, t_scene2 / 1.4))
        typed_str = full_prompt[:chars_to_show]
        cursor = " |" if (int(t_scene2 * 8) % 2 == 0) else ""
        
        # Upper Headline
        font_h1 = get_font(56, bold=True)
        draw_text_centered(draw, "THE MAGIC PROMPT ⚡", 180, font_h1, fill=(255, 225, 0, 255), shadow_color=(120, 90, 0, 220))
        
        font_h2 = get_font(36, bold=True)
        draw_text_centered(draw, "Inside gemini.google.com/videos", 255, font_h2, fill=(180, 210, 255, 255))
        
        # Sleek Futuristic Prompt Card
        card_w, card_h = 960, 480
        cx1 = (WIDTH - card_w) // 2
        cy1 = 340
        draw.rounded_rectangle([(cx1, cy1), (cx1 + card_w, cy1 + card_h)], radius=30, fill=(16, 22, 40, 245), outline=(0, 200, 255, 220), width=3)
        
        # Window header
        draw.rounded_rectangle([(cx1, cy1), (cx1 + card_w, cy1 + 70)], radius=30, fill=(24, 32, 58, 255))
        draw.rectangle([(cx1, cy1 + 40), (cx1 + card_w, cy1 + 70)], fill=(24, 32, 58, 255))
        # Window buttons
        draw.ellipse([(cx1 + 25, cy1 + 25), (cx1 + 45, cy1 + 45)], fill=(255, 95, 86, 255))
        draw.ellipse([(cx1 + 55, cy1 + 25), (cx1 + 75, cy1 + 45)], fill=(255, 189, 46, 255))
        draw.ellipse([(cx1 + 85, cy1 + 25), (cx1 + 105, cy1 + 45)], fill=(39, 201, 63, 255))
        
        font_card_head = get_font(28, bold=True)
        draw.text((cx1 + 130, cy1 + 22), "Google Gemini • Veo 3D Engine", font=font_card_head, fill=(200, 220, 255, 255))
        
        # Prompt Box Content
        font_prompt = get_font(38, bold=True)
        # Multiline wrap for typed string
        line1 = typed_str[:25]
        line2 = typed_str[25:] + (cursor if len(typed_str) >= 25 else "")
        if len(typed_str) < 25:
            line1 += cursor
            
        draw.text((cx1 + 50, cy1 + 110), "PROMPT:", font=get_font(28, bold=True), fill=(0, 230, 255, 255))
        draw.text((cx1 + 50, cy1 + 160), f'"{line1}', font=font_prompt, fill=(255, 255, 255, 255))
        if line2:
            draw.text((cx1 + 50, cy1 + 220), f'{line2}"', font=font_prompt, fill=(255, 255, 255, 255))
        elif len(typed_str) < 25:
            draw.text((cx1 + 50 + draw.textlength(f'"{line1}', font=font_prompt), cy1 + 160), '"', font=font_prompt, fill=(255, 255, 255, 255))
            
        # Preset Pill & Render status
        draw.rounded_rectangle([(cx1 + 50, cy1 + 310), (cx1 + 420, cy1 + 375)], radius=20, fill=(35, 45, 80, 255), outline=(120, 150, 220, 150), width=2)
        draw.text((cx1 + 75, cy1 + 328), "STYLE: 3D Tiny World", font=get_font(26, bold=True), fill=(240, 245, 255, 255))
        
        # Generation Render Bar
        gen_prog = min(1.0, t_scene2 / 1.8)
        draw.rounded_rectangle([(cx1 + 50, cy1 + 400), (cx1 + card_w - 50, cy1 + 435)], radius=15, fill=(20, 28, 48, 255))
        draw.rounded_rectangle([(cx1 + 50, cy1 + 400), (cx1 + 50 + int((card_w - 100) * gen_prog), cy1 + 435)], radius=15, fill=(0, 240, 160, 255))
        draw.text((cx1 + 520, cy1 + 328), f"Generating: {int(gen_prog * 100)}%", font=get_font(26, bold=True), fill=(0, 255, 170, 255))
        
        # Preview preview thumbnail popping in at bottom
        if t_scene2 > 0.8:
            thumb_scale = min(1.0, (t_scene2 - 0.8) * 3.0)
            tw = int(880 * thumb_scale)
            th = int(tw * (diorama_img.height / diorama_img.width) * 0.7)
            if tw > 50 and th > 50:
                thumb_crop = diorama_img.crop((0, 100, diorama_img.width, diorama_img.height - 100))
                thumb_resized = thumb_crop.resize((tw, th), Image.Resampling.LANCZOS)
                tx = (WIDTH - tw) // 2
                ty = 880 + (int((1.0 - thumb_scale) * 150))
                frame.paste(thumb_resized, (tx, ty))
                draw.rectangle([(tx, ty), (tx + tw, ty + th)], outline=(0, 240, 255, 255), width=4)

    # --- SCENE 3: THE MIND-BLOWING REVEAL & CALL-TO-ACTION (4.2s - 7.5s | frames 126 - 225) ---
    else:
        t_scene3 = t - 4.2
        # Smooth cinematic camera zoom & slow pan across the 3D diorama
        zoom_factor = 1.0 + 0.08 * (t_scene3 / 3.3)
        dw = int(WIDTH * zoom_factor)
        dh = int(dw * (diorama_img.height / diorama_img.width))
        
        diorama_resized = diorama_img.resize((dw, dh), Image.Resampling.LANCZOS)
        
        # Center crop into 1080x1920
        pan_y = int(t_scene3 * 25) # gentle pan downwards
        crop_x = (dw - WIDTH) // 2
        crop_y = min(dh - HEIGHT, max(0, (dh - HEIGHT) // 2 + pan_y))
        
        diorama_view = diorama_resized.crop((crop_x, crop_y, crop_x + WIDTH, crop_y + HEIGHT))
        frame.paste(diorama_view, (0, 0))
        
        # Vignette & Dark Top/Bottom Gradients for ultra-readable text
        grad_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(grad_overlay)
        # Top gradient
        for y in range(420):
            a = int(220 * (1.0 - y / 420))
            g_draw.line([(0, y), (WIDTH, y)], fill=(8, 12, 22, a))
        # Bottom gradient
        for y in range(HEIGHT - 550, HEIGHT):
            a = int(240 * ((y - (HEIGHT - 550)) / 550))
            g_draw.line([(0, y), (WIDTH, y)], fill=(6, 8, 16, a))
            
        frame = Image.alpha_composite(frame, grad_overlay)
        draw = ImageDraw.Draw(frame)
        
        # Re-draw top badge & progress bar
        draw.rectangle([(0, 0), (bar_width, 8)], fill=(0, 240, 255, 255))
        draw.rounded_rectangle([(bx1, by1), (bx1 + badge_w, by1 + badge_h)], radius=30, fill=(18, 24, 45, 230), outline=(0, 210, 255, int(255 * badge_pulse)), width=2)
        draw.ellipse([(bx1 + 25, by1 + 22), (bx1 + 41, by1 + 38)], fill=(0, 255, 170, 255))
        draw.text((bx1 + 55, by1 + 16), "GEMINI 3.7 • 3D VEO HACK", font=font_badge, fill=(240, 245, 255, 255))
        
        # Floating Particles / Embers
        for i in range(12):
            px = int((i * 97 + t_scene3 * 120) % WIDTH)
            py = int((i * 163 - t_scene3 * 80) % HEIGHT)
            pr = 3 + (i % 4)
            draw.ellipse([(px, py), (px + pr, py + pr)], fill=(0, 240, 255, 160))
            
        # Top Headline
        font_h1 = get_font(56, bold=True)
        draw_text_centered(draw, "100% GENERATED BY GEMINI 🤯", 180, font_h1, fill=(255, 255, 255, 255), shadow_color=(0, 0, 0, 240))
        
        font_h2 = get_font(40, bold=True)
        draw_text_centered(draw, "NO 3D MODELING NEEDED", 255, font_h2, fill=(0, 235, 255, 255), shadow_color=(0, 0, 0, 240))
        
        # Bottom Call to Action (High engagement & retention)
        # Pulsing CTA Box
        cta_pulse = 1.0 + 0.04 * math.sin(t_scene3 * 8.0)
        cta_w = int(920 * cta_pulse)
        cta_h = int(140 * cta_pulse)
        cx1 = (WIDTH - cta_w) // 2
        cy1 = HEIGHT - 420
        draw.rounded_rectangle([(cx1, cy1), (cx1 + cta_w, cy1 + cta_h)], radius=35, fill=(255, 215, 0, 255), outline=(255, 255, 255, 255), width=4)
        
        font_cta = get_font(44, bold=True)
        draw_text_centered(draw, "COMMENT 'PROMPT' TO GET IT 👇", cy1 + int(42 * cta_pulse), font_cta, fill=(15, 15, 20, 255), shadow_color=(255, 255, 255, 120), shadow_offset=(1,1))
        
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

print("All frames rendered successfully!")
