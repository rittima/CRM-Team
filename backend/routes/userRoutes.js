import express from 'express';
import User from '../model/User.js';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  searchUsers, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect, admin, hrOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin only)
router.get('/', protect, admin, getAllUsers);

// Get all users for HR dashboard (HR or Admin only)
router.get('/hr/all', protect, hrOrAdmin, getAllUsers);

// Search users (Authenticated users only - for testing)
router.get('/search', protect, searchUsers);

// Get user by ID
router.get('/:id', protect, getUserById);

// Test route to check database connection and user data
router.get('/:id/test', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({
      message: "User found successfully",
      user: user,
      fieldsPresent: {
        name: !!user?.name,
        email: !!user?.email,
        employeeId: !!user?.employeeId,
        gender: !!user?.gender,
        photo: !!user?.photo,
        shiftTiming: !!user?.shiftTiming,
        address: !!user?.address,
        designation: !!user?.designation,
        domain: !!user?.domain,
        profileCompleted: !!user?.profileCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Update user profile (Employee can update their own profile)
router.put('/:id/profile', protect, updateUserProfile);

// Update user (Admin only)
router.put('/:id', protect, admin, updateUser);

// Delete user (Admin only)
router.delete('/:id', protect, admin, deleteUser);

export default router;
