# Frontend Architecture

## Framework

The frontend is an Expo SDK 56 app using React Native 0.85, Expo Router and TypeScript. The app entry is `expo-router/entry` from `package.json`.

## Folder Responsibilities

```text
src/app/
```
Expo Router route files. Route groups are used for auth, student, teacher and video flows.

```text
src/api/
```
Typed request wrappers. Each backend resource should have one file here, and all files should use `api<T>()` from `src/api/client.ts`.

```text
src/components/
```
Reusable shared components that can be used by multiple features. Current examples include `StatusBadge`, themed text/view wrappers and external link helpers.

```text
src/features/
```
Feature-specific UI and types. Components that only serve one feature should stay inside that feature.

```text
src/config/
```
Frontend environment/config values. `API_BASE_URL` currently lives here.

```text
src/video/
```
Deferred Stream Video implementation. This module currently contains type errors and should not be used as a pattern for new features until it is resumed and repaired.

## Routing

Root layout:

- `src/app/_layout.tsx` configures the root `Stack` and theme provider.

Auth:

- `src/app/(auth)/_layout.tsx`
- `src/app/(auth)/login.tsx`
- `src/app/(auth)/role-selection.tsx`

Student:

- `src/app/(student)/_layout.tsx`
- Uses `Tabs`
- Contains Home, Courses, Assignments, AI Tutor and Profile tabs
- Hides `course-details` from the tab bar with `href: null`

Teacher:

- `src/app/(teacher)/_layout.tsx`
- `src/app/(teacher)/dashboard.tsx`

Video:

- `src/app/(video)/_layout.tsx`
- `src/app/(video)/join.tsx`
- `src/app/(video)/call.tsx`
- Deferred and currently not build-clean

## Screen Structure

Screens should:

- Live in `src/app`
- Keep route-specific state and data loading
- Import API functions from `src/api`
- Import reusable UI from `src/components` or feature component folders
- Avoid embedding large card layouts directly when they can become feature components
- Support loading, refresh, error and empty states for backend-backed screens

## Current Feature Component Hierarchy

Student dashboard:

```text
src/features/student/components/dashboard/
  Header.tsx
  AttendanceCard.tsx
  QuickActions.tsx
  QuickActionCard.tsx
  ClassCard.tsx
  AnnouncementCard.tsx
```

Student profile:

```text
src/features/student/components/profile/
  ProfileHeaderCard.tsx
  ProfileSectionCard.tsx
  ProfileInfoRow.tsx
  ProfileStatCard.tsx
  ProfileActionButton.tsx
```

Courses:

```text
src/features/courses/components/CourseCard.tsx
```

Assignments:

```text
src/features/assignments/components/AssignmentCard.tsx
```

Shared:

```text
src/components/StatusBadge.tsx
```

## Frontend API Pattern

Use:

```text
src/api/client.ts
```

Create one API file per resource:

```text
src/api/courses.ts
src/api/assignments.ts
src/api/profile.ts
```

Pattern:

```ts
interface ResourceResponse {
  success: boolean;
  data: Resource;
}

export async function getResource() {
  const response = await api<ResourceResponse>("/resource");
  return response.data;
}
```

## Current Frontend Modules

- Auth: mock login and role selection
- Student home: local mock dashboard data
- Courses: backend-backed list
- Assignments: backend-backed list
- Profile: backend-backed profile
- Teacher dashboard: shell that references video flow
- Video: deferred

