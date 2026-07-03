# Backend Architecture

## Framework

The backend is an Express 5 app written in TypeScript. It runs from `TutorAid-Backend/src/server.ts` and composes routes in `TutorAid-Backend/src/app.ts`.

## Folder Responsibilities

```text
TutorAid-Backend/src/app.ts
```
Creates the Express app, applies middleware and mounts routers.

```text
TutorAid-Backend/src/server.ts
```
Loads environment variables and starts the HTTP server.

```text
TutorAid-Backend/src/routes/
```
Defines Express routers. Route files should only map HTTP paths to controller functions.

```text
TutorAid-Backend/src/controllers/
```
Request handlers. Controllers shape HTTP responses and call data/service functions.

```text
TutorAid-Backend/src/data/
```
Mock data used before Supabase integration.

```text
TutorAid-Backend/src/services/
```
Service integrations and stateful domain helpers. Stream service currently lives here.

```text
TutorAid-Backend/src/config/
```
Backend configuration helpers.

## Middleware

Current app middleware:

- `cors()`
- `express.json()`

## Mounted Routes

`app.ts` currently mounts:

- `/stream`
- `/student`
- `/courses`
- `/assignments`

## Route Architecture

Existing pattern:

1. Add mock data in `src/data/*.data.ts`.
2. Add controller in `src/controllers/*.controller.ts`.
3. Add router in `src/routes/*.routes.ts`.
4. Mount router in `src/app.ts`.

Example:

```text
course.data.ts -> course.controller.ts -> course.routes.ts -> app.ts
```

## Current Backend Modules

Student:

- `GET /student/dashboard`
- `GET /student/profile`
- Data source: `student.data.ts`

Courses:

- `GET /courses`
- `GET /courses/:id`
- Data source: `course.data.ts`

Assignments:

- `GET /assignments`
- Data source: `assignment.data.ts`

Stream:

- `POST /stream/token`
- `POST /stream/create-call`
- `GET /stream/active-call`
- `POST /stream/end-call`
- Status: deferred integration surface

Health:

- `GET /health`

## Response Shape

Resource endpoints use:

```json
{
  "success": true,
  "data": {}
}
```

Stream endpoints currently use a mix of:

```json
{
  "success": true,
  "token": "...",
  "userId": "..."
}
```

and:

```json
{
  "success": true,
  "callId": "..."
}
```

## Environment

The backend loads `.env` through `dotenv`.

Current required Stream variables:

- `STREAM_API_KEY`
- `STREAM_SECRET`

Supabase variables are not present yet.

