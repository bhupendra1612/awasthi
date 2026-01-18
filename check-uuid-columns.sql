-- Check all UUID columns in the courses table
-- This helps identify which column is receiving "undefined" string

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
AND data_type = 'uuid'
ORDER BY ordinal_position;

-- Show a sample course to see actual data
SELECT 
    id,
    title,
    teacher_id,
    created_by,
    created_by_role
FROM courses
LIMIT 1;

-- Check if board column exists and its type
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
AND column_name = 'board';
