import Course from '../models/Courses.model.js';
import CourseContent from '../models/courseContent.model.js';
import CourseOutline from '../models/courseOutline.model.js';
import cloudinary from '../config/cloudinary.js';
import response from '../utils/responseFunction.js';

// Create Course
const createCourse = async (req, res) => {
  try {
    const { title, level, category, schedule, price, description, duration, label, sections, topics } = req.body;

    if (!req.file) {
      return response(res, 400, 'Course image is required', null, false);
    }

    const courseData = {
      title,
      image: req.file.path,
      level,
      category,
      schedule,
      price,
      description,
      duration,
      label: label || null
    };

    const course = await Course.create(courseData);
    const courseId = course._id; 

    if (sections && sections.length > 0) {
      await CourseContent.create({
        courseId,
        sections: JSON.parse(sections)
      });
    }

    if (topics && topics.length > 0) {
      await CourseOutline.create({
        courseId,
        topics: JSON.parse(topics)
      });
    }

    const fullCourse = await Course.findById(courseId);
    const courseContent = await CourseContent.findOne({ courseId });
    const courseOutline = await CourseOutline.findOne({ courseId });

    return response(res, 201, 'Course created successfully', {
      course: fullCourse,
      content: courseContent,
      outline: courseOutline
    });
  } catch (error) {
    return response(res, 500, 'Error creating course', error.message, false);
  }
};

// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    return response(res, 500, 'Error fetching courses', error.message, false);
  }
};

// Get Single Course with Content and Outline
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id; 
    const course = await Course.findById(courseId);

    if (!course) {
      return response(res, 404, 'Course not found', null, false);
    }

    const courseContent = await CourseContent.findOne({ courseId });
    const courseOutline = await CourseOutline.findOne({ courseId });

    return response(res, 200, 'Course fetched successfully', {
      course,
      content: courseContent,
      outline: courseOutline
    });
  } catch (error) {
    return response(res, 500, 'Error fetching course', error.message, false);
  }
};

// Update Course with Content and Outline
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id; 

    const course = await Course.findById(courseId);
    if (!course) {
      return response(res, 404, 'Course not found', null, false);
    }

    const { title, level, category, schedule, price, description, duration, label, sections, topics } = req.body;

    const updateData = {
      title: title || course.title,
      level: level || course.level,
      category: category || course.category,
      schedule: schedule || course.schedule,
      price: price || course.price,
      description: description || course.description,
      duration: duration || course.duration,
      label: label !== undefined ? label : course.label
    };

    if (req.file) {
      const oldImagePublicId = course.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`courses/${oldImagePublicId}`);
      updateData.image = req.file.path;
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
      runValidators: true
    });

    if (sections) {
      const parsedSections = typeof sections === 'string' ? JSON.parse(sections) : sections;
      await CourseContent.findOneAndUpdate(
        { courseId },
        { sections: parsedSections },
        { upsert: true, new: true }
      );
    }

    if (topics) {
      const parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics;
      await CourseOutline.findOneAndUpdate(
        { courseId },
        { topics: parsedTopics },
        { upsert: true, new: true }
      );
    }

    const courseContent = await CourseContent.findOne({ courseId });
    const courseOutline = await CourseOutline.findOne({ courseId });

    return response(res, 200, 'Course updated successfully', {
      course: updatedCourse,
      content: courseContent,
      outline: courseOutline
    });
  } catch (error) {
    return response(res, 500, 'Error updating course', error.message, false);
  }
};

// Delete Course with Content and Outline
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id; 

    const course = await Course.findById(courseId);
    if (!course) {
      return response(res, 404, 'Course not found', null, false);
    }

    const imagePublicId = course.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`courses/${imagePublicId}`);

    await CourseContent.findOneAndDelete({ courseId });
    await CourseOutline.findOneAndDelete({ courseId });
    await Course.findByIdAndDelete(courseId);

    return response(res, 200, 'Course and related data deleted successfully', null);
  } catch (error) {
    return response(res, 500, 'Error deleting course', error.message, false);
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};