const userService = require('../service/user');
const {
  verifyToken,
  generatePassword,
  verifyPassword,
} = require('../utils/security');
const { dataHandle } = require('../middlewares/dataHandle');
const authUserService = require('../service/authUser');
const CONFIG_STATUS = require('../config/status.json');
const config = require('config');
const { REGEX } = require('../config/regex');

const getAllUser = async (req, res) => {
  // const user_list = await userService.getAllUser(req.pagination);
  const user_list = await userService.getAllUser();  
  dataHandle(user_list, req, res);
};
const getUserByID = async (req, res) => {
  const { user_id } = req.params;
  const { isExist } = await userService.checkExistUser(user_id);
  if (isExist) {
    const user_info = await userService.getUserByID(user_id);
    dataHandle(user_info, req, res);
  } else {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'User is not exist',
    });
  }
};
const getUserInfo = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = verifyToken(token);
  const phone = decodedToken.data.phone;
  if (phone == null) {
    res.status(400).send({
      status: CONFIG_STATUS.TOKEN_ERROR,
      message: 'Please try again, TOKEN ERROR: phone is null.',
    });
  } else {
    const info = await authUserService.getUserInfo(phone);
    dataHandle(info, req, res);
  }
};
const createUser = async (req, res) => {
  const { phone, password, role } = req.body;
  if (role == config.get('role.admin')) {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'There is only one ADMIN, please try with another role.',
    });
  } else if (
    role != config.get('role.doctor') &&
    role != config.get('role.patient') &&
    role != config.get('role.nurse') &&
    role != config.get('role.sale') &&
    role != config.get('role.receptionist')
  ) {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'Create user fail, please choose roles in eyesclinic system.',
    });
  } else {
    if (phone == null || password == null || password == '' || role == null) {
      res.status(400).send({
        status: CONFIG_STATUS.FAIL,
        message: 'Request body is invalid form. Please try again',
      });
    } else {
      const checkPhone = new RegExp(REGEX.PHONE_REGEX).test(phone);
      if (!checkPhone) {
        res.status(400).send({
          status: CONFIG_STATUS.FAIL,
          message: 'Please try again, phone is invalid form.',
        });
      } else {
        var result = await userService.createUser(req.body);
        if (result.status != 0) {
          res.send({
            ...result,
          });
        } else {
          res.status(500).send({
            ...result,
          });
        }
      }
    }
  }
};
const updateUserByID = async (req, res) => {
    const { phone, status, role, access_token, refresh_token, password } = req.body
    const { user_id } = req.params

    var updates = {
        ...req.body,
        updated_at: Date.now()
    }
    if (password != null) {
        const encryptedPassword = await generatePassword(password)
        updates = {
            ...req.body,
            password: encryptedPassword,
            updated_at: Date.now()
        }
    }
    if (role == 'ADMIN') {
        res.status(400).send({
            status: 0,
            message: 'There is only one ADMIN, please try with another role.'
        })
    } else {
        if (phone == null && password == null && role == null && access_token == null && refresh_token == null, status == null) {
            res.status(400).send({
                status: 0,
                message: 'Request body is empty. Please try again'
            })
        }
        else {
            var result = await userService.updateUserByID(updates, user_id)
            if (result.status != 0) {
                res.send({
                    ...result
                })
            } else {
                res.status(500).send({
                    ...result
                })
            }
        }
    }
}
const updateUserPassword = async (req, res) => {
  const { user_id } = req.params;
  const { new_password } = req.body;
  if (user_id == null) {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'Please try again, user_id is null.',
    });
  } else {
    const { isExist } = await userService.checkExistUser(user_id);
    if (!isExist) {
      res.status(400).send({
        status: CONFIG_STATUS.FAIL,
        message: 'Please try again, user_id is not exists.',
      });
    } else {
      if (new_password == null || new_password == '') {
        res.status(400).send({
          status: CONFIG_STATUS.FAIL,
          message: 'Request form is invalid. Please try again.',
        });
      } else {
        const encryptedPassword = await generatePassword(new_password);
        var updates = {
          password: encryptedPassword,
          updated_at: Date.now(),
        };
        var resultUpdate = await userService.updateUserByID(updates, user_id);
        if (resultUpdate.status != 0) {
          res.send({
            ...resultUpdate,
          });
        } else {
          res.status(500).send({
            ...resultUpdate,
          });
        }
      }
    }
  }
};
const blockUser = async (req, res) => {
  const { user_id } = req.params;
  if (user_id == null) {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'Please try again, user_id is null.',
    });
  } else {
    const { isExist } = await userService.checkExistUser(user_id);
    if (!isExist) {
      res.status(400).send({
        status: CONFIG_STATUS.FAIL,
        message: 'Please try again, user_id is not exists.',
      });
    } else {
      var updates = {
        status: 2,
        updated_at: Date.now(),
      };
      var resultUpdate = await userService.updateUserByID(updates, user_id);
      if (resultUpdate.status != 0) {
        res.send({
          status: resultUpdate.status,
          message: resultUpdate.message,
        });
      } else {
        res.status(500).send({
          status: resultUpdate.status,
          message: resultUpdate.message,
        });
      }
    }
  }
};

const unBlockUser = async (req, res) => {
  const { user_id } = req.params;
  if (user_id == null) {
    res.status(400).send({
      status: CONFIG_STATUS.FAIL,
      message: 'Please try again, user_id is null.',
    });
  } else {
    const { isExist } = await userService.checkExistUser(user_id);
    if (!isExist) {
      res.status(400).send({
        status: CONFIG_STATUS.FAIL,
        message: 'Please try again, user_id is not exists.',
      });
    } else {
      var updates = {
        status: 1,
        updated_at: Date.now(),
      };
      var resultUpdate = await userService.updateUserByID(updates, user_id);
      if (resultUpdate.status != 0) {
        res.send({
          status: resultUpdate.status,
          message: resultUpdate.message,
        });
      } else {
        res.status(500).send({
          status: resultUpdate.status,
          message: resultUpdate.message,
        });
      }
    }
  }
};

module.exports = {
  getAllUser,
  getUserByID,
  getUserInfo,
  createUser,
  updateUserByID,
  updateUserPassword,
  blockUser,
  unBlockUser
};
