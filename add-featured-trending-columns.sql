-- Add is_featured and is_trending columns to courses table
-- These allow admins to mark courses for display on homepage and student dashboard

-- Add the columns if they don't exist
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

-- Add duration column if it doesn't exist (for course length display)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS duration TEXT;

-- Add board column if it doesn't exist (for exam board/category)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS board TEXT;

-- Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_trending ON courses(is_trending);

-- Show current state
SELECT 
    COUNT(*) as total_courses,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_courses,
    COUNT(*) FILTER (WHERE is_trending = true) as trending_courses,
    COUNT(*) FILTER (WHERE is_published = true) as published_courses
FROM courses;

-- Verify columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
AND column_name IN ('is_featured', 'is_trending', 'duration', 'board')
ORDER BY column_name;
