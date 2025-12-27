import express from "express";
import IoTData from "../models/IoTData.js";

const router = express.Router();

router.post("/data", async (req, res) => {
  try {
    const { studentId, heartRate, steps, intensity, calories } = req.body;

    const newData = new IoTData({
      student_id: studentId,
      heart_rate: heartRate,
      steps: steps,
      intensity_level: intensity,
      calories_burned: calories
    });

    await newData.save();
    res.status(201).json({ message: "Data saved", id: newData._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;