from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

def create_rounded_icon(filename, text, bg_color, text_color=(255, 255, 255), size=(200, 200)):
    # Create image
    img = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle (circle if radius is half size)
    # Background
    draw.ellipse((0, 0, size[0], size[1]), fill=bg_color)
    
    # Add subtle gradient/shading by drawing a lighter circle on top-left? 
    # Keep it simple flat for now but premium colors
    
    # Draw text
    # Try to load a font, fallback to default
    try:
        font = ImageFont.truetype("msyh.ttc", 100)
    except:
        try:
             font = ImageFont.truetype("arial.ttf", 80)
        except:
             font = ImageFont.load_default()

    # Get text size using getbbox (more accurate for modern Pillow)
    try:
        left, top, right, bottom = font.getbbox(text)
        text_width = right - left
        text_height = bottom - top
    except:
        # Fallback for older Pillow
        text_width, text_height = draw.textsize(text, font=font)
        
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2 - (size[1]*0.1) # slighly move up
    
    draw.text((x, y), text, font=font, fill=text_color)
    
    # Add gloss effect
    # draw.arc((10, 10, size[0]-10, size[1]-10), 0, 360, fill=(255, 255, 255, 50), width=5)
    
    # Save
    output_path = os.path.join('images', filename)
    img.save(output_path, 'PNG')
    print(f"Generated {output_path}")

def main():
    if not os.path.exists('images'):
        os.makedirs('images')
        
    icons = [
        # 字节豆包 - Blue/White
        {
            'filename': 'platform-doubao.png',
            'text': '豆',
            'bg_color': (67, 120, 255) # Blue
        },
        # 京东 - Red
        {
            'filename': 'platform-jd.png',
            'text': 'JD',
            'bg_color': (228, 57, 60) # JD Red
        },
        # 淘宝 - Orange
        {
            'filename': 'platform-taobao.png',
            'text': '淘',
            'bg_color': (255, 80, 0) # Taobao Orange
        },
        # 拼多多 - Red/Pink
        {
            'filename': 'platform-pinduoduo.png',
            'text': '拼',
            'bg_color': (224, 46, 36) # PDD Red
        },
        # 美团 - Yellow
        {
            'filename': 'platform-meituan.png',
            'text': '美',
            'bg_color': (255, 195, 0), # Meituan Yellow
            'text_color': (0, 0, 0) # Black text
        },
        # 闪购 - Green/Lightning
        {
            'filename': 'platform-shangou.png',
            'text': '闪',
            'bg_color': (100, 200, 100) # Greenish
        }
    ]
    
    for icon in icons:
        create_rounded_icon(
            icon['filename'], 
            icon['text'], 
            icon['bg_color'], 
            icon.get('text_color', (255, 255, 255))
        )

if __name__ == '__main__':
    main()
