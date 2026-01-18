# Quick Fix Instructions

## Issue 1: Teacher Badges Not Showing
**Problem**: All courses show blue "Admin" badges, but 3 teacher courses should show purple "Teacher" badges.

**Fix**: Run this in Supabase SQL Editor:
```sql
UPDATE courses 
SET 
    created_by = teacher_id,
    created_by_role = 'teacher'
WHERE teacher_id IS NOT NULL;
```

**Result**: Teacher courses will show purple 🟣 "Teacher" badges.

---

## Issue 2: Featured/Trending Error
**Problem**: Error "Could not find the 'is_featured' column" when creating/editing courses.

**Fix**: Run this in Supabase SQL Editor:
```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_trending ON courses(is_trending);
```

**Result**: Admins can now mark courses as Featured ⭐ or Trending 🔥.

---

## What You Get

### 1. Course Creator Badges
- **Purple "Teacher" badge** - Teacher-created courses
- **Blue "Admin" badge** - Admin-created courses
- **Filter dropdown** - View by creator type

### 2. Featured & Trending System
- **Featured checkbox** - Show course on homepage & student dashboard
- **Trending checkbox** - Mark course as popular
- **Works for all courses** - Admin can feature teacher courses too

---

## Quick Test

### Test Teacher Badges:
1. Run the teacher badge fix SQL
2. Go to `/admin/courses`
3. You should see purple badges on teacher courses

### Test Featured/Trending:
1. Run the featured/trending fix SQL
2. Go to `/admin/courses`
3. Click "Edit" on any course
4. Check "Featured Course" and "Trending Course"
5. Click "Save Changes"
6. Should save without errors

---

## Files Created

1. `add-featured-trending-columns.sql` - Adds missing columns
2. `fix-teacher-course-creators.sql` - Fixes teacher badges
3. `check-course-creators.sql` - Diagnostic queries
4. `src/app/api/admin/courses/[id]/route.ts` - API for course updates
5. Documentation files for reference

---

## Need Help?

If issues persist:
1. Check Supabase SQL Editor for errors
2. Verify columns exist: `SELECT * FROM courses LIMIT 1;`
3. Check browser console for errors
4. Hard refresh browser (Ctrl+Shift+R)
