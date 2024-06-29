const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const productController = require('../controller/product');
const upload = require('../middlewares/upload');

Route.get(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.getAllProducts)
);

Route.get(
    '/:id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.getProductById)
);
Route.get(
    '/detail/code',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.getProductByCode)
);

Route.post(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.createProduct)
);

Route.put(
    '/:_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.updateProduct)
);

Route.delete(
    '/:_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(productController.deleteProduct)
);

module.exports = Route;
