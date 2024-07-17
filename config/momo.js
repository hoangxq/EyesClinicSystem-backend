import { env } from '~/config/environment'



module.exports = {
    partnerCode: env.MOMO_PARTNER_CODE,
    accessKey: env.MOMO_ACCESS_KEY,
    secretKey: env.MOMO_SECRET_KEY,
    orderInfo: 'pay with MoMo',
    redirectUrl: 'http://localhost:5173/',
    ipnUrl: '  https://3926-2405-4802-f820-8680-25dd-d9f4-a7b1-84b7.ngrok-free.app/momo/callback', 
    //ipnUrl: 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b',
    requestType: 'captureWallet',
    extraData: '',
    orderGroupId: '',
    autoCapture: true,
    lang: 'vi',
}