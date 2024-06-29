// const { errorHandle } = require('./errorHandle')
const User = require('../model/user');
const CONFIG_STATUS = require('../config/status.json');
const requireLogin = async (req, res, next) => {
  if (req.headers.authorization == undefined) {
    res.status(401).send({
      status: CONFIG_STATUS.TOKEN_EMPTY,
      message: 'Authorization is not exist.',
    });
  } else {
    const token = req.headers.authorization.split(' ')[1];
    var decodedToken = require('../utils/security').verifyToken(token);

    if (decodedToken.status == 403) {
      res.status(decodedToken.status);
      res.send(decodedToken);
    } else if (decodedToken.status == 200) {
      const userExist = await User.exists({ phone: decodedToken.data.phone });
      if (userExist) {
        next();
      } else {
        res.status(402).send({
          status: CONFIG_STATUS.TOKEN_ERROR,
          message: 'Unauthorized !!!',
        });
      }
    } else {
      res.status(402).send({
        status: CONFIG_STATUS.TOKEN_ERROR,
        message: 'Unauthorized !!!',
      });
    }
  }
};
const requireRole = (roles) => async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  var decodedToken = require('../utils/security').verifyToken(token);
  if (decodedToken.data.role == null) {
    res.status(403).send({
      status: CONFIG_STATUS.TOKEN_ERROR,
      message: 'Token is missing role. Please try again.',
    });
  } else {
    if (roles.includes(decodedToken.data.role)) {
      next();
    } else {
      res.status(403).send({
        status: CONFIG_STATUS.TOKEN_ERROR,
        message: 'Forbidden, your account is not granted.',
      });
    }
  }
};


module.exports = {
  requireLogin,
  requireRole
};
