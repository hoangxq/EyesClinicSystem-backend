const userService = require('../service/user');
const authUserService = require('../service/authUser');
const security = require('../utils/security');
const CONFIG_STATUS = require('../config/status.json');
const login = async (req, res, next) => {
  const loginForm = {
    phone: req.body.phone,
    password: req.body.password,
  };
  var { result } = await authUserService.login(loginForm.phone);
  if (result) {
    if (result.status == 1) {
      const compare = await security.verifyPassword(
        loginForm.password,
        result.password
      );
      const { info } = await authUserService.getUserInfo(loginForm.phone);
      if (compare) {
        var updates = await userService.updateUserByID(
          {
            refresh_token: security.generateRefreshToken({
              phone: loginForm.phone,
              role: info.role,
              status: info.status,
            }),
            updated_at: Date.now(),
          },
          info._id
        );
        res.send({
          status: CONFIG_STATUS.SUCCESS,
          message: 'Login successful.',
          data: {
            access_token: security.generateToken({
              phone: info.phone,
              role: info.role,
              _id: info._id,
              status: info.status,
            }),
            refresh_token: updates.result.refresh_token,
            user_info: {
              phone: info.phone,
              role: info.role,
              _id: info._id,
            },
          },
        });
        next();
      } else {
        res.status(403).send({
          status: CONFIG_STATUS.FAIL,
          message: 'Wrong password.',
        });
      }
    } else {
      res.status(403).send({
        status: CONFIG_STATUS.FAIL,
        message:
          'The account is blocked or inactived. Please contact with admin !!!',
      });
    }
  } else {
    res.status(404).send({
      status: CONFIG_STATUS.FAIL,
      message: 'User not found.',
    });
  }
};
const logOut = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = security.verifyToken(token);
  const user_id = decodedToken.data._id;
  var result = await userService.updateUserByID(
    {
      refresh_token: 'EMPTY',
      updated_at: Date.now(),
    },
    user_id
  );
  if (result.status != 0) {
    res.send({
      status: CONFIG_STATUS.SUCCESS,
      message: 'Logout successful.',
    });
  } else {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'Logout failed.',
    });
  }
};

module.exports = {
  login,
  logOut,
};
