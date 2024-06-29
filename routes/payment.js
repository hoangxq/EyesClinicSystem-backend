const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const paymentController = require('../controller/payment');

Route.post(
    '/momo-payment',
    Trycatch(paymentController.momoPayment)
);

Route.post(
    '/momo-payment/refund/:invoiceId',
    Trycatch(paymentController.refund)
);


Route.post(
    '/momo-payment/:invoiceId',
    Trycatch(paymentController.momoPaymentByInvoiceID)
);

Route.post('/momo-payment/update/callback', paymentController.handleMomoCallback);

module.exports = Route;