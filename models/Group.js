import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: { type: String },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Group = mongoose.models.Group || mongoose.model("Group", GroupSchema);
export default Group;