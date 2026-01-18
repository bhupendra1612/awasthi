-- Fix UUID "undefined" issue
-- This script ensures all UUID columns handle NULL properly

-- Step 1: Check if board column exists and what type it is
DO $$
DECLARE
    board_type TEXT;
BEGIN
    SELECT data_type INTO board_type
    FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'board';
    
    IF board_type IS NOT NULL THEN
        RAISE NOTICE 'Board column exists with type: %', board_type;
        
        -- If board is UUID type (wrong!), drop it
        IF board_type = 'uuid' THEN
            RAISE NOTICE 'Board column is UUID type - dropping it';
            ALTER TABLE courses DROP COLUMN board;
        -- If board is text type, also drop it (not needed)
        ELSIF board_type IN ('text', 'character varying') THEN
            RAISE NOTICE 'Board column is text type - dropping it (not needed for government exams)';
            ALTER TABLE courses DROP COLUMN board;
        END IF;
    ELSE
        RAISE NOTICE 'Board column does not exist - good!';
    END IF;
END $$;

-- Step 2: Ensure all UUID columns allow NULL
ALTER TABLE courses ALTER COLUMN teacher_id DROP NOT NULL;
ALTER TABLE courses ALTER COLUMN created_by DROP NOT NULL;

-- Step 3: Clean up any "undefined" strings in UUID columns
-- (This shouldn't happen, but just in case)
UPDATE courses SET teacher_id = NULL WHERE teacher_id::text = 'undefined';
UPDATE courses SET created_by = NULL WHERE created_by::text = 'undefined';

-- Step 4: Verify the fix
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
AND (data_type = 'uuid' OR column_name = 'board')
ORDER BY column_name;

-- Step 5: Show summary
SELECT 
    COUNT(*) as total_courses,
    COUNT(teacher_id) as courses_with_teacher,
    COUNT(created_by) as courses_with_creator
FROM courses;
