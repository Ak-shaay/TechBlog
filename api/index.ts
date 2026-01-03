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

// Database connection state (cached for serverless)
let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            console.warn("⚠️ MONGODB_URI not set, database features will not work");
            return;
        }

        // Mongoose connection options optimized for serverless
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        isConnected = false;
        // Don't throw - allow the function to continue without DB
    }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database middleware error:", error);
    }
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", generalRoutes);

// Example API routes
app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({
        message: ping,
        timestamp: new Date().toISOString(),
        dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

app.get("/api/demo", handleDemo);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Path to the built static files
const distPath = resolve(__dirname, "../dist/spa");

// Serve static files
app.use(express.static(distPath));

// Fallback to index.html for SPA (client-side routing)
app.get("*", (req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api") || req.path.startsWith("/health")) {
        return next();
    }

    // Serve the SPA for all other routes
    res.sendFile(join(distPath, "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            res.status(500).json({ error: "Error loading application" });
        }
    });
});

// Export the serverless handler
export default serverless(app);
