const express = require("express");
const router = express.Router();
const {
  startTimer,
  stopTimer,
  getLogs,
} = require("../controllers/timerController");

router.post("/start", startTimer);
router.post("/stop", stopTimer);
router.get("/logs/:userId", getLogs);

module.exports = router;
