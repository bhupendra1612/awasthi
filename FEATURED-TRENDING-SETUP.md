# Featured & Trending Courses Setup

## Problem Fixed
The error "Could not find the 'is_featured' column" occurred because the database was missing the `is_featured` and `is_trending` columns.

## Solution

### Step 1: Add Missing Columns to Database
Run this SQL script in Supabase SQL Editor:

**File:** `awasthi/add-featured-trending-columns.sql`

```sql
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_is_trending ON courses(is_trending);
```

### Step 2: Verify Columns Were Added
Run this to check:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'courses' 
AND column_name IN ('is_featured', 'is_trending');
```

You should see:
```
column_name  | data_type | column_default
-------------|-----------|---------------
is_featured  | boolean   | false
is_trending  | boolean   | false
```

## Features Added

### 1. Featured Courses
- **Purpose**: Highlight premium/important courses on homepage and student dashboard
- **Admin Control**: Checkbox in course edit/create form
- **Display**: Shows ⭐ "Featured" badge on course cards
- **Use Case**: Promote best courses, new launches, or special offers

### 2. Trending Courses
- **Purpose**: Mark popular or high-demand courses
- **Admin Control**: Checkbox in course edit/create form
- **Display**: Shows 🔥 "Trending" badge on course cards
- **Use Case**: Show courses with high enrollment, current exam relevance

## Admin Powers

### What Admins Can Do:

1. **Mark Any Course as Featured**
   - Admin-created courses ✅
   - Teacher-created courses ✅
   - Shows on homepage
   - Shows on student dashboard

2. **Mark Any Course as Trending**
   - Admin-created courses ✅
   - Teacher-created courses ✅
   - Indicates popularity
   - Attracts more students

3. **Control Visibility**
   - Featured + Published = Shows prominently
   - Trending + Published = Shows in trending section
   - Can feature teacher courses to promote quality content

## How to Use

### Creating a New Course:
1. Go to `/admin/courses/new`
2. Fill in course details
3. Check options:
   - ☑️ **Featured Course** - Show on homepage and student dashboard
   - ☑️ **Trending Course** - Mark as popular/trending
   - ☑️ **Complete Package** - Multiple subjects included
4. Click "Create Course"

### Editing Existing Course:
1. Go to `/admin/courses`
2. Click "Edit" on any course (admin or teacher-created)
3. Update checkboxes:
   - ⭐ **Featured Course** - Show on homepage and student dashboard
   - 🔥 **Trending Course** - Mark as popular/trending
4. Click "Save Changes"

## Display Locations

### Featured Courses Show On:
1. **Homepage** - Featured courses section
2. **Student Dashboard** - Recommended/Featured section
3. **Course Listing** - With ⭐ Featured badge

### Trending Courses Show On:
1. **Homepage** - Trending section
2. **Course Listing** - With 🔥 Trending badge
3. **Student Dashboard** - Popular courses section

## Example Use Cases

### Scenario 1: Promote Teacher's Quality Course
```
Teacher creates: "SSC CGL Mathematics Complete Course"
Admin reviews and likes it
Admin edits course → Check "Featured" → Save
Result: Course shows on homepage with ⭐ badge
```

### Scenario 2: Highlight Exam Season Course
```
Railway NTPC exam coming soon
Admin edits Railway course → Check "Trending" → Save
Result: Course shows with 🔥 badge, attracts more students
```

### Scenario 3: Launch Special Combo
```
Admin creates: "Complete Government Exam Package"
Check: Featured + Trending + Complete Package
Result: Maximum visibility with all badges
```

## Database Schema

```sql
CREATE TABLE courses (
    -- ... existing columns ...
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    -- ... other columns ...
);
```

## API Endpoint

The course update API handles these fields:

**Endpoint:** `PUT /api/admin/courses/[id]`

**Request Body:**
```json
{
    "title": "Course Title",
    "is_featured": true,
    "is_trending": true,
    "is_published": true
}
```

## Filtering & Queries

### Get Featured Courses:
```sql
SELECT * FROM courses 
WHERE is_featured = true 
AND is_published = true
ORDER BY created_at DESC;
```

### Get Trending Courses:
```sql
SELECT * FROM courses 
WHERE is_trending = true 
AND is_published = true
ORDER BY created_at DESC;
```

### Get Featured Teacher Courses:
```sql
SELECT * FROM courses 
WHERE is_featured = true 
AND created_by_role = 'teacher'
AND is_published = true;
```

## Benefits

1. **Better Course Discovery**: Students find important courses easily
2. **Promote Quality Content**: Highlight best teacher courses
3. **Seasonal Relevance**: Mark courses trending for upcoming exams
4. **Marketing Control**: Admin decides what to promote
5. **Student Engagement**: Featured courses get more visibility

## Troubleshooting

### Error: "Column not found"
**Solution**: Run `add-featured-trending-columns.sql` in Supabase

### Featured courses not showing on homepage
**Check**:
1. Is `is_featured = true`?
2. Is `is_published = true`?
3. Does homepage component query featured courses?

### Can't update teacher courses
**Check**:
1. Are you logged in as admin?
2. Does the API route check admin role?
3. Are RLS policies allowing admin access?

## Future Enhancements

Possible additions:
- Auto-trending based on enrollment count
- Featured course rotation/scheduling
- Analytics for featured vs non-featured performance
- Student feedback on featured courses
- Time-limited featured status

## Notes

- Only admins can mark courses as featured/trending
- Teachers cannot self-promote (prevents spam)
- Featured status doesn't affect course functionality
- Trending is purely visual indicator
- Both work with admin and teacher courses
