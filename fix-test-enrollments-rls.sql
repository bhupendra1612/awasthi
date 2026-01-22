-- Fix RLS policies for test_enrollments table

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own enrollments" ON test_enrollments;
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON test_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON test_enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON test_enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON test_enrollments;

-- Enable RLS
ALTER TABLE test_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON test_enrollments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own enrollments (for free tests)
CREATE POLICY "Users can insert their own enrollments"
ON test_enrollments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own enrollments (for attempt tracking)
CREATE POLICY "Users can update their own enrollments"
ON test_enrollments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all enrollments
CREATE POLICY "Admins can view all enrollments"
ON test_enrollments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy: Admins can manage all enrollments
CREATE POLICY "Admins can manage all enrollments"
ON test_enrollments
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy: Teachers can view enrollments for their tests
CREATE POLICY "Teachers can view their test enrollments"
ON test_enrollments
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
        WHERE tests.id = test_enrollments.test_id
        AND tests.created_by = auth.uid()
    )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'test_enrollments';
