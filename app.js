var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const Doctor = require('./model/doctor');

var userRouter = require('./routes/user');
var authUserRouter = require('./routes/authUser');
var doctorRouter = require('./routes/doctor.js')
var scheduleRouter = require('./routes/schedule.js');
var doctorScheduleRouter = require('./routes/doctorSchedule.js');
var historyRouter = require('./routes/history.js');
var notificationRouter = require('./routes/notification.js');
var invoiceRouter = require('./routes/invoice.js');
var paymentRouter = require('./routes/payment.js');
var productRouter = require('./routes/product.js');
var productInvoiceRouter = require('./routes/productInvoice.js');

var testRouter = require('./routes/start.js');
var { errorHandle } = require('./middlewares/errorHandle');
require('dotenv').config();

var app = express();

const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
};

process.env.TZ = 'Asia/Ho_Chi_Minh';

app.use(logger('dev', {}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));

app.use('/api/user', userRouter, errorHandle);
app.use('/api/auth-user', authUserRouter, errorHandle);
app.use('/api/doctor', doctorRouter, errorHandle);
app.use('/api/schedule', scheduleRouter, errorHandle);
app.use('/api/doctor_schedule', doctorScheduleRouter, errorHandle);
app.use('/api/history', historyRouter, errorHandle);
app.use('/api/notification',notificationRouter, errorHandle);
app.use('/api/invoice',invoiceRouter, errorHandle);
app.use('/api/payment',paymentRouter,errorHandle);
app.use('/api/product',productRouter,errorHandle);
app.use('/api/product_invoice',productInvoiceRouter,errorHandle);
app.use('/api/test', testRouter, errorHandle);

// app.use(errorHandle);




app.get("/", (req, res) => {
  res.send("Haha World!");
})

app.get("/users", async (req, res) => {
  try {
    const users = await Doctor.find();
    console.log('heleo')
    res.json(users);
  } catch (err) {
    console.log(err)
    res.status(500).send('Lỗi khi lấy dữ liệu người dùng');
  }
});



module.exports = app;
