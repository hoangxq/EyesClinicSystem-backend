const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const productInvoiceController = require('../controller/productInvoice.js');

Route.post('/createMultiple',
    Trycatch(productInvoiceController.createMultipleProductInvoices)
);
module.exports = Route;
