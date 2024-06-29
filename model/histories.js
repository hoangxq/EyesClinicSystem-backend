const mongoose = require('mongoose');

const { Schema } = mongoose;

const HistorySchema = new Schema({
    doctorScheduleId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    leftEye: {
        type: String,
        required: true,
    },
    rightEye: {
        type: String,
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    prescription: {
        type: String,
        required: true,
    },

    file: {
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

const History = mongoose.model('History', HistorySchema);
module.exports = History;
