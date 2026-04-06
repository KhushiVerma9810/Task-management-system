import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/env";
import authRoutes from "./modules/auth/auth.routes";
import taskRoutes from "./modules/tasks/tasks.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const allowedOrigins = config.corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;
