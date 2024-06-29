const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const scheduleController = require('../controller/schedule');

Route.get(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(scheduleController.getAllSchedule)
);
Route.get(
    '/today',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(scheduleController.getAllScheduleByToday)
);
Route.post(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(scheduleController.createSchedule)
);

Route.get(
    '/:doctor_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(scheduleController.getScheduleByDoctorId)
);

Route.get(
    '/user/:user_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(scheduleController.getScheduleByUserId)
);
module.exports = Route;