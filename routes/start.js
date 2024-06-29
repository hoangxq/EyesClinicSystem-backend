const Route = require('express').Router();
const startController = require('../controller/start');

const { Trycatch } = require('../middlewares/errorHandle');
Route.get('/', Trycatch(startController.getStart));
Route.post('/', Trycatch(startController.postTest));

module.exports = Route;
