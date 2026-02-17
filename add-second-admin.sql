-- Add second admin account
-- Email: awasthiclasses1@gmail.com
-- Password: 123@admin# (set this when creating user in Supabase Auth)

-- STEP 1: First, create the user account in Supabase Dashboard:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User" or "Invite User"
-- 3. Email: awasthiclasses1@gmail.com
-- 4. Password: 123@admin#
-- 5. Click "Create User"

-- STEP 2: After user is created, run this SQL to make them admin:
-- Replace 'USER_ID_HERE' with the actual user ID from Supabase Auth

-- Update the profile to admin role
UPDATE profiles 
SET role = 'admin',
    full_name = 'Awasthi Classes Admin'
WHERE email = 'awasthiclasses1@gmail.com';

-- If profile doesn't exist, insert it
INSERT INTO profiles (id, email, role, full_name)
SELECT 
    auth.uid(),
    'awasthiclasses1@gmail.com',
    'admin',
    'Awasthi Classes Admin'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'awasthiclasses1@gmail.com'
);

-- Verify the admin was created
SELECT id, email, role, full_name, created_at
FROM profiles
WHERE email IN ('thedeeptrading24@gmail.com', 'awasthiclasses1@gmail.com')
ORDER BY email;

-- Show all admins
SELECT id, email, role, full_name
FROM profiles
WHERE role = 'admin';
