-- Diagnostic script to check course creator information
-- Run this to see the current state of your courses

-- 1. Show all courses with their creator information
SELECT 
    c.id,
    c.title,
    c.teacher_id,
    c.created_by,
    c.created_by_role,
    p_teacher.full_name as teacher_name,
    p_teacher.email as teacher_email,
    p_creator.full_name as creator_name,
    p_creator.email as creator_email,
    CASE 
        WHEN c.teacher_id IS NOT NULL THEN '🟣 Should be TEACHER'
        ELSE '🔵 Should be ADMIN'
    END as expected_badge,
    CASE 
        WHEN c.created_by_role = 'teacher' THEN '🟣 TEACHER'
        WHEN c.created_by_role = 'admin' THEN '🔵 ADMIN'
        ELSE '❓ UNKNOWN'
    END as current_badge
FROM courses c
LEFT JOIN profiles p_teacher ON c.teacher_id = p_teacher.id
LEFT JOIN profiles p_creator ON c.created_by = p_creator.id
ORDER BY c.created_at DESC;

-- 2. Count courses by creator role
SELECT 
    created_by_role,
    COUNT(*) as course_count
FROM courses
GROUP BY created_by_role;

-- 3. Show courses where badge doesn't match teacher_id
SELECT 
    c.id,
    c.title,
    c.teacher_id IS NOT NULL as has_teacher_id,
    c.created_by_role,
    CASE 
        WHEN c.teacher_id IS NOT NULL AND c.created_by_role != 'teacher' THEN '❌ MISMATCH - Should be teacher'
        WHEN c.teacher_id IS NULL AND c.created_by_role != 'admin' THEN '❌ MISMATCH - Should be admin'
        ELSE '✅ CORRECT'
    END as status
FROM courses c
WHERE 
    (c.teacher_id IS NOT NULL AND c.created_by_role != 'teacher')
    OR (c.teacher_id IS NULL AND c.created_by_role != 'admin');

-- 4. Show all teachers and their course count
SELECT 
    p.id,
    p.full_name,
    p.email,
    COUNT(c.id) as course_count
FROM profiles p
LEFT JOIN courses c ON c.teacher_id = p.id
WHERE p.role = 'teacher'
GROUP BY p.id, p.full_name, p.email
ORDER BY course_count DESC;
