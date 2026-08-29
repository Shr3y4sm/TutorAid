# TutorAid 📚

A full-stack tutoring management platform that connects home tutors with their students — live classes, assignments, attendance, a resource repository, and AI teaching tools in a single mobile app.

---

## Overview

TutorAid consists of three applications:

| App | Description |
|-----|-------------|
| **Mobile App** | Cross-platform (iOS / Android / Web) client built with Expo & React Native, with separate role-based experiences for **teachers** and **students** |
| **REST API** | Node.js + Express backend handling business logic, backed by Supabase (PostgreSQL, Auth, Storage) |
| **Signalling Server** | Standalone WebSocket server coordinating WebRTC peer connections for live video classes |

## Features

### Teacher
- **Dashboard** — stats, quick actions, teacher code sharing
- **Students** — manage students and link them to your classroom
- **Assignments** — create, update, delete; view and grade student submissions
- **Attendance** — manual daily marking with per-student control
- **Schedule** — weekly class timetable with one-tap **Start Class**
- **Resources** — private folder repository: create folders, upload files, rename/delete; students get read-only access
- **Live Classes** — WebRTC video calls with chat and participant management
- **AI Assistant** — teacher productivity tools

### Student
- **Home dashboard** — attendance summary, today's classes, announcements
- **Join Class** — enter a meet code or join scheduled classes directly
- **Assignments** — view, submit, track grades and feedback
- **Attendance** — personal history and percentage
- **Resources** — browse the shared folder repository and open files
- **Notifications** — assignment, schedule, grading, resource and live-class alerts

### Automatic Attendance
When a teacher ends a live class, every student who **joined** is automatically marked present. Students who didn't join are left untouched — never falsely marked absent.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| Mobile | Expo (~56), React Native 0.85, expo-router, TypeScript |
| State / Data | Supabase JS client, Zustand |
| UI | Ionicons, custom themed components, react-native-safe-area-context |
| Backend | Node.js, Express, Multer (file uploads), Zod (validation) |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (`resources` bucket) |
| Video | WebRTC (`react-native-webrtc`) + custom WebSocket signalling server |

## Repository Structure

```text
TutorAid/
├── src/                        # Expo mobile app
│   ├── app/                    # File-based routes
│   │   ├── (auth)/             #   Login / signup flows
│   │   ├── (student)/          #   Student screens (tab layout)
│   │   ├── (teacher)/          #   Teacher screens (stack layout)
│   │   └── (video)/            #   Live class call screen
│   ├── api/                    # Typed REST clients per domain
│   ├── features/               # Feature modules (components, types, constants)
│   ├── components/             # Shared UI components
│   ├── services/               # Identity helpers (current user resolution)
│   ├── hooks/                  # Reusable React hooks
│   ├── theme/                  # Colors, spacing, typography tokens
│   └── config/                 # Env & Supabase client config
│
├── TutorAid-Backend/           # REST API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic (Supabase queries)
│   │   ├── routes/             # Express routers
│   │   ├── middleware/         # Auth (JWT), validation, uploads
│   │   ├── validators/         # Zod request schemas
│   │   └── utils/              # ApiResponse, notifications, etc.
│   ├── signalling-server/      # WebSocket server for WebRTC
│   └── supabase/               # SQL migrations to run manually
│
├── android/                    # Android native project (prebuild output)
└── assets/                     # Images, icons, splash assets
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- A **Supabase** project (free tier works)
- For video calls on physical devices: an [Expo development build](https://docs.expo.dev/develop/development-builds/introduction/) (`npx expo run:android`)

### 1. Database Setup

In your Supabase project's SQL editor:

1. Create the core tables for your deployment (users, classes, assignments, attendance, resources, meetings).
2. Run the migration scripts in `TutorAid-Backend/supabase/`:

| Script | Purpose |
|--------|---------|
| `resource_folders.sql` | Folder structure for the resource repository |
| `assignment_cascade_delete.sql` | Cascading deletes for assignments & submissions |
| `schedule_deletes.sql` | Safe schedule deletion with linked meetings |

3. Create a storage bucket named **`resources`**.

### 2. Backend API

```bash
cd TutorAid-Backend

# Configure environment
cp .env.example .env
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

