const mongoose = require('mongoose');

const { Schema } = mongoose;

const DoctorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Sử dụng kiểu ObjectId để tham chiếu
    ref: 'User', // Tham chiếu đến model 'User'
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  achievements: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
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

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
