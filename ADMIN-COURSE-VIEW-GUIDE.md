# Admin Course View - Visual Guide

## What You'll See in the Admin Dashboard

### 1. New Filter Dropdown

In the courses page (`/admin/courses`), you'll now see a new dropdown filter:

```
[All Categories ▼] [All Status ▼] [All Creators ▼] [More Filters]
```

The **"All Creators"** dropdown has these options:
- All Creators (shows everything)
- Admin Created (only your courses)
- Teacher Created (only teacher courses)

---

### 2. Grid View - Course Cards

Each course card will show badges in the top-left corner:

#### Teacher-Created Course:
```
┌─────────────────────────────────────┐
│ [SSC] [🟣 Teacher] [⭐ Featured]    │ ← Purple badge
│                                     │
│  Course Thumbnail                   │
│                                     │
│  SSC CGL Mathematics                │
│  Mathematics                        │
│  👤 Created by: Rajesh Kumar        │ ← Creator name
│  🎥 25 videos  👥 150 enrolled      │
│  ₹2,999                             │
│  [Toggle] [Edit] [Content] [Delete]│
└─────────────────────────────────────┘
```

#### Admin-Created Course:
```
┌─────────────────────────────────────┐
│ [Railway] [🔵 Admin] [COMBO]        │ ← Blue badge
│                                     │
│  Course Thumbnail                   │
│                                     │
│  Railway NTPC Complete Course       │
│  Complete Course                    │
│  👤 Created by: Admin User          │ ← Creator name
│  🎥 50 videos  👥 300 enrolled      │
│  ₹4,999                             │
│  [Toggle] [Edit] [Content] [Delete]│
└─────────────────────────────────────┘
```

---

### 3. List View - Table Format

The table now has a **Creator** column:

| Course | Category | **Creator** | Price | Videos | Enrolled | Status | Actions |
|--------|----------|-------------|-------|--------|----------|--------|---------|
| SSC CGL Math | SSC | 🟣 Teacher | ₹2,999 | 25 | 150 | Published | [Edit][Video][Delete] |
| Railway NTPC | Railway | 🔵 Admin | ₹4,999 | 50 | 300 | Published | [Edit][Video][Delete] |
| Bank PO English | Bank | 🟣 Teacher | ₹1,999 | 15 | 80 | Draft | [Edit][Video][Delete] |

---

## Color Coding

### Teacher Courses:
- **Badge Color**: Purple (`bg-purple-500`)
- **Icon**: UserCircle (👤)
- **Label**: "Teacher"

### Admin Courses:
- **Badge Color**: Blue (`bg-blue-600`)
- **Icon**: Shield (🛡️)
- **Label**: "Admin"

---

## How to Use

### Scenario 1: View Only Teacher Courses
1. Go to `/admin/courses`
2. Click the **"All Creators"** dropdown
3. Select **"Teacher Created"**
4. You'll see only courses created by teachers

### Scenario 2: View Only Your (Admin) Courses
1. Go to `/admin/courses`
2. Click the **"All Creators"** dropdown
3. Select **"Admin Created"**
4. You'll see only courses you created

### Scenario 3: Combine Filters
You can combine multiple filters:
- **Category**: SSC
- **Creator**: Teacher Created
- **Status**: Published

This shows only published SSC courses created by teachers.

---

## Quick Identification Tips

### At a Glance:
- **Purple badge** = Teacher made this course
- **Blue badge** = Admin made this course
- **Creator name** appears below the course title in grid view
- **Creator column** shows role badge in list view

### Why This Matters:
1. **Quality Control**: Quickly identify teacher courses that may need review
2. **Management**: Filter and manage courses by creator
3. **Accountability**: Know who created each course
4. **Analytics**: Track course creation patterns
5. **Approval Workflow**: Easily find teacher courses pending approval

---

## Active Filters Display

When you apply the creator filter, you'll see it in the active filters bar:

```
Active filters: [Teacher ✕] (45 results)
```

Click the ✕ to remove the filter.

---

## Statistics

The stats cards at the top show:
- **Total Courses**: All courses (admin + teacher)
- **Published**: Published courses from both
- **Drafts**: Draft courses from both
- **Enrollments**: Total enrollments across all courses
- **Revenue**: Total revenue from all courses

To see stats for only teacher or admin courses, use the filter dropdown.

---

## Migration Note

After running the SQL migration (`add-created-by-to-courses.sql`):
- All existing courses will be assigned to the first admin user
- New courses will automatically track their creator
- You can manually update the `created_by` field in Supabase if needed

---

## Example Workflow

### Managing Teacher Courses:
1. Filter by "Teacher Created"
2. Review course quality and content
3. Check if courses need approval
4. Publish or request changes
5. Monitor enrollment and performance

### Managing Your Courses:
1. Filter by "Admin Created"
2. Update your own courses
3. Add new content
4. Monitor performance
5. Make improvements

---

## Technical Details

### Database Fields:
- `created_by`: UUID of the user who created the course
- `created_by_role`: 'admin' or 'teacher' for quick filtering

### Query Example:
```typescript
const { data } = await supabase
    .from("courses")
    .select(`
        *,
        creator:created_by(full_name, email)
    `)
    .eq("created_by_role", "teacher") // Filter by teacher
```

---

## Support

If you need to:
- Update creator information for existing courses
- Change who created a specific course
- Bulk update creator fields

Contact technical support or update directly in Supabase Table Editor.
