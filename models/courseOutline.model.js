import mongoose from "mongoose";

const courseOutlineSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },

    topics: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        detail: {
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

const CourseOutline = mongoose.model('CourseOutline', courseOutlineSchema);

export default CourseOutline;