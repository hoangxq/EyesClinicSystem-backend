const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const doctorController = require('../controller/doctor');

Route.get(
  '/',
  Trycatch(doctorController.getAllDoctor)
);
Route.get(
  '/:doctor_id',
  Trycatch(doctorController.getDoctorDetailByID)
);
Route.get(
  '/infor/:user_id',
  Trycatch(doctorController.getDoctorDetailByUserId)
);
Route.post(
  '/',
  Trycatch(doctorController.createDoctorInfor)
)

module.exports = Route;
