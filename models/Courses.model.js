import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    image: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    schedule: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    duration: {
      type: String,
      required: true,
      trim: true
    },

    label: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;