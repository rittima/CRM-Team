import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import "./config/cloudinary.js"; // Initialize Cloudinary
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import timerRoutes from "./routes/timerRoutes.js";
import breakRoutes from "./routes/breakRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import cors from "cors";
// import hrProjectRoutes from './routes/hrProjectRoutes.js';
import hrTaskRoutes from './routes/hrTaskRoute.js';
import salaryRoutes from './routes/salaryRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // your frontend dev ports
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/hr-tasks', hrTaskRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timer', timerRoutes);
app.use('/api/breaks', breakRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/hr-projects', hrProjectRoutes);
app.use("/api/salary", salaryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

