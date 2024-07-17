const User = require('../model/user');
const convertDate = require('../middlewares/convertDate');
const security = require('../utils/security');
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');

const getAllUser = async () => {
  const user_list = await User.find(null, 'name phone status role')
  const total = await User.countDocuments();
  return {
    user_list,
    meta_data: {
      length: user_list.length,
      total,
    },
  };
};

const getAllUserDoctor = async () => {
  const user_list = await User.find({role: 'DOCTOR'}, 'name age ')
  const total = await User.countDocuments();
  return {
    user_list,
    meta_data: {
      length: user_list.length,
      total,
    },
  };
};
const getUserByID = async (user_id) => {
  const user_info = await User.findOne({ _id: user_id });
  // const decodePassword = await security.decodePassword(user_info.password)
  return {
    user_info: {
      name: user_info.name,
      status: user_info.status,
      _id: user_info._id,
      phone: user_info.phone,
      // password: decodePassword,
      role: user_info.role,
      email: user_info.email,
      address: user_info.address,
      gender: user_info.gender,
      dob: convertDate.convertDOBFormat(user_info.dob),
      age: user_info.age,
      created_at: user_info.created_at,
      updated_at: user_info.updated_at,
      __v: user_info.__v,
    },
  };
};

const getUserByPhoneNumber = async (user_phone) => {
  const user_info = await User.findOne({ phone: user_phone });
  // const decodePassword = await security.decodePassword(user_info.password)
  console.log(user_info)
  return {
    user_info: {
      name: user_info.name,
      status: user_info.status,
      _id: user_info._id,
      phone: user_info.phone,
      // password: decodePassword,
      role: user_info.role,
      email: user_info.email,
      address: user_info.address,
      gender: user_info.gender,
      dob: convertDate.convertDOBFormat(user_info.dob),
      age: user_info.age,
      created_at: user_info.created_at,
      updated_at: user_info.updated_at,
      __v: user_info.__v,
    },
  };
};
const createUser = async ({ phone, password, role ,email,  name, address, gender, dob }) => {
  const isExist = await User.exists({ phone });
  if (isExist) {
    return {
      status: CONFIG_STATUS.FAIL,
      message: 'The user is already exist.',
    };
  } else {
    const encryptedPassword = await security.generatePassword(password);
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // Kiểm tra nếu chưa đến sinh nhật trong năm nay thì trừ đi 1 tuổi
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    await User.create({
      phone,
      password: encryptedPassword,
      role,
      email, 
      name, 
      address, 
      gender,
      dob,
      age
    });
    return {
      status: CONFIG_STATUS.SUCCESS,
      message: 'The user created successful.',
    };
  }
};
const updateUserByID = async (form, user_id) => {
  const checkExist = await User.exists({ _id: user_id });
  if (checkExist) {
    const update_result = await User.findByIdAndUpdate(user_id, form, {
      new: true,
      // useFindAndModify: false
    });
    // await User.findByIdAndUpdate(user_id, form, { new: true });
    return {
      status: CONFIG_STATUS.SUCCESS,
      message: 'Update User successful.',
      result: {
        phone_code: update_result.phone_code,
        refresh_token: update_result.refresh_token,
        status: update_result.status,
        _id: update_result._id,
        phone: update_result.phone,
        role: update_result.role,
        created_at: update_result.created_at,
        updated_at: update_result.updated_at,
      },
    };
  } else {
    return {
      status: CONFIG_STATUS.FAIL,
      message:
        'Update User failed, the Object ID is not exist. Please try again',
    };
  }
};
const checkExistUser = async (user_id) => {
  let isExist = Boolean;
  if (!REGEX.OBJECT_ID_REGEX.test(user_id)) {
    isExist = false;
  } else {
    isExist = await User.exists({ _id: user_id });
  }
  return {
    isExist,
  };
};
const getUserPassword = async (user_id) => {
  const result = await User.findById(user_id, 'password');
  return {
    result,
  };
};
module.exports = {
  getAllUser,
  getUserByID,
  createUser,
  updateUserByID,
  checkExistUser,
  getUserPassword,
  getAllUserDoctor,
  getUserByPhoneNumber
};
