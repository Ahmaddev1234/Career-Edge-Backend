import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.config.js'

import userRoutes from "./routes/user.routes.js";
import coursesRoutes from "./routes/courses.routes.js";

dotenv.config();

const app = express();
connectDB();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", userRoutes);
app.use("/courses", coursesRoutes);








app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


export default app;
