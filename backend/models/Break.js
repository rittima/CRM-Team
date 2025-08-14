const mongoose = require("mongoose");

const breakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationInSeconds: { type: Number },
});

module.exports = mongoose.model("Break", breakSchema);
