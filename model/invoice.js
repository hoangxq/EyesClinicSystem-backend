const mongoose = require('mongoose');
const DoctorSchedule = require('./doctorSchedule');

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    transId: {
        type: String,
        default: '',
    },
    doctorScheduleId: {
        type: String,
        required: false,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    // 0: chưa thanh toán, 1: đã thanh toán, 2: đã hoàn, 3: thanh toán thất bại
    content: {
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

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;
