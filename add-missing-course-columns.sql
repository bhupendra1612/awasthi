-- Add missing columns to courses table
-- Run this in Supabase SQL Editor

-- Add missing columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'Central Government',
ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '6 Months',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES profiles(id);

-- Update existing courses to have default values
UPDATE courses 
SET 
    board = 'Central Government',
    duration = '6 Months',
    is_featured = FALSE,
    is_trending = FALSE
WHERE board IS NULL OR duration IS NULL OR is_featured IS NULL OR is_trending IS NULL;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;