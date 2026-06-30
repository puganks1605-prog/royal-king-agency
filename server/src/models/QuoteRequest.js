import mongoose, { Schema } from "mongoose";

const QuoteRequestSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, trim: true },
  insurance_type: { type: String, required: true },
  vehicle_details: { type: String, default: null },
  property_details: { type: String, default: null },
  notes: { type: String, default: null },
  status: { type: String, enum: ["pending", "quoted", "declined", "approved"], default: "pending" },
  quoted_premium: { type: Number, default: null },
  admin_response: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

QuoteRequestSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("QuoteRequest", QuoteRequestSchema);
