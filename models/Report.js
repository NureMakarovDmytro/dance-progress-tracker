import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  title: { type: String },
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  period_start: { type: Date },
  period_end: { type: Date },
  summary: { type: String },
  file_url: { type: String },
  generated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;