-- Quick script to add second admin
-- Run this AFTER creating the user in Supabase Auth Dashboard

-- Step 1: Create user in Supabase Dashboard first:
-- Email: awasthiclasses1@gmail.com
-- Password: 123@admin#

-- Step 2: Run this SQL to make them admin:

-- Update existing profile or insert new one
INSERT INTO profiles (id, email, role, full_name)
SELECT 
    id,
    email,
    'admin',
    'Awasthi Classes Admin'
FROM auth.users
WHERE email = 'awasthiclasses1@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
    role = 'admin',
    full_name = 'Awasthi Classes Admin';

-- Verify both admins exist
SELECT 
    p.id,
    p.email,
    p.role,
    p.full_name,
    p.created_at,
    CASE 
        WHEN p.email = 'thedeeptrading24@gmail.com' THEN '✅ Primary Admin'
        WHEN p.email = 'awasthiclasses1@gmail.com' THEN '✅ Second Admin'
        ELSE 'Other'
    END as admin_type
FROM profiles p
WHERE p.role = 'admin'
ORDER BY p.created_at;
