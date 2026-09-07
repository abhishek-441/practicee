import express from "express";
import {
  listAllUsers,
  setUserBanned,
  listAllCourses,
  adminSetPublished,
  platformStats
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/stats", platformStats);
router.get("/users", listAllUsers);
router.patch("/users/:userId/ban", setUserBanned);
router.get("/courses", listAllCourses);
router.patch("/courses/:courseId/publish", adminSetPublished);

export default router;
