
import Registration from '../models/user.model.js';
import sendEmail from '../services/emailService.js';
import Course from '../models/Courses.model.js';


const register = async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      address,
      city,
      date,
      course,
      gender,
      qualification,
      institute,
      source
    } = req.body;

    

    if (!name || !email || !contact || !address || !city || !date || !course || !gender || !qualification || !institute || !source) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const registration = await Registration.create({
      name,
      email,
      contact,
      address,
      city,
      date,
      course,
      gender,
      qualification,
      institute,
      source
    });

    const emailHTML = `
      <h2>New Registration Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Course ID:</strong> ${course}</p>
      <p style="margin-top: 20px; color: #666;">Submitted at: ${new Date().toLocaleString()}</p>
    `;

    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Registration: ${name}`,
      emailHTML
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration
    });

  } catch (error) {
    console.error(' Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};



export const searchCourses = async (req, res) => {
  try {
    const { course, minPrice, maxPrice, duration, search } = req.query;
    
    const query = {};
    
    // Specific course filter
    if (course && course.trim() !== '') {
      query.title = course.trim();
    }
    
    // Duration filter
    if (duration && duration.trim() !== '') {
      query.duration = duration.trim();
    }
    
    // Budget range (simplified for numeric prices)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && minPrice.trim() !== '') {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice.trim() !== '') {
        query.price.$lte = parseFloat(maxPrice);
      }
    }
    
    // Text search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { level: searchRegex }
      ];
    }
    
    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching courses',
      error: error.message
    });
  }
};


export default register;
