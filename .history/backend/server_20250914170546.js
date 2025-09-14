import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";

dotenv.config();
const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://mini-crm-karthikmallar.vercel.app', 'https://mini-crm.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Quiet favicon requests
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Simple root message so / doesn't 404
app.get('/', (req, res) => res.json({ service: 'Mini CRM API', status: 'ok' }));

// Quick app-level pings to verify path
app.get('/ping', (req, res) => res.json({ ok: true, at: '/ping' }));
app.get('/api/ping', (req, res) => res.json({ ok: true, at: '/api/ping' }));
app.get('/api/auth/ping', (req, res) => res.json({ ok: true, at: '/api/auth/ping (app)' }));

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
