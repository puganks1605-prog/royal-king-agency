import mongoose, { Schema } from "mongoose";

const loginHistorySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  ipAddress: {
    type: String,
    default: "Unknown"
  },
  deviceInfo: {
    type: String, // Stores the browser/OS User-Agent string
    default: "Unknown"
  },
  loginTime: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("LoginHistory", loginHistorySchema);
