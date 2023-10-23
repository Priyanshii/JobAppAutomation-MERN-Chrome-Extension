import mongoose from "mongoose";

const JobApplicationSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  questions: [{
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    options: [{
      type: String,
    }],
  }],
  status: {
    type: String
  }
});

export default mongoose.model('Job', JobApplicationSchema);