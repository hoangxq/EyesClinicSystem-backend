const crypto = require('crypto');
const axios = require('axios');
const Invoice = require('../model/invoice')
const invoiceService = require('../service/invoice')


const momoPaymentByInvoiceID = async (invoiceId, returnUrl) => {
    try {
        // Lấy thông tin hóa đơn từ invoiceId (giả sử hàm này đã được triển khai)
        const invoice = await invoiceService.getInvoiceDetail(invoiceId);

        if (!invoice) {
            throw new Error('Invoice not found');
        }
        console.log('hoa don', invoice)
        // const { amount, orderId, orderInfo } = invoice;
        const amount = invoice.data.invoice.amount;
        const orderId = invoice.data.invoice._id;
        // const orderInfo = invoice.data.content;
        const orderInfo = 'thanhtoan';
        const requestId = orderId;
        const partnerCode = 'MOMO';
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        // const notifyUrl = 'http://localhost:8080/api/payment/momo-payment/check/callback';
        const notifyUrl = 'https://8099-113-23-64-215.ngrok-free.app/api/payment/momo-payment/update/callback';
        const requestType = 'captureWallet';
        const extraData = 'eyJ1c2VybmFtZSI6ICJtb21vIn0=';
        // const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
        var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            notifyUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            returnUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;


        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: returnUrl,
            ipnUrl: notifyUrl,
            lang: 'vi',
            requestType: requestType,
            extraData: extraData,
            extraData: extraData,
            autoCapture: true,
            signature: signature,

        });
        console.log('rawsignature', rawSignature)
        console.log('body', requestBody);
        console.log('signature', signature);

        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });;

        return {
            payUrl: response.data.payUrl
        };

    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('An error occurred while processing the payment');
    }
};


const processMomoNotification = async (notification) => {
    if (notification.resultCode === 0) {
        // Giao dịch thành công
        await Invoice.updateOne({ _id: notification.orderId }, { status: '1', transId: notification.transId });
    } else {
        // Giao dịch thất bại hoặc bị hủy
        await Invoice.updateOne({ _id: notification.orderId }, { status: '3', transId: notification.transId });
    }
};

const refund = async (orderId, amount, transId, invoiceId) => {
    try {
        // Thông tin cần thiết cho yêu cầu hoàn tiền
        const partnerCode = 'MOMO';
        const accessKey = 'F8BBA842ECF85';
        const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
        const requestId = orderId;
        const requestType = 'refundMoMoWallet';
        const description = 'Refund for order ' + orderId;
        const extraData = '';

        // Tạo chữ ký
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // Tạo request body
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            transId: transId,
            requestType: requestType,
            description: description,
            extraData: extraData,
            signature: signature,
        });

        console.log('body hoan tien', requestBody)

        console.log('rawSignature:', rawSignature);
        console.log('requestBody:', requestBody);
        console.log('signature:', signature);

        // Gửi yêu cầu hoàn tiền đến Momo
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/refund', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Xử lý phản hồi từ API
        if (response.data.resultCode === 0) {
            // Hoàn tiền thành công
            await Invoice.updateOne({ _id: invoiceId }, { status: '2' }); // 2 là trạng thái đã hoàn tiền
            return { success: true, message: 'Refund successful' };
        } else {
            // Hoàn tiền thất bại
            return { success: false, message: 'Refund failed', data: response.data };
        }
    } catch (error) {
        console.error('Error processing refund:', error);
        throw new Error('An error occurred while processing the refund');
    }
};


module.exports = {
    momoPaymentByInvoiceID,
    processMomoNotification,
    refund
};
