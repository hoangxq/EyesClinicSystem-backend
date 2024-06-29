const mongoose = require('mongoose');

const { Schema } = mongoose;


const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['MEDICINE', 'GLASSES', 'OTHER'],
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  photo: {
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

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
