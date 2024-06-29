const Route = require('express').Router();
const { Trycatch } = require('../middlewares/errorHandle');
const { requireLogin, requireRole } = require('../middlewares/auth');
const invoiceController = require('../controller/invoice');

Route.get(
    '/',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(invoiceController.getAllInvoice)
);
Route.get(
    '/:user_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(invoiceController.getAllInvoiceByUserId)
);
Route.get(
    '/detail/:_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(invoiceController.getInvoiceDetail)
);
Route.put(
    '/payment/:_id',
    // requireLogin,
    // requireRole(['ADMIN']),
    Trycatch(invoiceController.updateInvoiceStatus1)
)
Route.get(
    '/get/info',
    requireLogin,
    // requireRole(['ADMIN', '']),
    Trycatch(invoiceController.getInvoiceInfo)
);

Route.post('/updateInvoiceStatus', async (req, res) => {
    const { invoiceId, status } = req.body;

    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = status;
        invoice.updated_at = new Date();
        await invoice.save();

        res.status(200).json({ message: 'Invoice updated successfully' });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ message: 'An error occurred while updating the invoice' });
    }
});

Route.post('/deleteInvoice/:_id', 
// requireLogin,
// requireRole(['ADMIN']),
Trycatch(invoiceController.deleteInvoiceById)
)


module.exports = Route;
