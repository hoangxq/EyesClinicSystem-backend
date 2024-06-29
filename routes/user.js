const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const userController = require('../controller/user');

Route.get(
  '/',
  // requireLogin,
  // requireRole(['ADMIN']),
  Trycatch(userController.getAllUser)
);
Route.get(
  '/detail/:user_id',
  // requireLogin,
  // requireRole(['ADMIN']),
  Trycatch(userController.getUserByID)
);
Route.get(
  '/get/info',
  requireLogin,
  // requireRole(['ADMIN', '']),
  Trycatch(userController.getUserInfo)
);
Route.post(
  '/',
  // requireLogin,
  // requireRole(['ADMIN']),
  Trycatch(userController.createUser)
);
Route.put(
  '/update_password/:user_id',
  requireLogin,
  requireRole(['ADMIN']),
  Trycatch(userController.updateUserPassword)
);
Route.put(
  '/block/:user_id',
  requireLogin,
  requireRole(['ADMIN']),
  Trycatch(userController.blockUser)
);
Route.put(
  '/unblock/:user_id',
  requireLogin,
  requireRole(['ADMIN']),
  Trycatch(userController.unBlockUser)
);
module.exports = Route;
