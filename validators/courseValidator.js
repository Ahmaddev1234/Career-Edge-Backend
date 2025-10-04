import z from 'zod'


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
      return res.status(400).json({
        success: false,
        message: "Course image is required",
      });
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

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default courseValidator;
