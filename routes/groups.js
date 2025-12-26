import express from "express";
import { createGroup, getGroups } from "../controllers/groupController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, admin, createGroup);
router.get("/", protect, getGroups);

export default router;