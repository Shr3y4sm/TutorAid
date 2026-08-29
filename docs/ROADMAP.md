# TutorAid — Shipping Roadmap

Status legend: ✅ done · 🚧 in progress · ⬜ planned

> This file is the single source of truth for what stands between the current
> `main` and real users. When a task is done, tick its box and add a short note.

---

## Phase 1 — Foundation for a first shippable build

Goal: a teacher + student app that reliably does **schedule → live class →
resources → attendance** against real infrastructure.

### Configuration & builds
- [x] `src/config/env.ts` — resolve `API_BASE_URL`, Supabase URL/key, signalling URL and TURN list from `EXPO_PUBLIC_*` → `app.json extra` → dev defaults. No hardcoded endpoint in source.
- [x] `src/config/supabase.ts` — read URL/anon key from `./env`.
- [x] `app.json` — `extra` exposes `apiBaseUrl`, `supabaseUrl`, `supabaseAnonKey`, `signalingUrl`, `turnServers`.
- [x] `.env.example` (mobile), `TutorAid-Backend/.env.example`, `signalling-server/.env.example` — accurate templates, no dead `STREAM_*`/`JWT_SECRET`.
- [ ] Create production Supabase project; run all migrations in `TutorAid-Backend/supabase/`.
- [ ] Build `eas.json` `preview` profile that injects prod `EXPO_PUBLIC_*` (env substitution at build time).
- [ ] Generate Android keystore + iOS distribution cert; wire EAS `submit`.

### Containerisation & deployment
- [x] `TutorAid-Backend/Dockerfile` — multi-stage TS build → small runtime image.
- [x] `docker-compose.yml` — `api` + `signalling` services with port and env wiring.
- [x] `Makefile` — compose shortcuts.
- [ ] Deploy `api` + `signalling` behind a reverse proxy (Caddy/Nginx) with TLS; set `TLS_*` for WSS.
- [ ] Add health-check based automatic restart; confirm `/health` + `/stats` reachable.

### Networking / video
- [ ] Deploy a TURN server (Xirsys, Metered, or self-hosted coturn) for NAT traversal beyond LAN.
- [ ] Set `EXPO_PUBLIC_TURN_SERVERS` on the device build; verify a call works across two different networks.
- [ ] Confirm camera/mic permission strings in `app.json` render correctly in EAS builds.

### V1 feature slices
- [ ] **Call log / history** — a screen listing past meetings (reuse `getTeacherMeetings`/`getStudentLiveMeetings`).
- [ ] **Class pointer notes** — `class_notes` table + in-call FAB to jot notes about a student/class.
- [ ] **Cancellation auto-notify** — `DELETE /schedules/:id` emits notifications to enrolled students.
- [ ] **Fee reminders (light)** — `fee_reminders` table + daily job + in-app "Fees" screen + push notification.

### Quality gates
- [ ] `npx tsc --noEmit` clean on mobile + backend.
- [ ] Basic smoke test: signup → create schedule → start class → join → end → attendance marked.
- [ ] Distribute internal test build (Expo Go QR for Android / TestFlight for iOS) to a 10–20 user beta.

---

## Phase 2 — Public release & growth

- [ ] App store submission (screenshots, privacy policy for camera/mic, EAS `submit`).
- [ ] Web beta: since `react-native-webrtc` is unreliable on iOS Safari, offer a browser join via a managed video iframe (Jitsi) for web users.
- [ ] Performance graphs (`victory-native` or `react-native-svg-charts`) on existing grading/attendance data.
- [ ] Question-paper tagging: extend resources with a `type` enum (`note | paper | solution`) + filter UI.
- [ ] Persistent in-app messaging (conversations/messages tables + Supabase Realtime).
- [ ] Weekly/monthly summary: cron rollup into `summaries` table + "Reports" tab.

---

## Phase 3 — Scale (500–5k MAU)

- [ ] Supabase Pro plan; connection pooling; Storage CDN; backups/PITR; hardened RLS on every table.
- [ ] Signalling: multiple instances behind sticky-session LB; Redis adapter for cross-instance rooms; graceful shutdown.
- [ ] Backend: container deploy to autoscaled Fargate/Render; add rate limiting + Helmet; Sentry.
- [ ] Mobile: EAS Updates for JS-only hotfixes, offline cache for resources.
- [ ] Monitoring: health + `/stats` uptime checks; alert on error rate / room health.

---

## Phase 4 — Beyond 5k MAU

- [ ] Migrate video to a managed SFU (Agora/Daily/Twilio) to offload NAT, recording, and SFU scaling.
- [ ] Split into services: meeting / resource / notification / billing.
- [ ] Dedicated cron worker (BullMQ / Supabase Edge Functions) for reminders + summaries + recording retention.
- [ ] Multi-region Supabase + backend.

---

## Feature backlog (informed by product asks)

| Feature | Phase | Notes |
|---------|-------|-------|
| Video calling | 1 (infra) | manual WebRTC works; needs TURN + TLS in prod |
| Scheduling + meeting IDs | ✅ | already on main |
| Recording classes | 3 | prefer server-side/SFU recording over client capture |
| Call logs | 1 | add history screen on existing endpoints |
| Upload notes/homework + notifications | ✅ | resource folders + notify util on main |
| Fee reminders | 1 (light) | in-app + push |
| Fee calculation (variable structures) | 2–3 | billing service |
| Separate per-student record | ✅ | schema on main |
| In-class pointers/notes | 1 | DB already has notes; needs UI |
| In-app messaging | 2 | persistent, not connection-scoped |
| Auto-notify on class cancellation | 1 | hook into schedule delete |
| Weekly/monthly summary | 2 | rollup job + reports tab |
| Question papers / answer sheets | 2 | resource `type` tag |
| Student performance graphs | 2 | charts on grading/attendance |

---

## Notes

- WebRTC media path relies purely on STUN by default — LAN/emulator calls work, real-NAT calls need TURN. This is the single biggest production readiness gap.
- The Express backend is already mounted behind `authenticate` everywhere except `/auth` and `/health`; no objection to adding `express-rate-limit` + Helmet in Phase 3.
- The signalling Docker directory uses `--omit=dev` production install — keep `node_modules` out of the image.