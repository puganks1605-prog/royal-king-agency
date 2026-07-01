import mongoose, { Schema } from "mongoose";

const ContactMessageSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, default: null, trim: true },
  subject: { type: String, default: null, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ContactMessage", ContactMessageSchema);
