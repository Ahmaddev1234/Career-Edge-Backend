import z from 'zod';
import response from '../utils/responseFunction.js';

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  level: z.string().min(1, "Level is required"),
  category: z.string().min(1, "Category is required"),
  schedule: z.string().min(1, "Schedule is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  label: z.string().optional(),
  sections: z.string().min(1, "Sections are required"),
  topics: z.string().min(1, "Topics are required"),
});

const courseValidator = (req, res, next) => {
  try {
    courseSchema.parse(req.body);

    if (!req.file) {
      return response(res, 400, "Course image is required", null, false);
    }

    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((e) => e.message),
      });
    }

    return response(res, 500, "Server error", error.message, false);
  }
};

export default courseValidator;