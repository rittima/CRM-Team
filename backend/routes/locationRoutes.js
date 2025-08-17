import express from 'express';
import {
  updateLocation,
  getCurrentLocation,
  getLocationHistory,
  getAllEmployeeLocations,
  clearAllLocationHistory
} from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Employee routes
router.post('/update', protect, updateLocation);
router.get('/current', protect, getCurrentLocation);
router.get('/history', protect, getLocationHistory);

// HR/Admin routes
router.get('/all-employees', protect, getAllEmployeeLocations);
router.delete('/clear-all', protect, clearAllLocationHistory);

export default router;
