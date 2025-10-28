#!/usr/bin/env python3
"""
Create a square icon with gradient background and lightning bolt
Based on the uploaded image - square format for iOS
"""

from PIL import Image, ImageDraw

def create_square_icon(output_path, size=1024):
    # Create a new square image
    img = Image.new('RGB', (size, size))
    pixels = img.load()

    # Create gradient from purple/magenta (top-left) to blue (bottom-right)
    for y in range(size):
        for x in range(size):
            # Calculate position ratios
            x_ratio = x / size
            y_ratio = y / size

            # Gradient from magenta-ish purple to blue
            # Top-left: RGB(165, 90, 220) approximately
            # Bottom-right: RGB(91, 136, 241) approximately

            r = int(165 - (165 - 91) * (x_ratio * 0.7 + y_ratio * 0.3))
            g = int(90 + (136 - 90) * (x_ratio * 0.7 + y_ratio * 0.3))
            b = int(220 + (241 - 220) * (x_ratio * 0.7 + y_ratio * 0.3))

            pixels[x, y] = (r, g, b)

    # Now we need to add the lightning bolt
    # For simplicity, let's load the existing icon and extract just the bolt
    try:
        old_icon = Image.open('/Users/jaimegarcia/Desktop/sparks/assets/icon-backup-20251027.png').convert('RGBA')

        # Resize if needed
        if old_icon.size != (size, size):
            old_icon = old_icon.resize((size, size), Image.Resampling.LANCZOS)

        # Extract the lightning bolt (yellow pixels with alpha)
        for y in range(size):
            for x in range(size):
                r, g, b, a = old_icon.getpixel((x, y))
                # If it's yellow-ish (the lightning bolt) and opaque
                if a > 200 and g > 200 and r > 200 and b < 150:
                    pixels[x, y] = (r, g, b)
    except Exception as e:
        print(f"Could not extract lightning bolt: {e}")
        print("Saving gradient only...")

    # Save the image
    img.save(output_path, 'PNG')
    print(f"Created square icon at {output_path}")

if __name__ == '__main__':
    create_square_icon('/Users/jaimegarcia/Desktop/sparks/assets/icon-square.png')
