const mongoose = require('mongoose');

const { Schema } = mongoose;

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/; // Regex for HH:MM format

const TimeTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  startAt: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     return timeRegex.test(v);
    //   },
    //   message: 'Start time should be in HH:MM format',
    // },
  },
  endAt: {
    type: String,
    required: true,
    // validate: {
    //   validator: function (v) {
    //     return timeRegex.test(v);
    //   },
    //   message: 'End time should be in HH:MM format',
    // },
  },
  duration: {
    type: Number,
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

const TimeType = mongoose.model('TimeType', TimeTypeSchema);
module.exports = TimeType;
