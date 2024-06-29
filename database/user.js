const User = require('../model/user');
const { generatePassword } = require('../utils/security');

exports.UserSeeder = async function () {
  await User.deleteMany()
    .then(() => {
      console.log('User collection cleared');
    })
    .catch((error) => {
      console.log(error);
    });

  const data = [
    { name: 'Admin User', phoneNumber: '0965670347', password: '1234567890', role: 'ADMIN', status: 1 },
    { name: 'Sales User', phoneNumber: '0987378533', password: '1234567890', role: 'SALE', status: 1 },
    { name: 'Operator User', phoneNumber: '0969559556', password: '1234567890', role: 'OPERATOR', status: 1 },
  ];

  for (let i = 0; i < data.length; i++) {
    const encryptedPassword = await generatePassword(data[i].password);
    await User.create({
      name: data[i].name,
      phoneNumber: data[i].phoneNumber,
      password: encryptedPassword,
      role: data[i].role,
      refresh_token: '', // Assign the refresh token as needed
    }).catch((error) => {
      console.log(error);
    });
  }

  console.log('User collection seeded');
};
