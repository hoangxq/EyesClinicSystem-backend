const ScheduleService = require('../service/schedule');
const doctorService = require('../service/doctor');
const {
    verifyToken,
    generatePassword,
    verifyPassword,
} = require('../utils/security');
const { dataHandle } = require('../middlewares/dataHandle');
const authUserService = require('../service/authUser');
const CONFIG_STATUS = require('../config/status.json');
const config = require('config');
const { REGEX } = require('../config/regex');
const Doctor = require('../model/doctor');
const getAllSchedule = async (req, res) => {
    const schedule_list = await ScheduleService.getAllSchedule(req.pagination);
    dataHandle(schedule_list, req, res);
};

const getAllScheduleByToday = async (req, res) => {
    const schedule_list = await ScheduleService.getAllScheduleByToday(req.pagination);
    dataHandle(schedule_list, req, res);
};

const getScheduleByDoctorId = async (req, res) => {
    const doctor_id = req.params;
    const schedule_list = await ScheduleService.getScheduleByDoctorId(doctor_id, req.pagination);
    dataHandle(schedule_list, req, res);
};
const getScheduleByUserId = async (req, res) => {
    const {user_id} = req.params;
    console.log('1',user_id);
    const schedule_list = await ScheduleService.getScheduleByUserId(user_id, req.pagination);
    console.log(schedule_list)
    dataHandle(schedule_list, req, res);

};
const createSchedule = async (req, res) => {
    const {
        curentNumber,
        maxNumber,
        timeTypeId,
        userId,
        date,
    } = req.body;

    console.log('body:', req.body)

    if (!userId ) {
        res.status(400).send({
            status: CONFIG_STATUS.FAIL,
            message: 'user ID is required fields. Please provide valid values.',
        });
        return;
    }
    if (!timeTypeId ) {
        res.status(400).send({
            status: CONFIG_STATUS.FAIL,
            message: 'timeType ID is required fields. Please provide valid values.',
        });
        return;
    }
    const doctor = await Doctor.findOne({userId: req.body.userId})
    if(!doctor) {
        res.status(400).send({
            status: CONFIG_STATUS.FAIL,
            message: 'You are not a Doctor.',
        });
        return;

    }
    console.log(doctor)

    // Tạo lịch trình mới
    const newSchedule = await ScheduleService.createSchedule(req.body);

    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Create schedule successful.',
        data: {
            newSchedule,
        },
    });
}



module.exports = {
    getAllSchedule,
    getScheduleByUserId,
    getScheduleByDoctorId,
    createSchedule,
    getAllScheduleByToday
}