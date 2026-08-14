# Video Calling Feature - Build Progress

## Phase 1: Production-Ready Signalling Server
- [ ] Add .env config support (.env file + dotenv)
- [ ] Add CORS support
- [ ] Add /health endpoint
- [ ] Add WSS (TLS) support
- [ ] Improve error handling and logging
- [ ] Add Dockerfile
- [ ] Add start script (nodemon for dev, node for prod)
- [ ] Write signalling-server README

## Phase 2: Self-Contained Feature Module (video-call-feature/)
- [ ] Create directory structure
- [ ] Create config.ts (server URL + TURN resolution)
- [ ] Create types.ts (shared types)
- [ ] Create signallingClient.ts (WebSocket client with reconnection)
- [ ] Create useVideoCall.ts (unified cross-platform hook with all fixes)
- [ ] Create components (VideoTile, ControlsBar, ParticipantsModal, ChatPanel)
- [ ] Create VideoCallScreen.tsx (main screen)
- [ ] Package.json for the feature module

## Phase 3: Demo App Updates (TutorAid_1/)
- [ ] Add iOS permission descriptions to app.json
- [ ] Update video.tsx to be thin wrapper
- [ ] Update video.web.tsx to be thin wrapper
- [ ] Update index.tsx to pass configurable server URL

## Phase 4: Documentation
- [ ] Write INTEGRATION.md
- [ ] Write root README.md
