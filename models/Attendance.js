import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  membership_id: { type: mongoose.Schema.Types.ObjectId, ref: "GroupMembership", required: true },
  lesson_date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "late", "excused"], default: "present" },
  marked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
export default Attendance;