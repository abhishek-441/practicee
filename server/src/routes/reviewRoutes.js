import express from "express";
import { upsertReview, listCourseReviews, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/course/:courseId", listCourseReviews);
router.post("/course/:courseId", protect, upsertReview);
router.delete("/:reviewId", protect, deleteReview);

export default router;
