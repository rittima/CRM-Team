// routes/uploadRoutes.js
import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

export default router;
