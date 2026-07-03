# TutorAid Project Architecture

## Stack

TutorAid is a TypeScript project with a mobile-first Expo frontend and an Express backend.

- Frontend: Expo SDK 56, React Native 0.85, Expo Router, TypeScript
- Backend: Express 5, TypeScript
- Data today: in-memory mock data
- Database: Supabase deferred
- Video: Stream Video deferred

## Current Top-Level Structure

```text
D:\TutorAid
  assets/                 Static images, app icons and splash assets
  scripts/                Project utility scripts
  src/                    Expo frontend source
  TutorAid-Backend/       Express backend source
  android/                Generated native Android project
  .docs/                  Engineering documentation
  app.json                Expo configuration
  package.json            Frontend package and scripts
  tsconfig.json           Frontend TypeScript configuration
```

## Frontend Source Structure

```text
src/
  api/                    Typed frontend API wrappers
  app/                    Expo Router screens and layouts
  auth/                   Mock auth screen/service
  components/             Shared UI components
  config/                 Frontend configuration
  constants/              Theme constants
  features/               Feature-specific UI, data and types
  hooks/                  Shared hooks
  store/                  Zustand stores, currently unused
  video/                  Deferred Stream Video module
```

## Backend Source Structure

```text
TutorAid-Backend/src/
  app.ts                  Express app composition and route mounting
  server.ts               Server startup
  config/                 Backend configuration
  controllers/            Request handlers
  data/                   Mock data
  routes/                 Express routers
  services/               Service layer integrations
```

## Current Routing

Expo Router owns frontend navigation under `src/app`.

- `/` redirects to `/(auth)/login`
- `/(auth)/login` renders login
- `/(auth)/role-selection` lets a mock user choose student or teacher
- `/(student)` is a tab group
- `/(teacher)` is a stack group
- `/(video)` is a stack group for deferred video screens

Student tabs:

- `/(student)/home`
- `/(student)/courses`
- `/(student)/assignments`
- `/(student)/ai`
- `/(student)/profile`
- `/(student)/course-details` exists but is hidden from the tab bar

## Data Flow

1. Screens call typed helpers in `src/api`.
2. API helpers use the shared `api<T>()` function in `src/api/client.ts`.
3. `api<T>()` builds URLs from `src/config/env.ts`.
4. Backend routes return `{ success, data }` for resource endpoints.
5. Screens store fetched data in local component state.
6. Screens render loading, refresh, error and empty states where implemented.

## Completed Features

- Mock login
- Role selection
- Student dashboard
- Courses list
- Course detail shell
- Assignments list
- Student profile
- Basic teacher dashboard shell
- Backend health endpoint
- Backend course endpoints
- Backend assignment endpoint
- Backend student dashboard/profile endpoints

## Deferred Features

- Supabase persistence and authentication
- Stream Video production-ready integration
- AI Tutor implementation
- Assignment detail route
- Editable profile flows
- Teacher class management
- Real logout/session handling

## Known Technical Debt

- Frontend TypeScript fails in deferred video files.
- `npx` is broken on the current machine; local binaries are used.
- `src/store` Zustand stores exist but are not wired into screens.
- `README.md` still contains Expo starter content.
- API base URL is hardcoded in `src/config/env.ts`.
- Some dependencies appear unused after cleanup.
- `TutorAid-Backend/server.js` is empty.
- The Android folder exists in the repo and should be treated as generated native output unless native changes are intentional.

