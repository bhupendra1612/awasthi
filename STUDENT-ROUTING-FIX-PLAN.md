# Student Routing Fix Plan

## 🔍 Problem Identified

There are **TWO conflicting student dashboard systems**:

1. **Original System**: `(protected)/dashboard/` - The working system
2. **New System I Created**: `(student)/` - Causing conflicts

## 🎯 Solution Plan

### Step 1: Merge Student Systems
- Move new student features from `(student)/` to `(protected)/`
- Keep the original `(protected)` layout and routing
- Remove the conflicting `(student)` directory

### Step 2: Fix Routing Redirects
- Update all layouts to redirect students to `/dashboard` (not `/student`)
- Ensure role-based routing works correctly:
  - `admin` → `/admin` ✅
  - `teacher` → `/teacher` ✅  
  - `student` → `/dashboard` (fix needed)

### Step 3: Update Navigation Links
- Update all internal links that point to `/student/*` to point to `/dashboard/*`
- Ensure the protected layout navigation works for students

## 🚀 Implementation Steps

### Phase 1: Update Layouts (Fix Redirects)
1. Update `(admin)/layout.tsx` - redirect students to `/dashboard`
2. Update `(teacher)/layout.tsx` - redirect students to `/dashboard`
3. Keep `(protected)/layout.tsx` as the main student system

### Phase 2: Move Student Features
1. Move student pages from `(student)/` to `(protected)/`
2. Update routes:
   - `/student/performance` → `/performance`
   - `/student/achievements` → `/achievements`
   - `/student/study-plan` → `/study-plan`
   - etc.

### Phase 3: Clean Up
1. Remove the `(student)/` directory entirely
2. Update any remaining links that point to `/student/*`

## 🎯 Final Result

**Single, unified student system:**
- Students register → become `role = 'student'` by default ✅
- Students login → redirected to `/dashboard` ✅
- Students access features at `/dashboard`, `/my-courses`, `/performance`, etc. ✅
- No routing conflicts ✅
- Original workflow preserved ✅

This will restore the original student workflow while keeping all the new features I created.