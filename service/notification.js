
const Notification = require('../model/notification')
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');

const getAllNotifications = async () => {
    const notifications =  await Notification.find();
    if (!notifications) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };


    } else {
        return {
            status: CONFIG_STATUS.SUCCESS,
            message: 'Get Notification Detail Successfully',
            data: notifications
        };
    }
};


const getNotificationDetail = async (notification_id) => {
    const notificationDetail = await Notification.findOne({ _id: notification_id });
    console.log(notificationDetail);
    if (!notificationDetail) {

        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };


    } else {
        return {
            status: CONFIG_STATUS.SUCCESS,
            message: 'Get Notification Detail Successfully',
            data: notificationDetail
        };
    }
}

const createNotification = async (title, content, photo) => {

    const newNotification = new Notification({
        title,
        content,
        photo
    });


    const savedNotification = await newNotification.save();
    return savedNotification; 

};
const updateNotification = async (notification_id,title, content) => {
    
    const updatedNotification = await Notification.findOneAndUpdate(
        { notification_id },
        { title, content},
        { new: true, upsert: true }
    );

    return updatedNotification;

};

module.exports = {
    getNotificationDetail,
    createNotification,
    updateNotification,
    getAllNotifications
}