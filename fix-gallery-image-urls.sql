-- Fix Gallery Image URLs - Remove duplicate "gallery/" in path
-- This fixes URLs like: .../gallery/gallery/image.jpg to .../gallery/image.jpg

-- Preview what will be changed (run this first to check)
SELECT 
    id,
    title,
    image_url as old_url,
    REPLACE(image_url, '/gallery/gallery/', '/gallery/') as new_url
FROM gallery
WHERE image_url LIKE '%/gallery/gallery/%';

-- Apply the fix (run this after verifying the preview looks correct)
UPDATE gallery
SET image_url = REPLACE(image_url, '/gallery/gallery/', '/gallery/')
WHERE image_url LIKE '%/gallery/gallery/%';

-- Verify the fix
SELECT id, title, image_url 
FROM gallery 
ORDER BY created_at DESC 
LIMIT 10;
