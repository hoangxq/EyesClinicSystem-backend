const mongoose = require('mongoose');

const { Schema } = mongoose;

//danh sách các lịch 
const ScheduleSchema = new Schema({
  curentNumber: {
    type: Number,
    required: true,
  },
  maxNumber: {
    type: Number,
    required: true,
    default: 15
  },
  timeTypeId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: Number,
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;
