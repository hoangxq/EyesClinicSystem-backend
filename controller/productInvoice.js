
const productInvoiceService = require('../service/productInvoice');
const CONFIG_STATUS = require('../config/status.json');
const invoiceService = require('../service/invoice')


const createMultipleProductInvoices = async (req, res) => {
    console.log(req.body)
    const userPhone = req.body.customerPhone;
    const total = req.body.totalPrice;

    const content = 'Hóa đơn mua hàng';

    const createdInvoice = await invoiceService.createInvoiceByUserPhoneNumber(userPhone, total, content)
    const productList = req.body.products;

    console.log(productList)

    const createdProductInvoices = await productInvoiceService.createMultipleProductInvoices(productList, createdInvoice._id);

    res.status(201).json({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Multiple product invoices created successfully.',
        data: {
            invoice: createdInvoice,
            productInvoices: createdProductInvoices,
        },
    });

};

module.exports = {
    createMultipleProductInvoices,
};
