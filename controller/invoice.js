
const invoiceService = require('../service/invoice');
const { dataHandle } = require('../middlewares/dataHandle');
const authUserService = require('../service/authUser');
const CONFIG_STATUS = require('../config/status.json');
const config = require('config');

const { REGEX } = require('../config/regex');
const getAllInvoice = async (req, res) => {
    // const user_list = await userService.getAllUser(req.pagination);
    const invoice_list = await invoiceService.getAllInvoice();
    dataHandle(invoice_list, req, res);
};
const getAllInvoiceByUserId = async (req, res) => {
    // const user_list = await userService.getAllUser(req.pagination);
    const { user_id } = req.params;
    const invoice_list = await invoiceService.getAllInvoiceByUserId(user_id);
    dataHandle(invoice_list, req, res);
};
const getInvoiceDetail = async (req, res) => {
    console.log('qa')
    const _id = req.params;

    console.log(_id)
    const invoiceDetail = await invoiceService.getInvoiceDetail(_id);
    console.log(invoiceDetail)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get invoice successful.',
        data: invoiceDetail
    });
}

const createInvoice = async (req, res) => {
    // const {doctorScheduleId} = req.params;
    const {
        user_id,
        amount,
        content
    } = req.body;
    const newInvoice = await invoiceService.createInvoice(user_id, amount, content)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Create Invoice successful.',
        data: {
            newInvoice,
        },
    });
};

const updateInvoiceStatus1 = async (req, res) => {
    const {
        invoice_id,
    } = req.params;
    const updateInvoice = await invoiceService.updateStatusInvoice1(invoice_id)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Update Invoice successful.',
        data: {
            updateInvoice,
        },
    });
};
const updateInvoiceStatus2 = async (req, res) => {
    const {
        invoice_id,
    } = req.body;
    const updateInvoice = await invoiceService.updateStatusInvoice2(invoice_id)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Update Invoice successful.',
        data: {
            updateInvoice,
        },
    });
};

const deleteInvoiceById = async (req, res) => {
    const _id = req.params;
    
    await invoiceService.deleteInvoiceById(_id)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Delete Invoice successful.',
    });
};

module.exports = {
    getAllInvoiceByUserId,
    getAllInvoice,
    getInvoiceDetail,
    createInvoice,
    updateInvoiceStatus1,
    updateInvoiceStatus2,
    deleteInvoiceById
}
