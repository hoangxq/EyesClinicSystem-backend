const mongoose = require('mongoose');

const { Schema } = mongoose;
//danh sách bệnh nhân của 1 lịch
const DoctorScheduleSchema = new Schema({
  scheduleId: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  //dựa theo thời gian đăng ký
  number: {
    type: Number,
    required: true,
  },
  // = 0 là chưa khám , 1 là đã đo mắt, 2 là đã khám mắt, 3 là đã hủy
  status: {
    type: Number,
    default: 0
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

const DoctorSchedule = mongoose.model('DoctorSchedule', DoctorScheduleSchema);
module.exports = DoctorSchedule;
