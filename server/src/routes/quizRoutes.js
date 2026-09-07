import express from "express";
import {
  createQuiz,
  getQuizForStudent,
  getQuizForInstructor,
  submitQuiz,
  listCourseQuizzes
} from "../controllers/quizController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { quizSchema } from "../schemas/courseSchemas.js";

const router = express.Router();

router.get("/course/:courseId", protect, listCourseQuizzes);
router.post(
  "/course/:courseId/section/:sectionId",
  protect,
  requireRole("instructor", "admin"),
  validateBody(quizSchema),
  createQuiz
);
router.get("/:quizId", protect, getQuizForStudent);
router.get("/:quizId/answers", protect, requireRole("instructor", "admin"), getQuizForInstructor);
router.post("/:quizId/submit", protect, submitQuiz);

export default router;
