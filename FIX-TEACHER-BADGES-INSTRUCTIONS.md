# Fix Teacher Course Badges - Quick Instructions

## Problem
All courses are showing blue "Admin" badges, but some courses were created by teachers and should show purple "Teacher" badges.

## Solution
Run the SQL fix script to update teacher courses based on the `teacher_id` field.

## Steps

### Option 1: Run the Fix Script (Recommended)
1. Open Supabase SQL Editor
2. Copy and paste the contents of `awasthi/fix-teacher-course-creators.sql`
3. Click "Run" to execute
4. Refresh your admin courses page

### Option 2: Manual SQL Command
Run this in Supabase SQL Editor:

```sql
-- Update teacher courses
UPDATE courses 
SET 
    created_by = teacher_id,
    created_by_role = 'teacher'
WHERE teacher_id IS NOT NULL;

-- Update admin courses
UPDATE courses 
SET 
    created_by = (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1),
    created_by_role = 'admin'
WHERE teacher_id IS NULL AND created_by_role IS NULL;
```

## Verify the Fix

After running the script, check the results:

```sql
-- Count courses by creator
SELECT 
    created_by_role,
    COUNT(*) as course_count
FROM courses
GROUP BY created_by_role;
```

You should see something like:
```
created_by_role | course_count
----------------|-------------
admin           | 5
teacher         | 3
```

## What This Does

The script:
1. Finds all courses with `teacher_id` set
2. Updates those courses to have `created_by_role = 'teacher'`
3. Sets `created_by` to the teacher's user ID
4. Leaves admin courses unchanged

## After Running

Refresh your admin dashboard (`/admin/courses`) and you should see:
- **Purple "Teacher" badges** on teacher-created courses
- **Blue "Admin" badges** on admin-created courses

## Troubleshooting

### Still showing all admin badges?
1. Check if the SQL ran successfully (no errors)
2. Verify teacher courses have `teacher_id` set:
   ```sql
   SELECT id, title, teacher_id, created_by_role 
   FROM courses 
   WHERE teacher_id IS NOT NULL;
   ```
3. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

### Teacher courses don't have teacher_id?
If teacher courses don't have `teacher_id` set, you need to manually update them:

```sql
-- Find the teacher's user ID first
SELECT id, email, full_name FROM profiles WHERE role = 'teacher';

-- Then update specific courses
UPDATE courses 
SET 
    teacher_id = 'TEACHER_USER_ID_HERE',
    created_by = 'TEACHER_USER_ID_HERE',
    created_by_role = 'teacher'
WHERE id = 'COURSE_ID_HERE';
```

## Future Courses

All new courses will automatically have the correct badges:
- Teachers creating courses → Purple "Teacher" badge
- Admins creating courses → Blue "Admin" badge

No manual intervention needed for new courses!
