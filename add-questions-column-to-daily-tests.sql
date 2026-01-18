-- Add questions column to generated_daily_tests table
-- This allows storing questions as JSON directly in the test record

ALTER TABLE generated_daily_tests 
ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance on questions column
CREATE INDEX IF NOT EXISTS idx_generated_daily_tests_questions ON generated_daily_tests USING GIN (questions);

-- Update existing records to have empty questions array if null
UPDATE generated_daily_tests 
SET questions = '[]'::jsonb 
WHERE questions IS NULL;

-- Success message
SELECT 'Questions column added to generated_daily_tests table successfully!' as message;