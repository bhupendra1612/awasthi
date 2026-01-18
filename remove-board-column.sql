-- Remove the board column from courses table
-- This column is not needed for Awasthi Classes (government exam coaching)
-- Board (CBSE, ICSE, etc.) is for school education, not government exams

-- Optional: Check if column exists first
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'courses' AND column_name = 'board';

-- Remove the board column
ALTER TABLE courses DROP COLUMN IF EXISTS board;

-- Verify it's removed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- Note: This is optional. The column won't cause issues if left in the database,
-- but removing it keeps the schema clean and focused on government exam preparation.
