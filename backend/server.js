const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const timerRoutes = require("./routes/timerRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const breakRoutes = require("./routes/breakRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /public/assets
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use("/api/employees", employeeRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/attendance", attendanceRoutes); 
app.use("/api/break", breakRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
