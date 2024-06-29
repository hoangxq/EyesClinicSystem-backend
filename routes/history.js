const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const historyController = require('../controller/history');


Route.get(
    '/:doctorScheduleId',
    Trycatch(historyController.getHistoryDetail)
);
Route.post(
    // '/:doctorScheduleId',
    '/',
    Trycatch(historyController.createHistory)
);
Route.put(
    '/',
    Trycatch(historyController.updateHistory)
)

module.exports = Route;
