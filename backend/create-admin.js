// One-time script to create an admin user
// Run with: node create-admin.js
// Then DELETE this file after use!

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const ADMIN_EMAIL    = "admin@royalking.com";  // ← change if needed
const ADMIN_PASSWORD = "Admin@1234";           // ← change to your desired password
const ADMIN_NAME     = "Admin";

const UserSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  fullName:  { type: String, trim: true },
  mobile:    { type: String, trim: true },
  role:      { type: String, enum: ["admin", "customer"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role === "admin") {
      console.log("⚠️  Admin already exists:", ADMIN_EMAIL);
    } else {
      // Upgrade existing user to admin
      existing.role = "admin";
      await existing.save();
      console.log("✅ Upgraded existing user to admin:", ADMIN_EMAIL);
    }
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = new User({
    email:    ADMIN_EMAIL,
    password: hashed,
    fullName: ADMIN_NAME,
    role:     "admin",
  });

  await admin.save();
  console.log("✅ Admin user created successfully!");
  console.log("   Email:   ", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
  console.log("\n🔒 DELETE this file (create-admin.js) after use!");

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
