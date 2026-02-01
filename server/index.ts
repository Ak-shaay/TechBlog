import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import blogRoutes from "./routes/blog";
import generalRoutes from "./routes/general"; // Added this line
import influencerRoutes from "./routes/influencer";
import revenueRoutes from "./routes/revenue";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Connect to Database
  connectDB();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/influencers", influencerRoutes);
  app.use("/api/revenue", revenueRoutes);
  app.use("/api", generalRoutes); // Added this line

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
