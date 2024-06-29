const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const doctorScheduleController = require('../controller/doctorSchedule');

Route.get(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.getAllDoctorSchedule)
);
Route.post(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.createDoctorSchedule)
);

Route.post(
    '/register',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.createDoctorScheduleByPhoneNumber)
);

Route.post(
    '/cancle/:doctorScheduleId',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.cancleDoctorSchedule)
);

Route.get(
    '/:scheduleId',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.getAllDoctorScheduleByScheduleId)
);
Route.get(
    '/patient/:patientId',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(doctorScheduleController.getDoctorDetailByPatientId)
)
Route.delete(
    '/:scheduleId',
    Trycatch(doctorScheduleController.deleteDoctorSchedule)
)
module.exports = Route;