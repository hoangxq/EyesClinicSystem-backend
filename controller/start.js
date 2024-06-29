const moment = require('moment');
const { statistics } = require('../tools/heapUsage');
const CONFIG_STATUS = require('../config/status.json');
const getStart = async (req, res) => {
  // const { filter } = req.pagination;
  // const {} = req.body;
  // if (filter == 0) {
  //   console.log('filter is undefined');
  // } else {
  //   console.log(filter);
  // }
  res.send({
    status: CONFIG_STATUS.SUCCESS,
    message: 'Api is running.',
    server_status: statistics,
  });
};
const postTest = async (req, res) => {
  const { date } = req.body;
  res.send({
    status: CONFIG_STATUS.SUCCESS,
    message: 'Api is running.',
    date: moment(date, 'HH:mm DD/MM/YYYY').unix(),
  });
};

module.exports = {
  getStart,
  postTest,
};
