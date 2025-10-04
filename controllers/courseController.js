import Course from '../models/Courses.model.js';
import CourseContent from '../models/courseContent.model.js';
import CourseOutline from '../models/courseOutline.model.js';
import cloudinary from '../config/cloudinary.js';

// Create Course
const createCourse = async (req, res) => {
  try {
    const { title, level, category, schedule, price, description, duration, label, sections, topics } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Course image is required' });
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

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        course: fullCourse,
        content: courseContent,
        outline: courseOutline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Get All Courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get Single Course with Content and Outline
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id; 
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const courseContent = await CourseContent.findOne({ courseId });
    const courseOutline = await CourseOutline.findOne({ courseId });

    res.status(200).json({
      success: true,
      data: {
        course,
        content: courseContent,
        outline: courseOutline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Update Course with Content and Outline
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id; 

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
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

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        course: updatedCourse,
        content: courseContent,
        outline: courseOutline
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// Delete Course with Content and Outline
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id; 

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const imagePublicId = course.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`courses/${imagePublicId}`);

    await CourseContent.findOneAndDelete({ courseId });
    await CourseOutline.findOneAndDelete({ courseId });
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: 'Course and related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

export {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};
