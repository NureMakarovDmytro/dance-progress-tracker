import express from "express";
import { createTeacher, deleteUser, updateGroup, calculateStatistics, generateReport } from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/teachers", protect, admin, createTeacher);
router.delete("/users/:id", protect, admin, deleteUser);
router.put("/groups/:id", protect, admin, updateGroup);
router.get("/statistics/:groupId", protect, calculateStatistics);
router.get("/reports", protect, admin, generateReport);

export default router;