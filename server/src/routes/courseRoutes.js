import express from "express";
import {
  createCourse,
  updateCourse,
  addSection,
  addLecture,
  publishCourse,
  listCourses,
  getCourseBySlug,
  getMyCourses
} from "../controllers/courseController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { createCourseSchema, addLectureSchema } from "../schemas/courseSchemas.js";

const router = express.Router();

router.get("/", listCourses);
router.get("/mine", protect, requireRole("instructor", "admin"), getMyCourses);
router.get("/:slug", getCourseBySlug);

router.post("/", protect, requireRole("instructor", "admin"), validateBody(createCourseSchema), createCourse);
router.patch("/:id", protect, requireRole("instructor", "admin"), updateCourse);
router.post("/:id/sections", protect, requireRole("instructor", "admin"), addSection);
router.post(
  "/:id/sections/:sectionId/lectures",
  protect,
  requireRole("instructor", "admin"),
  validateBody(addLectureSchema),
  addLecture
);
router.patch("/:id/publish", protect, requireRole("instructor", "admin"), publishCourse);

export default router;
