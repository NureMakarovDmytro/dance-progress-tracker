import mongoose from "mongoose";

const GroupMembershipSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  join_date: { type: Date, default: Date.now }
}, { timestamps: true });

const GroupMembership = mongoose.models.GroupMembership || mongoose.model("GroupMembership", GroupMembershipSchema);
export default GroupMembership;