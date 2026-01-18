# Teacher Account Management Guide

## Overview
This guide explains how teacher accounts work in Awasthi Classes and how to troubleshoot common issues.

## Teacher Account Activation

### Default Behavior
- New teacher accounts are created with `is_active = TRUE` by default
- Teachers can log in immediately after signup
- The system checks `is_active` status on every login

### Manual Activation (If Needed)
If a teacher account is not active, you can activate it manually in Supabase:

1. Go to Supabase Dashboard → Table Editor
2. Open the `profiles` table
3. Find the teacher's profile by email
4. Set `is_active` to `TRUE`
5. Save the changes

### SQL Command for Activation
```sql
UPDATE profiles 
SET is_active = TRUE 
WHERE email = 'teacher@example.com' AND role = 'teacher';
```

## Role-Based Routing

The system automatically redirects users based on their role:

| Role | Redirect Path | Layout File |
|------|--------------|-------------|
| Admin | `/admin` | `awasthi/src/app/(admin)/layout.tsx` |
| Teacher | `/teacher` | `awasthi/src/app/(teacher)/layout.tsx` |
| Student | `/student` | `awasthi/src/app/(student)/layout.tsx` |
| Other | `/dashboard` | N/A |

## Common Issues & Solutions

### Issue 1: Teacher Login Redirect Loop
**Symptom**: Teacher clicks login, enters credentials, but is redirected back to login page repeatedly.

**Cause**: `is_active = FALSE` in the profiles table.

**Solution**: 
1. Check the teacher's profile in Supabase
2. Verify `is_active` column is set to `TRUE`
3. If not, update it manually or use the SQL command above

### Issue 2: Wrong Dashboard After Login
**Symptom**: User logs in but sees the wrong dashboard (e.g., student sees admin panel).

**Cause**: Incorrect `role` value in the profiles table.

**Solution**:
```sql
UPDATE profiles 
SET role = 'teacher' 
WHERE email = 'teacher@example.com';
```

### Issue 3: Account Disabled Error
**Symptom**: Login page shows `?error=account_disabled` in URL.

**Cause**: The teacher layout detected `is_active = FALSE`.

**Solution**: Activate the account using the steps above.

## Teacher Layout Security Checks

The teacher layout (`awasthi/src/app/(teacher)/layout.tsx`) performs these checks:

1. **Authentication Check**: Verifies user is logged in
2. **Role Check**: Ensures user has `role = 'teacher'`
3. **Active Status Check**: Confirms `is_active = TRUE`
4. **Cross-Role Redirect**: Redirects admins to `/admin`, students to `/student`

## Admin Controls

Admins can manage teacher accounts from:
- `/admin/teachers` - View and manage all teachers
- `/admin/teacher-courses` - Approve teacher-created courses

## Database Schema Reference

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    -- ... other fields
);
```

## Contact Information

For technical support:
- Email: AWASTHICLASSESHND@GMAIL.COM
- Phone: +91 78911 36255
- WhatsApp: 917891136255

## Notes

- RLS (Row Level Security) is currently DISABLED on all tables
- Teacher accounts should be active by default
- Manual intervention is only needed if `is_active` was accidentally set to `FALSE`
- The system uses Supabase Auth for authentication
- All role-based redirects happen in the layout files
