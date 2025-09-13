import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
