const Route = require('express').Router();
const authUserController = require('../controller/authUser');
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');

Route.post('/login', Trycatch(authUserController.login));
Route.post(
  '/logout',
  requireLogin,
  requireRole(['ADMIN', 'DOCTOR', 'PATIENT', 'NURSE', 'SALE', 'RECEPTIONIST']),
  Trycatch(authUserController.logOut)
);

module.exports = Route;
