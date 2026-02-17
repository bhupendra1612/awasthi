# Create Second Admin Account

## Admin Details
- **Email:** awasthiclasses1@gmail.com
- **Password:** 123@admin#
- **Role:** Admin

---

## Method 1: Through Supabase Dashboard (RECOMMENDED)

### Step 1: Create User in Supabase Auth
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **pwgeyamdfnaeknlovvqs**
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"** button
5. Fill in the details:
   - **Email:** `awasthiclasses1@gmail.com`
   - **Password:** `123@admin#`
   - **Auto Confirm User:** ✅ Check this box
6. Click **"Create User"**

### Step 2: Set Admin Role
After the user is created, you have two options:

#### Option A: Using SQL Editor (Easiest)
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste this SQL:

```sql
-- Update profile to admin role
UPDATE profiles 
SET role = 'admin',
    full_name = 'Awasthi Classes Admin'
WHERE email = 'awasthiclasses1@gmail.com';

-- Verify the admin was created
SELECT id, email, role, full_name, created_at
FROM profiles
WHERE email IN ('thedeeptrading24@gmail.com', 'awasthiclasses1@gmail.com')
ORDER BY email;
```

3. Click **"Run"**
4. You should see both admin accounts listed

#### Option B: Using the SQL file
1. Run the SQL file: `add-second-admin.sql`

---

## Method 2: Manual Signup (Alternative)

### Step 1: Sign Up Through Website
1. Go to your website: https://your-domain.com/signup
2. Sign up with:
   - Email: awasthiclasses1@gmail.com
   - Password: 123@admin#
3. Verify email if required

### Step 2: Promote to Admin
1. Go to Supabase Dashboard → **SQL Editor**
2. Run this SQL:

```sql
UPDATE profiles 
SET role = 'admin',
    full_name = 'Awasthi Classes Admin'
WHERE email = 'awasthiclasses1@gmail.com';
```

---

## Verification

After creating the admin, verify by running this SQL:

```sql
-- Show all admins
SELECT id, email, role, full_name, created_at
FROM profiles
WHERE role = 'admin'
ORDER BY created_at;
```

You should see:
1. thedeeptrading24@gmail.com (Admin)
2. awasthiclasses1@gmail.com (Admin)

---

## Testing Admin Access

1. **Logout** from current account
2. **Login** with: awasthiclasses1@gmail.com / 123@admin#
3. You should see:
   - Admin link in navigation
   - Access to `/admin` dashboard
   - All admin features available

---

## Security Notes

⚠️ **IMPORTANT:**
- Change the password after first login
- Use a strong password in production
- Never commit passwords to Git
- Consider using environment variables for admin emails

---

## Troubleshooting

### Issue: User created but no admin access
**Solution:** Run the UPDATE SQL query to set role = 'admin'

### Issue: Profile doesn't exist
**Solution:** The profile should be created automatically on signup. If not, run:

```sql
INSERT INTO profiles (id, email, role, full_name)
SELECT 
    id,
    email,
    'admin',
    'Awasthi Classes Admin'
FROM auth.users
WHERE email = 'awasthiclasses1@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'awasthiclasses1@gmail.com'
);
```

### Issue: Can't login
**Solution:** 
1. Check if email is confirmed in Supabase Auth
2. Reset password through Supabase Dashboard
3. Check if user exists in auth.users table

---

## Current Admins

After setup, you will have:

| Email | Role | Name |
|-------|------|------|
| thedeeptrading24@gmail.com | Admin | Admin |
| awasthiclasses1@gmail.com | Admin | Awasthi Classes Admin |

---

## Next Steps

After creating the second admin:
1. ✅ Test login with new admin account
2. ✅ Verify admin dashboard access
3. ✅ Change password to something secure
4. ✅ Delete the API route: `src/app/api/admin/create-admin-user/route.ts`
5. ✅ Delete this guide if you want (or keep for reference)
