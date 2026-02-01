from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

def create_gradient_avatar(filename="avatar.png", size=(512, 512)):
    # 1. Create Base Image
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 2. Draw Gradient Background (Rounded Rect)
    # Colors: #B71C1C -> #D32F2F -> #FF5252 (Red Gradient)
    start_color = (183, 28, 28)
    end_color = (255, 82, 82)
    
    # Create gradient
    gradient = Image.new('RGBA', size, color=0)
    g_draw = ImageDraw.Draw(gradient)
    for y in range(size[1]):
        r = int(start_color[0] + (end_color[0] - start_color[0]) * y / size[1])
        g = int(start_color[1] + (end_color[1] - start_color[1]) * y / size[1])
        b = int(start_color[2] + (end_color[2] - start_color[2]) * y / size[1])
        g_draw.line([(0, y), (size[0], y)], fill=(r, g, b, 255))
        
    # Mask for rounded corners
    mask = Image.new('L', size, 0)
    m_draw = ImageDraw.Draw(mask)
    radius = 120
    m_draw.rounded_rectangle([(0,0), size], radius=radius, fill=255)
    
    # Apply gradient with mask
    img.paste(gradient, (0,0), mask)
    draw = ImageDraw.Draw(img) # Re-get draw for img
    
    # 3. Add Texture/Decoration
    # Gold Circle
    gold = (255, 215, 0)
    margin = 40
    draw.ellipse((margin, margin, size[0]-margin, size[1]-margin), outline=(255, 236, 179, 100), width=4)
    
    # 4. Draw Center Text "春" (Spring)
    text = "春"
    
    # Load Font
    try:
        # Try finding a font that supports Chinese
        font_paths = [
            "msyh.ttc", "simhei.ttf", "arialuni.ttf", 
            "/System/Library/Fonts/PingFang.ttc",
            "C:\\Windows\\Fonts\\msyh.ttc"
        ]
        font = None
        for path in font_paths:
            try:
                font = ImageFont.truetype(path, 280)
                break
            except:
                continue
        if not font:
             font = ImageFont.load_default()
             print("Warning: Chinese font not found, using default.")
    except Exception as e:
        print(f"Font loading error: {e}")
        font = ImageFont.load_default()

    # Center Text
    try:
        left, top, right, bottom = font.getbbox(text)
        w = right - left
        h = bottom - top
    except:
        w, h = draw.textsize(text, font=font)
        
    x = (size[0] - w) / 2
    y = (size[1] - h) / 2 - (size[1] * 0.08) # Move up slightly

    # Draw Shadow
    draw.text((x+4, y+4), text, font=font, fill=(0,0,0, 40))
    # Draw Text
    draw.text((x, y), text, font=font, fill=gold)
    
    # 5. Add "攻略" smaller text below
    sub_text = "攻略"
    try:
        sub_font = ImageFont.truetype(font.path, 100)
    except:
        sub_font = font
        
    try:
        sl, st, sr, sb = sub_font.getbbox(sub_text)
        sw = sr - sl
        sh = sb - st
    except:
        sw, sh = draw.textsize(sub_text, font=sub_font)
        
    sx = (size[0] - sw) / 2
    sy = y + h + 20
    
    draw.text((sx, sy), sub_text, font=sub_font, fill=(255, 255, 255, 230))

    # 6. Save
    output_dir = 'images'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, filename)
    img.save(output_path)
    print(f"Generated avatar at {output_path}")

if __name__ == "__main__":
    create_gradient_avatar()
