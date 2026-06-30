import express from "express";
import cors from "cors";

import streamRoutes from "./routes/stream.routes";

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

export default app;