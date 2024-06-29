const mongoose = require('mongoose');

const { Schema } = mongoose;

const PatientSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
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

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
