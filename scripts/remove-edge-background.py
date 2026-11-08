from collections import deque
from PIL import Image

path = 'public/assets/casa3/casa-panoramica-transparente.png'
image = Image.open(path).convert('RGBA')
pixels = image.load()
width, height = image.size
queue = deque([(x, 0) for x in range(width)] + [(x, height - 1) for x in range(width)] + [(0, y) for y in range(height)] + [(width - 1, y) for y in range(height)])
seen = set()
while queue:
    x, y = queue.popleft()
    if (x, y) in seen:
        continue
    seen.add((x, y))
    red, green, blue, alpha = pixels[x, y]
    if not (red > 145 and green > 145 and blue > 145 and max(red, green, blue) - min(red, green, blue) < 18):
        continue
    pixels[x, y] = (red, green, blue, 0)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in seen:
            queue.append((nx, ny))
image.save(path)
