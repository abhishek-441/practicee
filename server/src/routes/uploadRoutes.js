import express from "express";
import { getUploadSignature } from "../controllers/uploadController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Instructor requests a signature, then uploads the file straight to Cloudinary from the browser
router.get("/signature", protect, requireRole("instructor", "admin"), getUploadSignature);

export default router;
