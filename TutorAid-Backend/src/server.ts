import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
console.log("🚀 TutorAid Backend Started");
console.log(`Running on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
console.log("=================================");
});