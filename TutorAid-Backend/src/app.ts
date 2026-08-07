import express from "express";
import cors from "cors";

import streamRoutes from "./routes/stream.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";
import assignmentRoutes from "./routes/assignment.routes";
import attendanceRoutes from "./routes/attendance.routes";
import notificationRoutes from "./routes/notification.routes";
import teacherRoutes from "./routes/teacher.routes";
import teacherStudentRoutes from "./routes/teacherStudent.routes";
import teacherAssignmentRoutes from "./routes/teacherAssignment.routes";
import teacherAttendanceRoutes from "./routes/teacherAttendance.routes";
import teacherScheduleRoutes from "./routes/teacherSchedule.routes";
import teacherAiRoutes from "./routes/teacherAi.routes";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { getResourceStats } from "./controllers/resource.controller";
import router from "./routes/resource.routes";
import { authenticate } from "./middleware/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TutorAid Backend Running",
    version: "1.0.0",
  });
});

// Public routes (no authentication required)
app.use("/auth", authRoutes);

// Protected routes (authentication required)
app.use("/stream", authenticate, streamRoutes);
app.use("/student", authenticate, studentRoutes);
app.use("/courses", authenticate, courseRoutes);
app.use("/assignments", authenticate, assignmentRoutes);
app.use("/attendance", authenticate, attendanceRoutes);
app.use("/notifications", authenticate, notificationRoutes);

// IMPORTANT: More specific /teacher/* routes must be mounted BEFORE
// the generic /teacher route. Otherwise Express matches the prefix
// "/teacher" first and never reaches the sub-routers below.
app.use("/teacher/students", authenticate, teacherStudentRoutes);
app.use("/teacher/assignments", authenticate, teacherAssignmentRoutes);
app.use("/teacher/attendance", authenticate, teacherAttendanceRoutes);
app.use("/teacher/schedule", authenticate, teacherScheduleRoutes);
app.use("/teacher/ai", authenticate, teacherAiRoutes);
app.use("/teacher", authenticate, teacherRoutes);

app.use("/resources", authenticate, router);

app.use(errorMiddleware);
export default app;
