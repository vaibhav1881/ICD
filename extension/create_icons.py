from PIL import Image, ImageDraw, ImageFont

# Create icons in different sizes
sizes = [16, 48, 128]

for size in sizes:
    # Create a new image with a gradient background
    img = Image.new('RGB', (size, size), color='#6366f1')
    draw = ImageDraw.Draw(img)
    
    # Draw a simple design - two overlapping circles
    circle_size = size // 3
    
    # First circle (blue)
    draw.ellipse([size//4, size//4, size//4 + circle_size, size//4 + circle_size], 
                 fill='#3b82f6', outline='#ffffff', width=max(1, size//32))
    
    # Second circle (purple) - overlapping
    draw.ellipse([size//2, size//2, size//2 + circle_size, size//2 + circle_size], 
                 fill='#8b5cf6', outline='#ffffff', width=max(1, size//32))
    
    # Save the icon
    img.save(f'icons/icon{size}.png')
    print(f"Created icon{size}.png")

print("All icons created successfully!")
