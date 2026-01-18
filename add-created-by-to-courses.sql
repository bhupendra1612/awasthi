-- Add created_by field to courses table to track who created the course
-- This helps admins distinguish between admin-created and teacher-created courses

-- Add created_by column (references profiles table)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Add created_by_role column for quick filtering (denormalized for performance)
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS created_by_role TEXT CHECK (created_by_role IN ('admin', 'teacher'));

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_courses_created_by_role ON courses(created_by_role);

-- Update existing courses based on teacher_id
-- If teacher_id exists, it's a teacher course; otherwise, it's an admin course
UPDATE courses 
SET 
    created_by = COALESCE(teacher_id, (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)),
    created_by_role = CASE 
        WHEN teacher_id IS NOT NULL THEN 'teacher'
        ELSE 'admin'
    END
WHERE created_by IS NULL;

-- Verify the setup
SELECT 
    created_by_role,
    COUNT(*) as course_count
FROM courses
GROUP BY created_by_role;

-- Note: For new courses, the application will automatically set created_by
-- when a teacher or admin creates a course
