
const Invoice = require('../model/invoice')
const Product = require('../model/product')
const ProductInvoice = require('../model/productInvoice')
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');
const User = require('../model/user')


// const getAllInvoice = async () => {
//     const invoice_list = await Invoice.find();
//     const total = await Invoice.countDocuments();
//     return {
//         invoice_list,
//         meta_data: {
//             length: invoice_list.length,
//             total,
//         },
//     };
// };
const getAllInvoice = async () => {
    var invoice_list = [];
    var invoices = [];
    var total = Number;
    invoices = await Invoice.find(
        null,
        'userId amount status content created_at updated_at'
    );

    for (let i = 0; i < invoices.length; i++) {
        let invoice_detail = {
            _id: String,
            userName: String,
            amount: Number,
            status: Number,
            content: String,
            created_at: Date,
            updated_at: Date,
        };
        const user = await User.findOne({ _id: invoices[i].userId });

        invoice_detail._id = invoices[i]._id;
        invoice_detail.userName = user ? user.name : null;
        invoice_detail.amount = invoices[i].amount;
        invoice_detail.status = invoices[i].status;
        invoice_detail.content = invoices[i].content;
        invoice_detail.created_at = invoices[i].created_at;
        invoice_detail.updated_at = invoices[i].updated_at;

        invoice_list.push(invoice_detail);
    }

    total = await Invoice.countDocuments();

    return {
        invoice_list,
        meta_data: {
            length: invoice_list.length,
            total,
        },
    };
};

const getAllUnpaidInvoices = async () => {
    const unpaidInvoices = await Invoice.find({ status: 0 });
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Fetched unpaid invoices successfully',
        invoice_list: unpaidInvoices,
    };

};
const getAllInvoiceByUserId = async (user_id) => {
    const invoice_list = await Invoice.find({ userId: user_id });
    console.log(invoice_list)
    const total = await Invoice.countDocuments();
    return {
        invoice_list,
        meta_data: {
            length: invoice_list.length,
            total,
        },
    };
};
const getInvoiceDetail = async (invoice_id) => {
    const invoiceDetail = await Invoice.findOne({ _id: invoice_id });

    if (!invoiceDetail) {
        return {
            status: CONFIG_STATUS.FAIL,
            message: 'Hóa đơn không tồn tại',
        };
    }

    // Tìm tất cả các sản phẩm thuộc hóa đơn có invoiceId là invoice_id
    const productInvoices = await ProductInvoice.find({ invoiceId: invoice_id });

    // Tạo danh sách sản phẩm chỉ với tên và số lượng
    const products = [];

    for (const pi of productInvoices) {
        const productDetail = await Product.findOne({ _id: pi.productId });
        if (productDetail) {
            products.push({
                name: productDetail.name,
                quantity: pi.quantity,
                price: productDetail.price,
            });
        }
    }

    const user = await User.findOne({ _id: invoiceDetail.userId })

    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Lấy chi tiết hóa đơn thành công',
        data: {
            invoice: {
                _id: invoiceDetail._id,
                content: invoiceDetail.content,
                amount: invoiceDetail.amount,
                status: invoiceDetail.status,
                created_at: invoiceDetail.created_at,
                updated_at: invoiceDetail.updated_at,
                user_name: user.name,
                user_phone: user.phone,
            },
            products: products,
        },
    };
}

const createInvoice = async ({ userId, doctorScheduleId, amount, content }) => {

    const newInvoice = new Invoice({
        userId,
        doctorScheduleId,
        amount,
        content,
    });

    const savedInvoice = await newInvoice.save();
    return savedInvoice;

};

const createInvoiceByUserPhoneNumber = async (userPhone, amount, content) => {

    const user = await User.findOne({ phone: userPhone })
    if (user) {
        console.log('user', user)
        const userId = user._id;
        const newInvoice = new Invoice({
            userId,
            amount,
            content,
        });
        const savedInvoice = await newInvoice.save();
        return savedInvoice;
    } else {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'User is not found',
        };
    }



};
const updateStatusInvoice1 = async (invoice_id) => {
    const invoiceDetail = await Invoice.findOne({ _id: invoice_id });
    console.log(invoiceDetail);
    if (!invoiceDetail) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    } else {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: invoice_id },
            { status: 1 },
            { new: true, upsert: true }
        );

        return updatedInvoice;
    }
};
const updateStatusInvoice2 = async (invoice_id) => {
    const invoiceDetail = await Invoice.findOne({ _id: invoice_id });
    console.log(invoiceDetail);
    if (!invoiceDetail) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    } else {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: invoice_id },
            { status: 2 },
            { new: true, upsert: true }
        );

        return updatedInvoice;
    }
};

const updateStatusInvoice3 = async (invoice_id) => {
    const invoiceDetail = await Invoice.findOne({ _id: invoice_id });
    console.log(invoiceDetail);
    if (!invoiceDetail) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    } else {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { invoice_id },
            { status: 3 },
            { new: true, upsert: true }
        );

        return updatedInvoice;
    }
};

const deleteInvoiceByDoctorScheduleId = async (doctorScheduleId) => {
    const invoices = await Invoice.find({ doctorScheduleId: doctorScheduleId });

    // Xóa từng hóa đơn
    // for (const invoice of invoices) {
    await Invoice.findByIdAndDelete(invoices._id);
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Invoices deleted successfully',
    };
}

const getInvoiceByDoctorScheduleId = async (doctorScheduleId) => {
    const invoice = await Invoice.find({ doctorScheduleId: doctorScheduleId });

    return invoice
}

const deleteInvoiceById = async (invoiceId) => {
    await Invoice.findByIdAndDelete(invoiceId);
    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Invoices deleted successfully',
    };
}

module.exports = {
    getInvoiceDetail,
    createInvoice,
    updateStatusInvoice1,
    updateStatusInvoice2,
    updateStatusInvoice3,
    getAllInvoice,
    getAllInvoiceByUserId,
    getAllUnpaidInvoices,
    deleteInvoiceByDoctorScheduleId,
    createInvoiceByUserPhoneNumber,
    getInvoiceByDoctorScheduleId,
    deleteInvoiceById
}