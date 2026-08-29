# Beta device test — end-to-end video call validation

This is the **acceptance gate** for the P1 "real video call" slice. Run it on
two **physical** devices (teacher + student) attached to the same Wi-Fi (or
preferably two networks once TURN is configured).

## Prerequisites

- [ ] Signalling server running (see `deploy/README.md` — locally: `docker compose up -d`)
- [ ] REST API running (Supabase URL + service-role key in `TutorAid-Backend/.env`)
- [ ] Mobile app points at the right API + signalling URL (`src/config/env.ts` or `app.json` `extra`)
- [ ] **TURN** configured if testing across different networks

## Test matrix

| # | Scenario | Pass | Notes |
|---|----------|------|-------|
| 1 | Teacher signs up/logs in, lands on dashboard | ☐ | camera/mic prompts appear |
| 2 | Teacher creates a schedule → sees it in list | ☐ | |
| 3 | Teacher taps **Start Class** → meeting code generated | ☐ | `meet_code` displayed (e.g. `TA-…`) |
| 4 | Student opens **Join Class**, enters the code | ☐ | student lands in the call |
| 5 | Both see the other's video + hear audio | ☐ | **the core gate** |
| 6 | Chat panel sends/receives messages | ☐ | |
| 7 | Teacher taps **End Class** | ☐ | attendance auto-marked present for joiner |
| 8 | Student's Attendance tab shows the class as Present | ☐ | |
| 9 | Student opens a **Resources** file from the shared repo | ☐ | |
| 10 | Notification arrives for resource upload / grading | ☐ | |

## Failure checklist

If steps 5–6 fail:
- [ ] Are both devices on the same network? Across networks → need TURN.
- [ ] `curl http://<signalling-host>:4000/stats` shows `connectedClients` > 0 during a call?
- [ ] App `src/features/video-call/config.ts` resolves the WSS URL?
- [ ] Camera/mic permission strings present in the built app (`app.json` `ios.infoPlist` / `android.permissions`)?
- [ ] Firewall allows UDP/TCP ranges used by WebRTC (often 10000–65535)?

## Sign-off

Record: date ______ · devices ______ · networks ______ · result ☐ PASS / ☐ FAIL