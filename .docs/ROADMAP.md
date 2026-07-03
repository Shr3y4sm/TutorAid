# TutorAid Roadmap

## Current Completed Modules

- Architecture cleanup
- Shared frontend API client
- Student dashboard shell
- Courses backend and frontend list
- Assignments backend and frontend list
- Shared `StatusBadge`
- Student profile backend and frontend screen
- Mock auth and role selection
- Backend health endpoint

## Immediate Stabilization

1. Repair or isolate deferred video TypeScript errors so frontend builds cleanly.
2. Replace hardcoded API base URL with environment-based configuration.
3. Remove or document unused dependencies.
4. Update `README.md` from Expo starter content to TutorAid-specific setup.
5. Decide whether generated `android/` should remain committed.

## Student Experience

1. Course detail completion.
2. Assignment detail screen.
3. Assignment filtering by status.
4. Real profile action flows:
   - Edit Profile
   - Change Password
   - Settings
   - Logout
5. AI Tutor implementation.

## Teacher Experience

1. Teacher dashboard data model.
2. Course/session creation.
3. Assignment creation and grading.
4. Student progress overview.
5. Attendance management.

## Backend Evolution

1. Standardize response shapes.
2. Add validation for request bodies and params.
3. Add error middleware.
4. Add environment validation.
5. Integrate Supabase when requested.

## Deferred Video

1. Confirm Stream SDK version and API surface.
2. Fix deprecated/missing SDK imports.
3. Install or migrate camera/audio permission dependencies.
4. Mount required video providers.
5. Connect teacher start-class flow to a working call lifecycle.

## Supabase

Supabase is not integrated yet. Planned areas:

- Authentication
- Students
- Courses
- Assignments
- Attendance
- Profiles
- Teacher data

