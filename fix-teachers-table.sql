-- Fix teachers table to match the form requirements
-- Add missing is_featured column and ensure proper data types

-- Add is_featured column if it doesn't exist
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create index for is_featured
CREATE INDEX IF NOT EXISTS idx_teachers_is_featured ON teachers(is_featured);

-- Verify the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'teachers'
ORDER BY ordinal_position;

-- Show current teachers count
SELECT COUNT(*) as total_teachers FROM teachers;