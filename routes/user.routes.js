import express from "express";
import register from '../controllers/userController.js'
import { searchCourses } from "../controllers/userController.js";
const router = express.Router();


router.post("/register",register);
router.get("/filter",searchCourses);


export default router;
