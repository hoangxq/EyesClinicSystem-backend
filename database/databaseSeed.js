require('dotenv').config;
var mongoose = require('mongoose');

const { UserSeeder } = require('./user');

exports.DBSeed = async () => {
  try {
    console.log('hello')
    mongoose.connect(
      process.env.DATABASE || 'mongodb://127.0.0.1:27017/eyesclinic',
      { useNewUrlParser: 'true', useUnifiedTopology: true }
    );
    //seed collection
    await UserSeeder();

    mongoose.connection.close();
  } catch (err) {
    console.log(err);
  }
};
