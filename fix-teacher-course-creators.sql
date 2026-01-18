-- Fix teacher-created courses to show correct creator badge
-- This updates courses that have teacher_id set to show as teacher-created

-- Step 1: Update courses that have a teacher_id to be marked as teacher-created
UPDATE courses 
SET 
    created_by = teacher_id,
    created_by_role = 'teacher'
WHERE teacher_id IS NOT NULL;

-- Step 2: Update courses without teacher_id to be marked as admin-created
-- (Only if created_by is NULL or needs to be set to admin)
UPDATE courses 
SET 
    created_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    created_by_role = 'admin'
WHERE teacher_id IS NULL AND (created_by IS NULL OR created_by_role IS NULL);

-- Step 3: Verify the update
SELECT 
    id,
    title,
    teacher_id,
    created_by,
    created_by_role,
    CASE 
        WHEN teacher_id IS NOT NULL THEN 'Teacher'
        ELSE 'Admin'
    END as expected_role
FROM courses
ORDER BY created_at DESC;

-- Step 4: Count courses by creator role
SELECT 
    created_by_role,
    COUNT(*) as course_count
FROM courses
GROUP BY created_by_role;

-- Step 5: Show teacher courses specifically
SELECT 
    c.id,
    c.title,
    c.created_by_role,
    p.full_name as teacher_name,
    p.email as teacher_email
FROM courses c
LEFT JOIN profiles p ON c.teacher_id = p.id
WHERE c.teacher_id IS NOT NULL
ORDER BY c.created_at DESC;
