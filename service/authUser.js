const User = require('../model/user');
const login = async (phone) => {
  const result = await User.findOne(
    { phone },
    'status password refresh_token'
  ).exec();
  if (result) {
    return {
      result,
    };
  } else {
    return false;
  }
};
const getUserInfo = async (phone) => {
  const info = await User.findOne(
    { phone },
    'status name phone role address created_at updated_at'
  ).exec();
  return {
    info,
  };
};

module.exports = {
  login,
  getUserInfo,
};
