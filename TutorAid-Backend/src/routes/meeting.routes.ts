import { Router } from "express";

import {
  startMeeting,
  joinMeeting,
  endMeeting,
  getMeeting,
  getParticipants,
  getTeacherMeetings,
  getStudentLiveMeetings,
} from "../controllers/meeting.controller";

const router = Router();

// Public-ish meeting operations (called from the video-call screen)
router.post("/start", startMeeting);
router.post("/join", joinMeeting);
router.post("/end", endMeeting);

// Meeting lookup
router.get("/teacher/:teacherId", getTeacherMeetings);
router.get("/student/:studentId", getStudentLiveMeetings);
router.get("/:code/participants", getParticipants);
router.get("/:code", getMeeting);

export default router;