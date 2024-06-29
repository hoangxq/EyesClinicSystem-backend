const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT','SALE', 'RECEPTIONIST'],
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  refresh_token: {
    type: String,
    default: 'EMPTY',
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

const User = mongoose.model('User', UserSchema);
module.exports = User;
