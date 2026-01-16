-- =====================================================
-- CHECK TEST TABLES STATUS
-- Run this in Supabase SQL Editor to debug
-- =====================================================

-- 1. Check if test tables exist
SELECT 'Tables that exist:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('tests', 'questions', 'test_enrollments', 'test_attempts', 'test_answers')
ORDER BY table_name;

-- 2. Check tests table structure
SELECT 'Tests table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'tests' 
ORDER BY ordinal_position;

-- 3. Try to insert a test record manually to see what fails
SELECT 'Testing insert:' as info;
INSERT INTO tests (
    title,
    description,
    category,
    subject,
    duration_minutes,
    marks_per_question,
    negative_marks,
    passing_marks,
    is_free,
    price,
    is_published,
    is_featured,
    instructions,
    created_by
) VALUES (
    'Test Insert',
    'Test Description',
    'SSC',
    'General Knowledge',
    60,
    1,
    0.25,
    40,
    true,
    0,
    false,
    false,
    'Test instructions',
    '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8'
) RETURNING id, title;

-- 4. Check if the insert worked
SELECT 'Recent tests:' as info;
SELECT id, title, category, created_at FROM tests ORDER BY created_at DESC LIMIT 3;