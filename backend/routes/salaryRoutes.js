import express from "express";
import Salary from "../model/Salary.js";

const router = express.Router();

/**
 * @route   POST /api/salary
 * @desc    Create new salary record
 * @access  Admin / HR
 */
router.post("/", async (req, res) => {
  try {
    const salary = new Salary(req.body);
    await salary.save();
    res.status(201).json(salary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET /api/salary
 * @desc    Get all salaries
 * @access  Admin / HR
 */
router.get("/", async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ createdAt: -1 });
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// /**
//  * @route   GET /api/salary/:id
//  * @desc    Get salary by ID
//  * @access  Admin / HR / User (self)
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const salary = await Salary.findById(req.params.id);
//     if (!salary) return res.status(404).json({ error: "Salary record not found" });
//     res.json(salary);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// GET /api/salary/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const salary = await Salary.findOne({ userId: req.params.userId });
    if (!salary) return res.status(404).json({ error: "Salary not found for this employeeId" });
    res.json(salary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   PUT /api/salary/:id
 * @desc    Update salary record
 * @access  Admin / HR
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSalary) return res.status(404).json({ error: "Salary record not found" });
    res.json(updatedSalary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   PATCH /api/salary/:id/status
 * @desc    Update salary status (Processed / Paid / Failed)
 * @access  Admin / HR
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, processedBy } = req.body;
    const updatedSalary = await Salary.findByIdAndUpdate(
      req.params.id,
      {
        status,
        processedBy,
        processedAt: new Date(),
      },
      { new: true }
    );
    if (!updatedSalary) return res.status(404).json({ error: "Salary record not found" });
    res.json(updatedSalary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   DELETE /api/salary/:id
 * @desc    Delete salary record
 * @access  Admin / HR
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedSalary = await Salary.findByIdAndDelete(req.params.id);
    if (!deletedSalary) return res.status(404).json({ error: "Salary record not found" });
    res.json({ message: "Salary record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;