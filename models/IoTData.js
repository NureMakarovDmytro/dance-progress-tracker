import mongoose from "mongoose";

const IoTDataSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  heart_rate: { type: Number, required: true },
  steps: { type: Number, required: true },
  intensity_level: { type: String, enum: ["Low", "Medium", "High"], required: true },
  calories_burned: { type: Number },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const IoTData = mongoose.models.IoTData || mongoose.model("IoTData", IoTDataSchema);
export default IoTData;