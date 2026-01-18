# Course Creator Tracking System

## Overview
The admin dashboard now displays visual indicators showing which courses were created by teachers vs admins. This helps admins easily identify and manage courses from different sources.

## Database Changes

### New Columns Added to `courses` Table:
1. **`created_by`** (UUID) - References the user ID from profiles table
2. **`created_by_role`** (TEXT) - Stores 'admin' or 'teacher' for quick filtering

### SQL Migration File:
Run `awasthi/add-created-by-to-courses.sql` in Supabase SQL Editor to add these columns.

```sql
-- Add columns
ALTER TABLE courses ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS created_by_role TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_courses_created_by_role ON courses(created_by_role);
```

## Visual Indicators

### Grid View (Card Layout):
- **Teacher-created courses**: Purple badge with "Teacher" label and UserCircle icon
- **Admin-created courses**: Blue badge with "Admin" label and Shield icon
- Creator name displayed below course title: "Created by: [Name]"

### List View (Table Layout):
- **Creator Column**: Shows badge with role (Teacher/Admin) and icon
- Color-coded for easy identification:
  - Purple for Teachers
  - Blue for Admins

## Filtering Options

New filter dropdown added: **"All Creators"**
- All Creators (default)
- Admin Created
- Teacher Created

This filter works alongside existing filters (category, status, price, etc.)

## How It Works

### When Creating a Course:

**Admin creates course** (`/admin/courses/new`):
```typescript
created_by: user.id,
created_by_role: "admin"
```

**Teacher creates course** (`/teacher/courses/new`):
```typescript
created_by: user.id,
created_by_role: "teacher"
```

### When Displaying Courses:

The admin courses page fetches creator information:
```typescript
const { data } = await supabase
    .from("courses")
    .select(`
        *,
        creator:created_by(full_name, email)
    `)
```

## Benefits

1. **Easy Identification**: Admins can instantly see which courses are teacher-created
2. **Better Management**: Filter courses by creator type for targeted management
3. **Accountability**: Track who created each course
4. **Quality Control**: Quickly identify teacher courses that may need review
5. **Analytics**: Understand course creation patterns by role

## UI Components

### Badge Colors:
- **Teacher Badge**: `bg-purple-500 text-white` (Purple)
- **Admin Badge**: `bg-blue-600 text-white` (Blue)

### Icons Used:
- **Teacher**: `UserCircle` from lucide-react
- **Admin**: `Shield` from lucide-react

## Files Modified

1. `awasthi/add-created-by-to-courses.sql` - Database migration
2. `awasthi/src/app/(admin)/admin/courses/page.tsx` - Admin courses list with creator display
3. `awasthi/src/app/(admin)/admin/courses/new/page.tsx` - Set created_by when admin creates course
4. `awasthi/src/app/(teacher)/teacher/courses/new/page.tsx` - Set created_by when teacher creates course

## Migration Steps

1. Run the SQL migration file in Supabase SQL Editor
2. Existing courses will be automatically assigned to the first admin user
3. New courses will automatically track their creator
4. The admin dashboard will immediately show creator badges

## Future Enhancements

Possible future additions:
- Creator statistics dashboard
- Course performance by creator type
- Creator leaderboard
- Bulk actions by creator
- Creator-specific analytics

## Notes

- Existing courses are assigned to the first admin by default
- You can manually update `created_by` for specific courses if needed
- The system uses denormalized `created_by_role` for faster filtering
- Creator information is fetched via JOIN for display purposes
