# Coding Standards

## Language

- Use TypeScript for frontend and backend.
- Prefer explicit interfaces for API data shapes.
- Keep files focused on one responsibility.

## Scope Control

- Do not rewrite the project.
- Do not change folder structure unless requested.
- Do not refactor unrelated code.
- Preserve existing navigation.
- Preserve backend routes.
- Do not remove working functionality.
- Do not introduce placeholder TODOs.

## Frontend Standards

- Screens live under `src/app`.
- API calls live under `src/api`.
- Feature components live under `src/features/<feature>/components`.
- Shared reusable components live under `src/components`.
- Use existing visual language: white cards, blue accents, light gray page backgrounds, rounded card surfaces and Ionicons where already used.
- Data-backed screens should support loading, refresh, error and empty states.
- Use the shared `api<T>()` helper for HTTP calls.
- Avoid adding dependencies unless explicitly requested.

## Backend Standards

- Routes should be thin and map paths to controllers.
- Controllers should return consistent JSON responses.
- Mock data should live in `src/data`.
- Services should be used for integrations or stateful domain operations.
- Mount new routers in `src/app.ts`.

## Naming Conventions

- Components: PascalCase, for example `AssignmentCard`.
- Hooks: camelCase with `use` prefix.
- API functions: verb + resource, for example `getAssignments`.
- Backend route files: `<resource>.routes.ts`.
- Backend controller files: `<resource>.controller.ts`.
- Backend data files: `<resource>.data.ts`.
- TypeScript interfaces: PascalCase, for example `StudentProfile`.

## Import Conventions

- Use `@/` path alias for frontend imports from `src`.
- Use relative imports inside the backend.
- Avoid importing backend modules into frontend code.
- Avoid feature-to-feature imports unless the component is intentionally shared. Promote cross-feature UI to `src/components`.

## Validation

Run frontend TypeScript:

```powershell
cd D:\TutorAid
.\node_modules\.bin\tsc.cmd --noEmit
```

Run backend TypeScript:

```powershell
cd D:\TutorAid\TutorAid-Backend
.\node_modules\.bin\tsc.cmd --noEmit
```

Current note: frontend TypeScript fails only in the deferred `src/video` module.

