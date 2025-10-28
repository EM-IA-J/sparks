#!/usr/bin/env python3
"""
Script to fix iOS app icon by removing transparent corners
and extending the gradient to fill the entire square.
"""

from PIL import Image

def fix_icon(input_path, output_path):
    # Load the image
    img = Image.open(input_path).convert('RGBA')
    width, height = img.size

    # Create a new image with the gradient extended to edges
    new_img = Image.new('RGBA', (width, height))

    # Get pixel data
    pixels = img.load()
    new_pixels = new_img.load()

    # Find the radius of the rounded corners by checking transparency
    corner_radius = 0
    for i in range(width // 2):
        if pixels[i, 0][3] > 0:  # Found first non-transparent pixel
            corner_radius = i
            break

    print(f"Detected corner radius: {corner_radius}")

    # For each pixel, if it's transparent, fill it with the nearest non-transparent color
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            if a < 255:  # Transparent or semi-transparent
                # Find nearest non-transparent pixel by checking inward
                found = False
                for offset in range(1, corner_radius + 50):
                    # Check in multiple directions
                    checks = [
                        (min(x + offset, width-1), y),
                        (max(x - offset, 0), y),
                        (x, min(y + offset, height-1)),
                        (x, max(y - offset, 0)),
                        (min(x + offset, width-1), min(y + offset, height-1)),
                    ]

                    for cx, cy in checks:
                        cr, cg, cb, ca = pixels[cx, cy]
                        if ca == 255:  # Fully opaque
                            new_pixels[x, y] = (cr, cg, cb, 255)
                            found = True
                            break

                    if found:
                        break

                if not found:
                    # Fallback to blue color from the gradient
                    new_pixels[x, y] = (91, 136, 241, 255)
            else:
                new_pixels[x, y] = (r, g, b, 255)

    # Save the new image
    new_img.save(output_path, 'PNG')
    print(f"Saved fixed icon to {output_path}")

if __name__ == '__main__':
    fix_icon('/Users/jaimegarcia/Desktop/sparks/assets/icon.png',
             '/Users/jaimegarcia/Desktop/sparks/assets/icon-fixed.png')
