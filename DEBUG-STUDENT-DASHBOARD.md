# Debug Guide: Student Dashboard Not Showing Changes

## Quick Checklist

### ✅ Step 1: Verify You're on the Correct Page
- URL should be: `http://localhost:4002/student`
- NOT: `http://localhost:4002/dashboard`
- The student dashboard uses the `(student)` layout with sidebar

### ✅ Step 2: Restart Development Server
```bash
# Stop the server (Ctrl + C in terminal)
# Then restart:
cd awasthi
npm run dev
```

### ✅ Step 3: Hard Refresh Browser
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### ✅ Step 4: Check if Daily Tests Exist
Run this SQL in Supabase SQL Editor:
```sql
SELECT * FROM generated_daily_tests 
WHERE test_date = CURRENT_DATE 
AND status = 'published';
```

**Important**: The Daily Practice section only appears if there are tests for today!

### ✅ Step 5: Check Browser Console
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Look for any red errors
4. Take a screenshot if you see errors

## What Should You See

### Before Changes (Old):
- Stats: "Courses", "Tests Done", "Study Time", "Day Streak", "Avg Score", "Rank"
- Quick Actions: "Take Test", "Daily Practice" (links to separate page), "My Courses", "Performance"

### After Changes (New):
- Stats: "Enrolled Courses", "**Today's Practice**" (new!), "Tests Completed", "Day Streak", "Avg Score", "Rank"
- Quick Actions: "Take Test", "Daily Practice" (with badge showing count), "My Courses", "Performance"
- **New Section**: "Today's Daily Practice" with test cards (only if tests exist for today)

## Common Issues

### Issue 1: "I don't see any changes"
**Solution**: 
1. Stop dev server (Ctrl + C)
2. Delete `.next` folder: `rmdir /s /q .next` (Windows) or `rm -rf .next` (Mac/Linux)
3. Restart: `npm run dev`
4. Hard refresh browser

### Issue 2: "Daily Practice section not showing"
**Reason**: No tests available for today
**Solution**: 
1. Go to admin panel: `http://localhost:4002/admin/daily-tests`
2. Click "Generate New Test"
3. Make sure test date is TODAY
4. Click "Publish Test"
5. Refresh student dashboard

### Issue 3: "Stats still show old values"
**Reason**: Browser cache or server cache
**Solution**:
1. Clear browser cache completely
2. Restart dev server
3. Check if you're logged in as a student (not admin/teacher)

### Issue 4: "Page shows loading spinner forever"
**Reason**: Database connection issue or authentication problem
**Solution**:
1. Check browser console for errors
2. Verify `.env.local` has correct Supabase credentials
3. Try logging out and logging in again

## How to Verify Changes Were Made

Run this command in terminal:
```bash
cd awasthi
findstr /n "dailyTests" src\app\(student)\page.tsx
```

You should see multiple lines with `dailyTests` variable.

## Still Not Working?

1. **Take screenshots** of:
   - Your browser showing the student dashboard
   - Browser console (F12 → Console tab)
   - Terminal where dev server is running

2. **Check these files exist and have recent timestamps**:
   - `awasthi/src/app/(student)/page.tsx` (should be modified recently)

3. **Verify the route**:
   - Student dashboard: `/student` (uses student layout with sidebar)
   - Protected dashboard: `/dashboard` (uses protected layout with top nav)
   - Make sure you're on `/student`!
