const CONFIG_STATUS = require('../config/status.json');
const { errorLog } = require('../middlewares/logHelper');
const Trycatch = (f) => async (req, res, next) => {
  try {
    await f(req, res, next);
  } catch (error) {
    next(error);
  }
};

const errorHandle = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: CONFIG_STATUS.SERVER_ERROR,
    message: err.message,
  });
  console.log(err);
  errorLog(err, 'SYSTEM', req);
};

module.exports = {
  errorHandle,
  Trycatch,
};
