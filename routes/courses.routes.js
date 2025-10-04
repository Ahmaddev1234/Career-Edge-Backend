import express from "express";
import courseValidator from "../validators/courseValidator.js";
import { createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse } from "../controllers/courseController.js";


import upload from '../middlewares/multer.js'
const router = express.Router();




// #courses routes
router.get('/', getAllCourses);
router.post('/create', upload.single('image'),courseValidator, createCourse);
router.get('/:id', getCourseById);
router.put('/update/:id', upload.single('image'), updateCourse);
router.delete('/delete/:id', deleteCourse);


export default router;
