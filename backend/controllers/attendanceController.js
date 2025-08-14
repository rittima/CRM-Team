const Timer = require("../models/Timer");

exports.checkIn = (req, res) => {
  const time = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  res.status(200).json({ message: "Checked In", time });
};

exports.checkOut = (req, res) => {
  const time = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  res.status(200).json({ message: "Checked Out", time });
};

exports.getAllAttendance = async (req, res) => {
  try {
    const logs = await Timer.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance logs", error });
  }
};