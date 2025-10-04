import mongoose from "mongoose";

const courseContentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },

    sections: [
      {
        heading: {
          type: String,
          required: true,
          trim: true
        },
        paragraph: 
          {
            type: String,
            required: true,
            trim: true
          }
        
      }
    ]
  },
  {
    timestamps: true
  }
);

const CourseContent = mongoose.model('CourseContent', courseContentSchema);

export default CourseContent;