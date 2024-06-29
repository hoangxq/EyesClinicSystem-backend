
const historyService = require('../service/history');
const { dataHandle } = require('../middlewares/dataHandle');
const authUserService = require('../service/authUser');
const CONFIG_STATUS = require('../config/status.json');
const config = require('config');
const { REGEX } = require('../config/regex');

const getHistoryDetail = async (req, res) => {
    const { doctorScheduleId } = req.params;
    console.log(doctorScheduleId)
    const historyDetail = await historyService.getHistoryDetail(doctorScheduleId);
    console.log('qa')
    console.log(historyDetail)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Get history successful.',
        data: historyDetail
    });
}

const createHistory = async (req, res) => {
    // const {doctorScheduleId} = req.params;
    const {
        doctorScheduleId,
        description,
        leftEye,
        rightEye,
        file,
    } = req.body;
    const newHistory = await historyService.createHistory(doctorScheduleId, description, leftEye, rightEye, file)
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Create history successful.',
        data: {
            newHistory,
        },
    });
};

const updateHistory = async (req, res) => {
    // const { doctorScheduleId } = req.params;
    const {
        doctorScheduleId,
        result,
        prescription,
    } = req.body;
    const updateHistory = await historyService.updateHistory(doctorScheduleId, result,prescription)
    if(updateHistory.status == 0) {
        res.send({
        status: CONFIG_STATUS.FAIL,
        message: 'Bạn không thể khám cho bệnh nhân này'
        })
    }
    res.send({
        status: CONFIG_STATUS.SUCCESS,
        message: 'Updatehistory successful.',
        data: {
            updateHistory,
        },
    });
};


module.exports = {
    getHistoryDetail,
    createHistory,
    updateHistory
}
