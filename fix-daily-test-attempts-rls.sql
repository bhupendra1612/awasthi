-- Fix RLS policies for daily_test_attempts table
-- This ensures users can insert and read their own attempts

-- First, check if RLS is enabled and disable it temporarily for testing
ALTER TABLE daily_test_attempts DISABLE ROW LEVEL SECURITY;

-- Or create proper RLS policies if needed
-- Enable RLS
ALTER TABLE daily_test_attempts ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own attempts
CREATE POLICY "Users can insert their own daily test attempts" ON daily_test_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to read their own attempts
CREATE POLICY "Users can read their own daily test attempts" ON daily_test_attempts
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own attempts (if needed)
CREATE POLICY "Users can update their own daily test attempts" ON daily_test_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Check if the table exists and has the right structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'daily_test_attempts' 
ORDER BY ordinal_position;

-- Success message
SELECT 'Daily test attempts RLS policies fixed!' as message;