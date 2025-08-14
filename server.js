import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import profiles from "./routes/profiles.js";

const app = express();

// CORS
const allowed = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow curl / same-origin
    if (allowed.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS: " + origin));
  }
}));

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/profiles", profiles);

const PORT = process.env.PORT || 8080;

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log("API on :" + PORT));
})();
