-- =====================================================
-- FIX PROFILE AND FOREIGN KEY ISSUE
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Check current profiles
SELECT 'Current profiles:' as info;
SELECT id, email, full_name, role FROM profiles;

-- 2. Insert/Update your admin profile
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    role
) VALUES (
    '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8',
    'thedeeptrading24@gmail.com',
    'Admin User',
    'admin'
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = 'admin';

-- 3. Verify profile exists
SELECT 'Admin profile verification:' as info;
SELECT id, email, full_name, role 
FROM profiles 
WHERE id = '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8';

-- 4. Now try to create a test again
DELETE FROM tests WHERE title = 'Test Insert'; -- Remove any failed test

INSERT INTO tests (
    title,
    description,
    category,
    subject,
    duration_minutes,
    marks_per_question,
    negative_marks,
    passing_marks,
    is_free,
    price,
    is_published,
    is_featured,
    instructions,
    created_by
) VALUES (
    'Test Insert Success',
    'Test Description',
    'SSC',
    'General Knowledge',
    60,
    1,
    0.25,
    40,
    true,
    0,
    false,
    false,
    'Test instructions',
    '32fdc538-32ba-4dba-8ce5-11e3f5a3fdc8'
) RETURNING id, title, created_by;

-- 5. Clean up test record
DELETE FROM tests WHERE title = 'Test Insert Success';

SELECT '✅ Profile fixed! You can now create tests.' as result;