import express from "express";
import { createStudent, enrollStudentToGroup, getStudents } from "../controllers/studentController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, admin, createStudent);
router.post("/enroll", protect, admin, enrollStudentToGroup);
router.get("/", protect, getStudents);

export default router;