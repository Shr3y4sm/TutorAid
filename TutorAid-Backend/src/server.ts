import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("🚀 TutorAid Backend Started");
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🌐 http://10.184.246.132:${PORT}`);
  console.log("=================================");
});