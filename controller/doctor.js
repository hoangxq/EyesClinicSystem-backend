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

const getAllDoctor = async (req, res) => {
    const doctor_list = await doctorService.getAllDoctor();
    dataHandle(doctor_list, req, res);
};

const createDoctorInfor = async (req, res) => {
    const {
        userId,
        hospital,
        degree,
        experience,
        achievements,
    } = req.body;
    var result = await doctorService.createDoctorInfor(
        userId,
        hospital,
        degree,
        experience,
        achievements,
    );
    res.send({
        ...result,
    });
}
const getDoctorDetailByID = async (req, res) => {
    const { doctor_id } = req.params;
    const docctor_detail = await doctorService.getDoctorDetailByID(doctor_id);
    dataHandle(docctor_detail, req, res);
}

const getDoctorDetailByUserId = async (req, res) => {
    const { user_id } = req.params;
    console.log(user_id)
    const docctor_detail = await doctorService.getDoctorDetailByUserId(user_id);
    dataHandle(docctor_detail, req, res);
}

module.exports = {
    getAllDoctor,
    getDoctorDetailByID,
    createDoctorInfor,
    getDoctorDetailByUserId
}