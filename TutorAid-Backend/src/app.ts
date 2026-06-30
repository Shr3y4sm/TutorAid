import express from "express";
import cors from "cors";

import streamRoutes from "./routes/stream.routes";
import studentRoutes from "./routes/student.routes";
import courseRoutes from "./routes/course.routes";

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

app.use("/stream", streamRoutes);

app.use("/student", studentRoutes);

app.use("/courses", courseRoutes);

export default app;