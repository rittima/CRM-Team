const express = require("express");
const { startBreak, stopBreak, getBreakLogs, getBreakStatus } = require("../controllers/breakController");

const router = express.Router();

router.post("/start", startBreak);
router.post("/stop", stopBreak);
router.get("/logs/:userId", getBreakLogs);
router.get("/status/:userId", getBreakStatus);

module.exports = router;
