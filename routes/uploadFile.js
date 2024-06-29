const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middlewares/upload'); // Middleware tải lên tệp

router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})


module.exports = router;
