-- =====================================================
-- FIX QUESTIONS TABLE STRUCTURE
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Check if questions table exists and what columns it has
SELECT 'Questions table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'questions' 
ORDER BY ordinal_position;

-- 2. Drop and recreate questions table with correct structure
DROP TABLE IF EXISTS questions CASCADE;

-- 3. Create questions table with correct columns
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
    
    -- Question Content
    question_text TEXT NOT NULL,
    question_image TEXT, -- Optional image for question
    
    -- Options (A, B, C, D)
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    option_d TEXT,
    
    -- Answer
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    explanation TEXT, -- Solution explanation
    
    -- Metadata
    marks DECIMAL(5,2) DEFAULT 1,
    negative_marks DECIMAL(5,2) DEFAULT 0,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    topic TEXT,
    order_index INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Disable RLS on questions table
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- 5. Create index for performance
CREATE INDEX IF NOT EXISTS idx_questions_test ON questions(test_id);

-- 6. Recreate the trigger function for updating test stats
CREATE OR REPLACE FUNCTION update_test_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total questions and marks when questions are added/removed
    IF TG_OP = 'DELETE' THEN
        UPDATE tests 
        SET 
            total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = OLD.test_id),
            total_marks = (SELECT COALESCE(SUM(marks), 0) FROM questions WHERE test_id = OLD.test_id),
            updated_at = NOW()
        WHERE id = OLD.test_id;
        RETURN OLD;
    ELSE
        UPDATE tests 
        SET 
            total_questions = (SELECT COUNT(*) FROM questions WHERE test_id = NEW.test_id),
            total_marks = (SELECT COALESCE(SUM(marks), 0) FROM questions WHERE test_id = NEW.test_id),
            updated_at = NOW()
        WHERE id = NEW.test_id;
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger
DROP TRIGGER IF EXISTS update_test_stats_trigger ON questions;
CREATE TRIGGER update_test_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_test_stats();

-- 8. Test inserting a question
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

-- 9. Verify final structure
SELECT 'Final questions table structure:' as info;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'questions' ORDER BY ordinal_position;

SELECT '✅ Questions table fixed!' as result;