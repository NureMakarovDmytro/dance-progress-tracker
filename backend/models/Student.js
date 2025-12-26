import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  birth_date: { type: Date },
  phone: { type: String },
  email: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model("Student", StudentSchema);