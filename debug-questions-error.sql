-- =====================================================
-- DEBUG QUESTIONS ERROR
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Check questions table structure
SELECT 'Questions table columns:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'questions' 
ORDER BY ordinal_position;

-- 2. Check foreign key constraints on questions table
SELECT 'Questions table constraints:' as info;
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'questions';

-- 3. Check if we have any tests to reference
SELECT 'Available tests:' as info;
SELECT id, title, created_by FROM tests ORDER BY created_at DESC LIMIT 3;

-- 4. Try to insert a question manually to see the exact error
-- Replace 'your-test-id-here' with an actual test ID from above
SELECT 'Testing question insert (replace test_id):' as info;

-- Get the first test ID
DO $$
DECLARE
    test_uuid UUID;
BEGIN
    SELECT id INTO test_uuid FROM tests ORDER BY created_at DESC LIMIT 1;
    
    IF test_uuid IS NOT NULL THEN
        RAISE NOTICE 'Found test ID: %', test_uuid;
        
        -- Try to insert a question
        INSERT INTO questions (
            test_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            explanation,
            marks,
            negative_marks,
            difficulty,
            order_index
        ) VALUES (
            test_uuid,
            'What is the capital of India?',
            'Mumbai',
            'Delhi',
            'Kolkata',
            'Chennai',
            'B',
            'Delhi is the capital of India',
            1,
            0.25,
            'easy',
            0
        );
        
        RAISE NOTICE 'Question inserted successfully!';
        
        -- Clean up
        DELETE FROM questions WHERE question_text = 'What is the capital of India?';
        RAISE NOTICE 'Test question cleaned up';
    ELSE
        RAISE NOTICE 'No tests found - create a test first';
    END IF;
END $$;