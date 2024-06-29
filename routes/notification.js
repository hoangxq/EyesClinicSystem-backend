const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const notificationController = require('../controller/notification');


Route.get(
    '/:notification_id',
    Trycatch(notificationController.getNotificationDetail)
);
Route.get(
    '/',
    Trycatch(notificationController.getAllNotifications)
);
Route.post(
    // '/:doctorScheduleId',
    '/',
    Trycatch(notificationController.createNotification)
);
Route.put(
    '/',
    Trycatch(notificationController.updateNotification)
)

module.exports = Route;
