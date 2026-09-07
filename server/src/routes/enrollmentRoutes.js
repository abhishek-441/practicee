import express from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  markLectureComplete
} from "../controllers/enrollmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getMyEnrollments);
router.post("/", protect, enrollInCourse);
router.post("/progress", protect, markLectureComplete);

export default router;
