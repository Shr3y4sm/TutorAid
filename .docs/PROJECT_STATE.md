# TutorAid Project State

## Completed Modules

- Mock authentication screen
- Role selection screen
- Student tab navigation
- Student dashboard
- Courses list
- Course details shell
- Assignments list
- Student profile
- Shared status badge
- Backend health route
- Backend student dashboard route
- Backend student profile route
- Backend courses routes
- Backend assignments route
- Backend Stream route surface

## Pending Modules

- Supabase integration
- Real authentication/session persistence
- AI Tutor
- Assignment details
- Course detail completion
- Teacher dashboard data
- Teacher workflows
- Attendance backend/frontend module
- Settings screens
- Edit profile flow
- Change password flow
- Logout behavior
- Production-ready video calling

## Current Roadmap

1. Stabilize frontend build by resolving deferred video TypeScript errors.
2. Move API URL to an environment-driven setup.
3. Complete course details and assignment details.
4. Build teacher dashboard modules.
5. Add Supabase-backed persistence.
6. Resume Stream Video integration.
7. Add real auth and session handling.

## Known Bugs

- Frontend TypeScript fails in `src/video`.
- Video module imports SDK members that are not exported by the installed Stream SDK.
- Video module imports `expo-camera` and `expo-av`, which are not installed.
- Video providers are not mounted around routes that call video hooks.
- Teacher dashboard references video call flow and can fail at runtime if used.
- `npx` points to a missing global npm CLI on the current machine.
- `README.md` still contains starter Expo content.

## Build Status

Frontend TypeScript:

```powershell
cd D:\TutorAid
.\node_modules\.bin\tsc.cmd --noEmit
```

Status: fails only in deferred `src/video` module.

Backend TypeScript:

```powershell
cd D:\TutorAid\TutorAid-Backend
.\node_modules\.bin\tsc.cmd --noEmit
```

Status: passes.

## Video Module Status

Deferred. Route files, providers, services and components exist, but the module is not build-clean and should not be extended until the Stream SDK integration is intentionally resumed.

## Supabase Status

Deferred. No Supabase client, schema, environment variables or backend integration are currently implemented.

