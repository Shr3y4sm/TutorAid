# Component Guidelines

## Component Placement

Use `src/components` for components that can be reused across modules.

Examples:

- `StatusBadge`
- themed primitives
- generic row/card primitives if introduced later

Use feature folders for feature-specific components:

```text
src/features/assignments/components/
src/features/courses/components/
src/features/student/components/dashboard/
src/features/student/components/profile/
```

## Reusable Component Rules

Reusable components should:

- Accept typed props
- Avoid fetching data directly
- Avoid navigation unless the component is specifically an interactive route card
- Avoid hardcoding feature-specific data
- Keep style definitions local unless a shared theme abstraction already exists

## Current Shared Components

`StatusBadge`

- Location: `src/components/StatusBadge.tsx`
- Supports `Pending`, `Submitted`, `Overdue`
- Intended reuse: Assignments, Attendance, Teacher Dashboard and future modules

## Current Feature Components

Assignment:

- `AssignmentCard`
- Displays title, course, due date, status badge, marks and description preview
- Navigates to existing course details route

Course:

- `CourseCard`
- Displays title, instructor, progress and student count
- Navigates to course details route

Student dashboard:

- `Header`
- `AttendanceCard`
- `QuickActions`
- `QuickActionCard`
- `ClassCard`
- `AnnouncementCard`

Student profile:

- `ProfileHeaderCard`
- `ProfileSectionCard`
- `ProfileInfoRow`
- `ProfileStatCard`
- `ProfileActionButton`

## Screen Composition

Screens should compose components in this order:

1. Local loading/error/refresh state.
2. API call through `src/api`.
3. Page container.
4. Reusable feature cards.
5. Empty state if returned data is empty.

## Style Conventions

Current app style:

- Page background: `#F5F7FB` or `#F8FAFC`
- Primary blue: `#2563EB`
- Text dark: `#111827`
- Muted text: `#64748B`
- Cards: white background, rounded corners, light elevation
- Destructive actions: `#DC2626`

Do not redesign existing screens when adding features.

