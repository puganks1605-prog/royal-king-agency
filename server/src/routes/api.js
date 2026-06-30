import { Router } from "express";
import User from "../models/User.js";
import QuoteRequest from "../models/QuoteRequest.js";
import ContactMessage from "../models/ContactMessage.js";
import LoginHistory from "../models/LoginHistory.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

// ==========================================
// PROFILES ENDPOINTS
// ==========================================

// GET /api/profiles/me
router.get("/profiles/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      full_name: user.fullName || "",
      mobile: user.mobile || "",
      role: user.role,
      created_at: user.createdAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/profiles/me
router.put("/profiles/me", authenticate, async (req, res) => {
  try {
    const { full_name, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { fullName: full_name, mobile },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      full_name: user.fullName || "",
      mobile: user.mobile || "",
      role: user.role,
      created_at: user.createdAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// QUOTE REQUESTS ENDPOINTS
// ==========================================

// Helper to format Mongoose QuoteRequest to frontend schema
const formatQuote = (quote) => {
  return {
    id: quote._id.toString(),
    user_id: quote.user_id.toString(),
    full_name: quote.fullName,
    email: quote.email,
    mobile: quote.mobile,
    insurance_type: quote.insurance_type,
    vehicle_details: quote.vehicle_details,
    property_details: quote.property_details,
    notes: quote.notes,
    status: quote.status,
    quoted_premium: quote.quoted_premium,
    admin_response: quote.admin_response,
    created_at: quote.createdAt.toISOString(),
    updated_at: quote.updatedAt.toISOString()
  };
};

// POST /api/quotes
router.post("/quotes", authenticate, async (req, res) => {
  try {
    const {
      full_name,
      email,
      mobile,
      insurance_type,
      vehicle_details,
      property_details,
      notes
    } = req.body;

    const newQuote = new QuoteRequest({
      user_id: req.user?.id,
      fullName: full_name,
      email,
      mobile,
      insurance_type,
      vehicle_details,
      property_details,
      notes,
      status: "pending"
    });

    await newQuote.save();
    res.status(201).json(formatQuote(newQuote));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/quotes (GET user quotes or ALL quotes if Admin)
router.get("/quotes", authenticate, async (req, res) => {
  try {
    let quotes;
    if (req.user?.role === "admin") {
      quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    } else {
      quotes = await QuoteRequest.find({ user_id: req.user?.id }).sort({ createdAt: -1 });
    }

    res.json(quotes.map(formatQuote));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/quotes/:id (Admin update premium / status / response)
router.patch("/quotes/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, admin_response, quoted_premium } = req.body;

    const updated = await QuoteRequest.findByIdAndUpdate(
      req.params.id,
      { status, admin_response, quoted_premium },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Quote request not found" });
    }

    res.json(formatQuote(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// CONTACT MESSAGES ENDPOINTS
// ==========================================

// POST /api/contact (Public submit message)
router.post("/contact", async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      mobile,
      subject,
      message
    });

    await newMessage.save();

    res.status(201).json({
      id: newMessage._id.toString(),
      name: newMessage.name,
      email: newMessage.email,
      mobile: newMessage.mobile,
      subject: newMessage.subject,
      message: newMessage.message,
      created_at: newMessage.createdAt.toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contact (Admin only retrieve messages)
router.get("/contact", authenticate, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      mobile: m.mobile,
      subject: m.subject,
      message: m.message,
      created_at: m.createdAt.toISOString()
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==========================================
// ADMIN: LOGIN HISTORY
// ==========================================

// GET /api/admin/logins (Admin only)
router.get("/admin/logins", authenticate, requireAdmin, async (req, res) => {
  try {
    const logs = await LoginHistory.find()
      .sort({ loginTime: -1 })
      .populate("user", "email fullName role")
      .limit(100);

    res.json(
      logs.map((log) => ({
        id: log._id.toString(),
        user: log.user
          ? {
              id: log.user._id.toString(),
              email: log.user.email,
              fullName: log.user.fullName || "",
              role: log.user.role
            }
          : null,
        ipAddress: log.ipAddress,
        deviceInfo: log.deviceInfo,
        loginTime: log.loginTime.toISOString()
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch login history" });
  }
});

export default router;
