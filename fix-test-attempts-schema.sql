-- Fix test_attempts table schema and RLS policies

-- Add missing columns
ALTER TABLE test_attempts 
ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;

ALTER TABLE test_attempts 
ADD COLUMN IF NOT EXISTS score NUMERIC DEFAULT 0;

ALTER TABLE test_attempts 
ADD COLUMN IF NOT EXISTS time_taken INTEGER DEFAULT 0;

-- Create index on answers for better query performance
CREATE INDEX IF NOT EXISTS idx_test_attempts_answers ON test_attempts USING gin(answers);

-- Fix RLS policies for test_attempts table

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Users can insert their own attempts" ON test_attempts;
DROP POLICY IF EXISTS "Admins can view all attempts" ON test_attempts;
DROP POLICY IF EXISTS "Teachers can view attempts for their tests" ON test_attempts;

-- Enable RLS
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own attempts
CREATE POLICY "Users can view their own attempts"
ON test_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own attempts
CREATE POLICY "Users can insert their own attempts"
ON test_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all attempts
CREATE POLICY "Admins can view all attempts"
ON test_attempts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy: Teachers can view attempts for their tests
CREATE POLICY "Teachers can view attempts for their tests"
ON test_attempts
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'teacher'
    )
    AND
    EXISTS (
        SELECT 1 FROM tests
        WHERE tests.id = test_attempts.test_id
        AND tests.created_by = auth.uid()
    )
);

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'test_attempts'
ORDER BY ordinal_position;
