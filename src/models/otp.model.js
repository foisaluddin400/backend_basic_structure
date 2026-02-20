import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["register", "forgot"], 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true, 
      default: () => Date.now() + 10 * 60 * 1000 // 10 min
    },
  },
  { timestamps: true }
);

// auto delete after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", otpSchema);