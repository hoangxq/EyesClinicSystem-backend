const paymentService = require('../service/payment')
const { v4: uuidv4 } = require('uuid');


const momoPaymentByInvoiceID = async (req, res) => {
    const { invoiceId } = req.params;
    const { returnUrl } = req.body;


    console.log('qqqqqq', invoiceId)
    console.log('aaaaaaaaaaaaaaaa', returnUrl)

    try {
        const paymentResult = await paymentService.momoPaymentByInvoiceID(invoiceId, returnUrl);
        res.json(paymentResult);
    } catch (error) {
        console.error('Payment error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const handleMomoCallback = async (req, res) => {
    try {
        console.log('aaaaaaaaaaaaa')
        const notification = req.body;
        console.log('Received IPN:', notification);

        await paymentService.processMomoNotification(notification);

        res.status(204).send();
    } catch (error) {
        console.error('Error handling MoMo callback:', error);
        res.status(500).send('Internal Server Error');
    }
};

const check = async (req, res) => {
    /**
      resultCode = 0: giao dịch thành công.
      resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
      resultCode <> 0: giao dịch thất bại.
     */
    //console.log('callback: ');
    console.log(req.body);
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */

    return res.status(204).json(req.body);
};

const transactionCheck = async (req, res) => {
    const { orderId } = req.body;

    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return res.status(200).json(result.data);
};

const refund = async (req, res) => {
    const { transId, amount } = req.body;
    const orderId = uuidv4();
    const {invoiceId} = req.params;
    const paymentResult = await paymentService.refund(orderId, amount, transId, invoiceId);
    res.json(paymentResult);
}

module.exports = {
    momoPaymentByInvoiceID,
    handleMomoCallback,
    check,
    transactionCheck,
    refund
}