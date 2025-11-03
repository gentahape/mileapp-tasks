import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["todo", "progress", "done"],
    default: "todo",
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);
export default Task;