npm install
npm run dev          # starts on http://localhost:3000
```

> Note: the backend uses the **service-role** key server-side. The mobile app
> uses the **anon** key only (see `src/config/env.ts`).

### 3. Signalling Server (for video calls)

```bash
cd TutorAid-Backend/signalling-server

cp .env.example .env # optional: PORT (default 4000), WS_PORT (default 8080)

npm install
npm start            # or: npm run signalling from TutorAid-Backend/
```

### 4. Mobile App

```bash
npm install

# Point the app at your API & signalling server via src/config/env.ts
# (dev defaults: API http://localhost:3000, signalling ws://localhost:8080/ws)
# Android emulators cannot reach localhost; use your machine's LAN IP in app.json:

npx expo start       # press a -> Android, i -> iOS, w -> web
```

### 5. Production environment

The app resolves configuration in this order (see `src/config/env.ts`):

1. **`EXPO_PUBLIC_*` env vars** — set these in your EAS build profile.
2. **`extra.*` in `app.json`** — static per build profile, always available.
3. **Dev defaults** — localhost endpoints + dev Supabase project.

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | Base URL of the REST API, e.g. `https://api.tutoraid.app` |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (safe for clients) |
| `EXPO_PUBLIC_SIGNALING_URL` | WebSocket URL of the signalling server, e.g. `wss://signal.tutoraid.app/ws` |
| `EXPO_PUBLIC_TURN_SERVERS` | JSON array of TURN relay servers (required for NAT traversal) |

#### Containerised deployment

```bash
# One-command boot of the REST API + signalling server
docker compose up -d --build

# Validate compose config without starting anything
docker compose config -q
```

See `Makefile` for shortcuts (`make compose-up`, `make compose-logs`, …).
The signalling server must be fronted with TLS/WSS for production browsers.

#### TURN servers (required for real-NAT video calls)

The video stack uses Google's public STUN by default — that works on a LAN
but **not** across NATs/firewalls. Deploy a TURN server (Xirsys, Metered, or
self-hosted coturn) and set it via `EXPO_PUBLIC_TURN_SERVERS`:

```
EXPO_PUBLIC_TURN_SERVERS=[{"urls":"turn:turn.example.com:3478","username":"tutoraid","credential":"secret"}]
```

The app reads this in `src/config/env.ts` and appends it to the ICE servers
in `src/features/video-call/config.ts`.

## Available Scripts

### Mobile app (root)

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server |
| `npm run android` | Build & run on Android |
| `npm run ios` | Build & run on iOS |
| `npm run web` | Run in the browser |
| `npx tsc --noEmit` | Type-check the app |

### Backend (`TutorAid-Backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload (nodemon) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npm run signalling` | Start the WebSocket signalling server |

## API Summary

All protected routes require `Authorization: Bearer <supabase-jwt>`.

| Prefix | Purpose | Write access |
|--------|---------|--------------|
| `POST /auth/*` | Signup / login | Public |
| `/teacher/students` · `/teacher/assignments` · `/teacher/attendance` · `/teacher/schedule` · `/teacher/ai` | Teacher operations | Teacher only |
| `/resources` (+ `/resources/folders`) | Resource repository & folders | Teacher writes, student reads |
| `/meetings` | Live class sessions (`start`, `join`, `end`) | End-of-meeting auto-marks attendance |
| `/assignments` · `/notifications` · `/courses` · `/attendance` | Shared student-facing data | Role-dependent |

## Key Design Decisions

- **Teacher identity is resolved server-side** from the JWT (`teachers.auth_user_id`), never trusted from the request body.
- **Folder ownership is enforced** on every write - teachers can only modify their own repository tree.
- **Notifications are fire-and-forget**: a notification failure can never fail the primary operation that triggered it.
- **Role-based middleware** (`authenticate`, `requireTeacher`) gates all mutating endpoints.
- **Attendance is canonical boolean** (`class_date`, `present`, `marked_by`) across auto-marking, manual marking and reporting.

## Roadmap

- [ ] Fee module - reminders, fee structures, per-student records
- [ ] Class recordings and call logs
- [ ] Weekly/monthly attendance summaries; cancelled-class notifications
- [ ] In-app messaging between tutors and students
- [ ] Student performance graphs
- [ ] In-class notes/pointers

## License

Distributed under the [MIT License](LICENSE).

