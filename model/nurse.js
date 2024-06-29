const mongoose = require('mongoose');

const { Schema } = mongoose;

const NurseSchema = new Schema({
  userId: {
    type: Number,
    required: true,
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

const Nurse = mongoose.model('Nurse', NurseSchema);
module.exports = Nurse;
