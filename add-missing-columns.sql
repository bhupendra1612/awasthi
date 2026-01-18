-- Add missing columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'CBSE',
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '6 months',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

-- Add missing columns to blogs table
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Education',
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Awasthi Classes';

-- Update existing blogs to have proper values
UPDATE blogs SET 
    image_url = COALESCE(image_url, cover_image),
    category = COALESCE(category, 'Education'),
    author = COALESCE(author, 'Awasthi Classes')
WHERE image_url IS NULL OR category IS NULL OR author IS NULL;

SELECT 'Missing columns added successfully!' as message;