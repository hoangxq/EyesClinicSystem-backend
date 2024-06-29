const fs = require('fs');
const path = require('path');
const moment = require('moment');
var errorLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/error.log'),
  { flags: 'a' }
);
const errorLog = (error, source, request) => {
  let logStr = '';
  if (error != null) {
    if (request == null) {
      if (!error.stack) {
        logStr = `
      ${moment().format('HH:mm DD/MM/YYYY')} | [${source}] | -- -- | [--] \n ${
          error.message
        }
      `;
      } else {
        logStr = `
      ${moment().format('HH:mm DD/MM/YYYY')} | [${source}] | -- -- | [--] \n ${
          error.stack
        }
      `;
      }
    } else {
      if (!error.stack) {
        logStr = `
    ${moment().format('HH:mm DD/MM/YYYY')} | [${source}] |  ${request.method} ${
          request.originalUrl
        } | [${request.ip}] \n ${error.message}
    `;
      } else {
        logStr = `
    ${moment().format('HH:mm DD/MM/YYYY')} | [${source}] |  ${request.method} ${
          request.originalUrl
        } | [${request.ip}] \n ${error.stack}
    `;
      }
    }
  }
  errorLogStream.write(logStr);
};
const errorOTPLog = (errorOTP) => {
  let streamOTP = '';
  if (errorOTP.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    streamOTP = `
    ${JSON.stringify(errorOTP.response.data)}\n
    ${JSON.stringify(errorOTP.response.status)}\n
    ${JSON.stringify(errorOTP.response.headers)}
    `;
  } else if (errorOTP.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    streamOTP = `${JSON.stringify(errorOTP.request)}`;
  } else {
    // Something happened in setting up the request that triggered an Error
    streamOTP = `Error: ${errorOTP.message}`;
  }
  streamOTP += `${errorOTP.config}`;
  const logStr = `\n ${moment().format(
    'HH:mm DD/MM/YYYY'
  )} | [SMSOTP] | -- -- | [--] \n ${streamOTP}`;
  errorOTPLogStream.write(logStr);
};

module.exports = {
  errorLog,
  errorOTPLog,
};
