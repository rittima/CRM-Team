// // const express = require('express');
// import express from "express";

// import {
//   createProject,
//   getAllProjects,
//   getProjectById,
//   deleteProject,
//   getProjectStats,
//   getMyProjects,
//   updateProject,   // don’t forget this one
// } from "../controllers/projectController.js";
// import { protect, hrOrAdmin } from "../middleware/authMiddleware.js";

// // Public routes (require authentication)
// router.post('/', protect, createProject);                    // Create project
// router.get('/my-projects', protect, getMyProjects);          // Get user's projects
// router.get('/stats', protect, getProjectStats);             // Get project statistics
// router.get('/:id', protect, getProjectById);                // Get project by ID

// // HR/Admin routes
// router.get('/', protect, hrOrAdmin, getAllProjects);        // Get all projects (HR/Admin only)
// router.put('/:id', protect, updateProject);                 // Update project
// router.delete('/:id', protect, hrOrAdmin, deleteProject);   // Delete project (HR/Admin only)

// export default router;



// backend/routes/projectRoutes.js
import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  getProjectStats,
  getMyProjects,
  updateProject
} from "../controllers/projectController.js";
import { protect, hrOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (require authentication)
router.post("/", protect, createProject);                    // Create project
router.get("/my-projects", protect, getMyProjects);          // Get user's projects
router.get("/stats", protect, getProjectStats);              // Get project statistics
router.get("/:id", protect, getProjectById);                 // Get project by ID

// HR/Admin routes
router.get("/", protect, hrOrAdmin, getAllProjects);         // Get all projects (HR/Admin only)
router.put("/:id", protect, updateProject);                  // Update project
router.delete("/:id", protect, hrOrAdmin, deleteProject);    // Delete project (HR/Admin only)

export default router;
