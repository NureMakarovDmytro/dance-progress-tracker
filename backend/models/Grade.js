import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  membership_id: { type: mongoose.Schema.Types.ObjectId, ref: "GroupMembership", required: true },
  lesson_date: { type: Date, required: true },
  score: { type: Number },
  comment: { type: String },
  given_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Grade", GradeSchema);