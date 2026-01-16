-- Make thedeeptrading24@gmail.com an admin
-- Run this in Supabase SQL Editor AFTER the user has signed up

UPDATE profiles 
SET role = 'admin' 
WHERE email = 'thedeeptrading24@gmail.com';

-- Verify the update
SELECT id, email, full_name, role FROM profiles WHERE email = 'thedeeptrading24@gmail.com';