const mongoose = require('mongoose');

const { Schema } = mongoose;
//danh sách sản phẩm của 1 hóa đơn
const ProductInvoiceSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  invoiceId: {
    type: String,
    required: true,
  },
  //số lượng
  quantity: {
    type: Number,
    required: true,
  },
  total: {
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

const ProductInvoice = mongoose.model('ProductInvoice', ProductInvoiceSchema);
module.exports = ProductInvoice;
