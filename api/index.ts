import "dotenv/config";
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import mongoose from "mongoose";
import authRoutes from "../server/routes/auth";
import blogRoutes from "../server/routes/blog";
import generalRoutes from "../server/routes/general";
import { handleDemo } from "../server/routes/demo";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Database connection state
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.warn("MONGODB_URI not set, database features will not work");
            return;
        }

        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Don't exit in serverless environment, just log the error
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", generalRoutes);

// Example API routes
app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
});

app.get("/api/demo", handleDemo);

// Path to the built static files
const distPath = resolve(__dirname, "../dist/spa");

// Serve static files
app.use(express.static(distPath));

// Fallback to index.html for SPA (client-side routing)
app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
        return next();
    }
    res.sendFile(join(distPath, "index.html"));
});

export default serverless(app);
