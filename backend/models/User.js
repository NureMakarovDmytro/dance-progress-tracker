import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher"], required: true }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);