const doctorScheduleService = require('../service/doctorSchedule');
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
const getAllDoctorSchedule = async (req, res) => {
    const schedule_list = await doctorScheduleService.getAllDoctorSchedule(req.pagination);
    dataHandle(schedule_list, req, res);
};

const getAllDoctorScheduleByScheduleId = async (req, res) => {
    const { scheduleId } = req.params;
    const schedule_list = await doctorScheduleService.getAllDoctorScheduleByScheduleId(scheduleId, req.pagination);
    dataHandle(schedule_list, req, res);
};

const getDoctorDetailByPatientId = async (req, res) => {
    const { patientId } = req.params;
    const schedule_list = await doctorScheduleService.getDoctorDetailByPatientId(patientId, req.pagination);
    dataHandle(schedule_list, req, res);
};
const createDoctorSchedule = async (req, res) => {
    const {
        scheduleId,
        patientId,
    } = req.body;
    var result = await doctorScheduleService.createDoctorSchedule({ scheduleId, patientId });
    res.send({
        ...result,
    });
}

const createDoctorScheduleByPhoneNumber = async (req, res) => {
    const { scheduleId } = req.params
    const { phone } =  req.body;
    console.log(req.query)
    var result = await doctorScheduleService.createDoctorScheduleByPhoneNumber(scheduleId, phone );
    res.send({
        ...result,
    });
}

const deleteDoctorSchedule = async (req, res) => {
    const { scheduleId } = req.params;
    console.log(scheduleId)
    const  isExist  = doctorScheduleService.checkExist(scheduleId)
    console.log(isExist)
    if (isExist) {
        await doctorScheduleService.deleteDoctorSchedule(scheduleId)
        res.send({
            status: CONFIG_STATUS.SUCCESS,
            message: 'Delete doctor schedule successful.',
        });
    } else {
        res.status(400).send({
            status: CONFIG_STATUS.FAIL,
            message: 'doctor schedule is not exist.',
        });
    }
};

const cancleDoctorSchedule = async (req, res) => {
    const { doctorScheduleId } = req.params;
    console.log(doctorScheduleId)
    const  isExist  = await doctorScheduleService.checkExist(doctorScheduleId)
    console.log(isExist)
    if (isExist) {
        await doctorScheduleService.cancelDoctorScheduleByPatient(doctorScheduleId)
        res.send({
            status: CONFIG_STATUS.SUCCESS,
            message: 'Cancle doctor schedule successful.',
        });
    } else {
        res.status(400).send({
            status: CONFIG_STATUS.FAIL,
            message: 'appointment is not exist.',
        });
    }
};


module.exports = {
    getAllDoctorSchedule,
    getAllDoctorScheduleByScheduleId,
    createDoctorSchedule,
    getDoctorDetailByPatientId,
    deleteDoctorSchedule,
    createDoctorScheduleByPhoneNumber,
    cancleDoctorSchedule
}
