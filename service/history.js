const Schedule = require('../model/schedule');
const TimeType = require('../model/timeType');
const Doctor = require('../model/doctor');
const DoctorSchedule = require('../model/doctorSchedule');
const doctorScheduleService = require('../service/doctorSchedule')
const History = require('../model/histories')
const User = require('../model/user');
const security = require('../utils/security');
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');



const getHistoryDetail = async (doctorSchedule_id) => {
    const historyDetail = await History.findOne({ doctorScheduleId: doctorSchedule_id });
    console.log(historyDetail);
    if (!historyDetail) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };


    } else {
        return {
            status: CONFIG_STATUS.SUCCESS,
            message: 'Get History Detail Successfully',
            data: historyDetail
        };
    }
}

const createHistory = async (doctorScheduleId,description, leftEye, rightEye, file) => {

    const newHistory = new History({
        doctorScheduleId,
        description,
        leftEye,
        rightEye,
        result: 'chưa rõ',
        prescription: 'chưa rõ',
        file,
    });

    const savedHistory = await newHistory.save();
    await doctorScheduleService.updateStatus1(doctorScheduleId)
    return savedHistory; // Trả về lịch sử đã tạo thành công

};
const updateHistory = async (doctorScheduleId, result , prescription) => {
    const doctorSchedule = await DoctorSchedule.findById(doctorScheduleId)
    if (!doctorSchedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    }
    const updatedHistory = await History.findOneAndUpdate(
        { doctorScheduleId },
        { result, prescription},
        { new: true, upsert: true }
    );

    await doctorScheduleService.updateStatus2(doctorScheduleId)

    return updatedHistory;

};

module.exports = {
    getHistoryDetail,
    createHistory,
    updateHistory
}