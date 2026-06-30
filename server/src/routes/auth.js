import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import { authenticate } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Helper to construct a Supabase-compatible session object
const makeSession = (user, token) => {
  return {
    access_token: token,
    token_type: "bearer",
    expires_in: 3600,
    user: {
      id: user._id.toString(),
      email: user.email,
      role: "authenticated",
      user_metadata: {
        full_name: user.fullName,
        mobile: user.mobile
      }
    }
  };
};

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName, mobile } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      mobile,
      role: "customer" // default role
    });

    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      token,
      session: makeSession(user, token)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /login (Customer login only)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.role === "admin") {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    // --- Record login event (non-blocking) ---
    try {
      const clientIp =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "Unknown";
      const userAgent = req.headers["user-agent"] || "Unknown";

      await LoginHistory.create({
        user: user._id,
        ipAddress: clientIp,
        deviceInfo: userAgent
      });
    } catch (logErr) {
      console.error("[LoginHistory] Failed to save login record:", logErr.message);
    }
    // -----------------------------------------

    res.status(200).json({
      token,
      session: makeSession(user, token)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /admin-login (Admin login only)
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d"
    });

    // --- Record login event (non-blocking) ---
    try {
      const clientIp =
        req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
        req.socket?.remoteAddress ||
        "Unknown";
      const userAgent = req.headers["user-agent"] || "Unknown";

      // 1. Save to Database
      await LoginHistory.create({
        user: user._id,
        ipAddress: clientIp,
        deviceInfo: userAgent
      });

      // 2. Save to File in server/logs folder
      try {
        const logDir = path.join(__dirname, "../../logs");
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        const logFilePath = path.join(logDir, "admin-access.log");
        const logLine = `[${new Date().toISOString()}] Admin Login: Email=${user.email}, IP=${clientIp}, Agent=${userAgent}\n`;
        fs.appendFileSync(logFilePath, logLine, "utf8");
      } catch (fileErr) {
        console.error("[LoginHistory] Failed to write access log to file:", fileErr.message);
      }

    } catch (logErr) {
      console.error("[LoginHistory] Failed to save login record:", logErr.message);
    }
    // -----------------------------------------

    res.status(200).json({
      token,
      session: makeSession(user, token)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /session
router.get("/session", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || "";

    res.status(200).json({
      session: makeSession(user, token)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /reset-password-request
router.post("/reset-password-request", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }
    // Simulate reset email link
    res.status(200).json({ message: "Reset token generated and sent to email successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /reset-password-update
router.post("/reset-password-update", authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user?.id, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
