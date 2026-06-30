import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import apiRoutes from "./routes/api.js";
import User from "./models/User.js";

// Construct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config(); // fallback to local server .env

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://pugankumar2008_db_user:DxTyprY9vV8WJ9kw@cluster0.dcaeswj.mongodb.net/?appName=Cluster0";

// Middleware
app.use(cors({
  origin: true, // Allow client origin via proxy or headers
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Seed Admin User if not exists
async function seedAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      console.log("[MongoDB] Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("adminpassword123", 10);
      const defaultAdmin = new User({
        email: "admin@royalking.com",
        password: hashedPassword,
        fullName: "Royal King Admin",
        mobile: "+91 99940 77798",
        role: "admin"
      });
      await defaultAdmin.save();
      console.log("[MongoDB] Default admin user created: admin@royalking.com / adminpassword123");
    }
  } catch (error) {
    console.error("[MongoDB] Error seeding admin user:", error);
  }
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log(`[MongoDB] Connected successfully to database`);
    await seedAdmin();
  })
  .catch((err) => {
    console.error("[MongoDB] Connection error:", err.message);
  });

// Serve frontend in production
const frontendDistPath = path.join(__dirname, "../../dist");
app.use(express.static(frontendDistPath));

// Fallback to React Router in client-side SPA
app.get("*", (req, res, next) => {
  // If the request starts with /api, forward to routers (it will 404 there if undefined)
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, "index.html"), (err) => {
    if (err) {
      // If index.html does not exist yet (development mode), return standard message
      res.status(200).send("Royal King Insurance Agencies Backend API is running. (Front-end client build not found at /dist)");
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Express server running on http://localhost:${PORT}`);
});
