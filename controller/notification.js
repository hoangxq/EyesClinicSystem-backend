
const notificationService = require('../service/notification');
const {
    verifyToken,
    generatePassword,
    verifyPassword,
} = require('../utils/security');
const { dataHandle } = require('../middlewares/dataHandle');
const authUserService = require('../service/authUser');
const CONFIG_STATUS = require('../config/status.json');
const config = require('config');
const { REGEX } = require('../config/regex');

const getAllNotifications = async (req, res) => {
    const notifications = await notificationService.getAllNotifications();
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get all notifications successful.',
        data: notifications
    });
};

const getNotificationDetail = async (req, res) => {
    const { notification_id } = req.params;
    console.log(notification_id )
    const notificationDetail = await notificationService.getNotificationDetail(notification_id);
    console.log('qa')
    console.log(notificationDetail)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get notification successful.',
        data: notificationDetail
    });
}

const createNotification = async (req, res) => {
    // const {doctorScheduleId} = req.params;
    const {
        title,
        content,
        photo
    } = req.body;

    console.log(req.body)
    const newNotification = await notificationService.createNotification(title,content,photo)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Create Notification successful.',
        data: {
            newNotification,
        },
    });
};

const updateNotification = async (req, res) => {
    const {
        title,
        content,
    } = req.body;
    const updateNotification = await notificationService.updateNotification(title,content)
    if(updateNotification.status == 0) {
        res.send({
        status: CONFIG_STATUS.FAIL,
        message: 'Bạn không thể cập nhật thông báo này'
        })
    }
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Update Notification successful.',
        data: {
            updateNotification,
        },
    });
};


module.exports = {
    getNotificationDetail,
    createNotification,
    updateNotification,
    getAllNotifications
}
