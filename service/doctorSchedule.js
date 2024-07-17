const Schedule = require('../model/schedule');
const TimeType = require('../model/timeType');
const Doctor = require('../model/doctor');
const User = require('../model/user');
const DoctorSchedule = require('../model/doctorSchedule');
const ScheduleService = require('../service/schedule');
const InvoiceService = require('../service/invoice');
const PaymentService = require('../service/payment');
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const getAllDoctorSchedule = async () => {
    var schedule_list = [];
    var schedules = [];
    var total = Number;
    schedules = await DoctorSchedule.find(
        null,
        'scheduleId patientId number status created_at updated_at'
    )


    for (let i = 0; i < schedules.length; i++) {
        let schedule_detail = {
            _id: String,
            timeType_name: String,
            doctor_name: String,
            date: Date,
            patient_name: String,
            number: Number,
            status: Number,
            created_at: Date,
            updated_at: Date,
        };
        const schedule = await Schedule.findOne({ _id: schedules[i].scheduleId });
        const timeType = await TimeType.findOne({ _id: schedule.timeTypeId });
        const doctor = await Doctor.findOne({ _id: schedule.doctorId });
        const userDoctor = await User.findOne({ _id: doctor.userId });
        const userPatient = await User.findOne({ _id: schedules[i].patientId });

        schedule_detail._id = schedules[i]._id;
        schedule_detail.timeType_name = timeType.name;
        schedule_detail.doctor_name = userDoctor.name;
        schedule_detail.date = schedule.date;
        schedule_detail.patient_name = userPatient?.name ? userPatient.name : null;
        schedule_detail.number = schedules[i].number;
        schedule_detail.status = schedules[i].status;
        schedule_detail.created_at = schedules[i].created_at;
        schedule_detail.updated_at = schedules[i].updated_at;

        schedule_list.push(schedule_detail);
    }

    return {
        schedule_list,
        meta_data: {
            length: schedule_list.length,
            total,
        },
    };
}

const createDoctorSchedule = async ({
    scheduleId,
    patientId,
}) => {
    const schedule = await Schedule.findOne({ _id: scheduleId });
    if (!schedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the schedule ID is not exist. Please try again',
        };
    }

    const currentDate = new Date();
    if (schedule.date < currentDate) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the appointment date is in the past. Please select a future date.',
        };
    }

    const existingPatient = await User.findOne({ _id: patientId });
    if (!existingPatient) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the patient ID is not exist. Please try again',
        };
    }
    console.log(patientId, 'qa', scheduleId)
    const alreadyPatient = await DoctorSchedule.findOne({ patientId: patientId, status: 0 });
    console.log('qa', alreadyPatient);
    if (alreadyPatient) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the patient already registerd. Please try again',
        };
    }
    let number = schedule.curentNumber + 1;
    console.log(number)
    if (number > schedule.maxNumber) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the doctor already full patient. Please try again',
        };
    }

    const newDoctorSchedule = await DoctorSchedule.create({
        scheduleId,
        patientId,
        number
    });
    await ScheduleService.increaseCurrentNumber(scheduleId);
    const invoiceData = {
        userId: patientId,
        doctorScheduleId: newDoctorSchedule._id,
        amount: 300000,
        content: "Đặt chỗ khám bệnh"
    };
    const newInvoice = await InvoiceService.createInvoice(invoiceData)

    return {
        status: CONFIG_STATUS.SUCCESS,
        result: {
            doctor: newDoctorSchedule,
            invoice: newInvoice
        },
        message: 'Schedule created successfully',
    };
}

const createDoctorScheduleByPhoneNumber = async (scheduleId, patientPhone) => {
    console.log('aaaaaaaaaaaaaaaaaa')
    console.log(scheduleId, patientPhone)
    const schedule = await Schedule.findOne({ _id: scheduleId });
    if (!schedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the schedule ID is not exist. Please try again',
        };
    }
    console.log('aaaaaaaaaaaaaaaaaa')
    const existingPatient = await User.findOne({ phone: patientPhone });
    if (!existingPatient) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the patient ID is not exist. Please try again',
        };
    }
    const patientId = existingPatient._id
    console.log(patientId, 'qa', scheduleId)
    const alreadyPatient = await DoctorSchedule.findOne({ patientId: patientId, status: 0 });
    console.log('qa', alreadyPatient);
    if (alreadyPatient) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the patient already registerd. Please try again',
        };
    }
    let number = schedule.curentNumber + 1;
    console.log(number)
    if (number > schedule.maxNumber) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create schedule failed, the doctor already full patient. Please try again',
        };
    }

    const newDoctorSchedule = await DoctorSchedule.create({
        scheduleId,
        patientId,
        number
    });
    await ScheduleService.increaseCurrentNumber(scheduleId);

    return {
        status: CONFIG_STATUS.SUCCESS,
        result: {
            doctor: newDoctorSchedule,
        },
        message: 'Schedule created successfully',
    };
}

const getAllDoctorScheduleByScheduleId = async (scheduleId) => {
    var schedule_list = [];
    var schedules = [];
    var total = Number;
    schedules = await DoctorSchedule.find(
        { scheduleId: scheduleId },
        'scheduleId patientId number status created_at updated_at'
    )


    for (let i = 0; i < schedules.length; i++) {
        let schedule_detail = {
            _id: String,
            timeType_name: String,
            doctor_name: String,
            date: Date,
            patient_name: String,
            number: Number,
            status: Number,
            created_at: Date,
            updated_at: Date,
        };
        const schedule = await Schedule.findOne({ _id: schedules[i].scheduleId });
        const timeType = await TimeType.findOne({ _id: schedule.timeTypeId });
        const doctor = await Doctor.findOne({ _id: schedule.doctorId });
        const userDoctor = await User.findOne({ _id: doctor.userId });
        const userPatient = await User.findOne({ _id: schedules[i].patientId });

        schedule_detail._id = schedules[i]._id;
        schedule_detail.timeType_name = timeType.name;
        schedule_detail.doctor_name = userDoctor.name;
        schedule_detail.date = schedule.date;
        schedule_detail.patient_name = userPatient.name;
        schedule_detail.number = schedules[i].number;
        schedule_detail.status = schedules[i].status;
        schedule_detail.created_at = schedules[i].created_at;
        schedule_detail.updated_at = schedules[i].updated_at;

        schedule_list.push(schedule_detail);
    }

    return {
        schedule_list,
        meta_data: {
            length: schedule_list.length,
            total,
        },
    };
}

const getDoctorDetailByPatientId = async (patientId) => {
    var schedule_list = [];
    var schedules = [];
    var total = Number;
    schedules = await DoctorSchedule.find(
        { patientId: patientId },
        'scheduleId patientId number status created_at updated_at'
    )


    for (let i = 0; i < schedules.length; i++) {
        let schedule_detail = {
            _id: String,
            timeType_name: String,
            doctor_name: String,
            date: Date,
            patient_name: String,
            number: Number,
            status: Number,
            created_at: Date,
            updated_at: Date,
        };
        const schedule = await Schedule.findOne({ _id: schedules[i].scheduleId });
        const timeType = await TimeType.findOne({ _id: schedule.timeTypeId });
        const doctor = await Doctor.findOne({ _id: schedule.doctorId });
        const userDoctor = await User.findOne({ _id: doctor.userId });
        const userPatient = await User.findOne({ _id: schedules[i].patientId });

        schedule_detail._id = schedules[i]._id;
        schedule_detail.timeType_name = timeType.name;
        schedule_detail.doctor_name = userDoctor.name;
        schedule_detail.date = schedule.date;
        schedule_detail.patient_name = userPatient.name;
        schedule_detail.number = schedules[i].number;
        schedule_detail.status = schedules[i].status;
        schedule_detail.created_at = schedules[i].created_at;
        schedule_detail.updated_at = schedules[i].updated_at;

        schedule_list.push(schedule_detail);
    }

    return {
        schedule_list,
        meta_data: {
            length: schedule_list.length,
            total,
        },
    };
}

const deleteDoctorSchedule = async (id) => {
    const doctorSchedule = await DoctorSchedule.findById(id)
    await DoctorSchedule.findByIdAndDelete(id);

    await ScheduleService.decreaseCurrentNumber(doctorSchedule.scheduleId);
}

const checkExist = async (id) => {
    let isExist = Boolean;
    console.log('hello', id)
    if (!REGEX.OBJECT_ID_REGEX.test(id)) {
        isExist = false;
        console.log('qa')
    } else {
        isExist = await DoctorSchedule.exists({ _id: id });
        console.log('qa123')
    }
    console.log(isExist)
    return {
        isExist,

    };
};

const updateStatus1 = async (id) => {
    const doctor_schedule = await DoctorSchedule.findById(id);
    if (!doctor_schedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    }
    await DoctorSchedule.updateOne({ _id: id }, { status: 1 });

    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Status updated successfully',
    };
}

const updateStatus2 = async (id) => {
    const doctor_schedule = await DoctorSchedule.findById(id);
    if (!doctor_schedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    }
    await DoctorSchedule.updateOne({ _id: id }, { status: 2 });

    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Status updated successfully',
    };
}
const updateStatus3 = async (id) => {
    const doctor_schedule = await DoctorSchedule.findById(id);
    if (!doctor_schedule) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Data is not found',
        };
    }
    await DoctorSchedule.updateOne({ _id: id }, { status: 3 });

    return {
        status: CONFIG_STATUS.SUCCESS,
        message: 'Status updated successfully',
    };
}

const cancelDoctorScheduleByPatient = async (doctorScheduleId) => {
    const doctorSchedule = await DoctorSchedule.findById(doctorScheduleId);
    if (!doctorSchedule) {
        console.log("Doctor schedule not found");
        return { status: CONFIG_STATUS.FAIL, message: "Doctor schedule not found" };
    }

    if (!doctorSchedule.scheduleId) {
        console.log("No scheduleId found in doctorSchedule");
        return { status: CONFIG_STATUS.FAIL, message: "No scheduleId found in doctorSchedule" };
    }

    // if(doctorSchedule.status !== 0){
    //     console.log("You can not cancle");
    //     return { success: false, message: "You can not cancle" };
    // }

    const schedule = await ScheduleService.findScheduleById(doctorSchedule.scheduleId);
    if (!schedule) {
        console.log("Schedule not found");
        return { status: CONFIG_STATUS.FAIL, message: "Schedule not found" };
    }
    console.log(schedule)

    const currentDate = new Date();
    const scheduleDate = new Date(schedule.date);
    const oneDayBeforeScheduleDate = new Date(scheduleDate);
    oneDayBeforeScheduleDate.setDate(scheduleDate.getDate() - 1);

    if (currentDate.toDateString() <= oneDayBeforeScheduleDate.toDateString()) {
        console.log("Cannot cancel the appointment. It should be canceled at least 1 day before the appointment date.");
        return { status: CONFIG_STATUS.FAIL, message: "Cannot cancel the appointment. It should be canceled at least 1 day before the appointment date." };
    }
    console.log('huy lich hen')
    await updateStatus3(doctorScheduleId); // Hủy lịch hẹn
    await ScheduleService.decreaseCurrentNumber(doctorSchedule.scheduleId);  // Giảm số thứ tự
    const invoice = await InvoiceService.getInvoiceByDoctorScheduleId(doctorScheduleId);
    console.log(invoice[0].status)
    if (invoice[0].status == 1) {
        console.log('hoàn tiền')
        const orderId = uuidv4();
        const refundRes = await PaymentService.refund(orderId, invoice[0].amount, invoice[0].transId, invoice[0]._id);
        console.log('ket qua hoàn tien', refundRes);
    }
    await InvoiceService.updateStatusInvoice2(invoice[0]._id);  // update

    console.log("Doctor schedule canceled successfully");
    return { status: CONFIG_STATUS.SUCCESS, message: "Doctor schedule canceled successfully" };

}

//hủy lịch tự động do chưa thanh toán
const checkAndCancelSchedule = async () => {
    const invoices = await InvoiceService.getAllUnpaidInvoices();
    console.log("Invoices: ", invoices);

    if (invoices && invoices.invoice_list && Array.isArray(invoices.invoice_list)) {
        for (const invoice of invoices.invoice_list) {
            console.log("Processing invoice: ", invoice);

            // Kiểm tra doctorScheduleId tồn tại
            if (!invoice.doctorScheduleId) {
                console.log("No doctorScheduleId found for invoice: ", invoice._id);
                continue;
            }

            const doctorSchedule = await DoctorSchedule.findById(invoice.doctorScheduleId);
            console.log("Doctor Schedule: ", doctorSchedule);

            if (doctorSchedule) { // Kiểm tra nếu doctorSchedule có dữ liệu
                if (!doctorSchedule.scheduleId) {
                    console.log("No scheduleId found for doctorSchedule: ", doctorSchedule._id);
                    continue;
                }

                const schedule = await ScheduleService.findScheduleById(doctorSchedule.scheduleId);
                console.log("Schedule: ", schedule);

                if (schedule) {
                    const dueDate = new Date(schedule.date); // Đảm bảo date là đối tượng Date
                    const invoiceCreatedAt = new Date(invoice.created_at);
                    const oneDayBeforeDueDate = new Date(dueDate);
                    oneDayBeforeDueDate.setDate(dueDate.getDate() - 1);

                    console.log("Due Date: ", dueDate);
                    console.log("Invoice Created At: ", invoiceCreatedAt);
                    console.log("One Day Before Due Date: ", oneDayBeforeDueDate);

                    if (invoiceCreatedAt < oneDayBeforeDueDate) {
                        console.log("Canceling invoice: ", invoice._id);
                        await cancelDoctorScheduleById(doctorSchedule._id);
                    }
                } else {
                    console.log("No schedule found for doctorSchedule: ", doctorSchedule._id);
                }
            } else {
                console.log("No doctorSchedule found for invoice: ", invoice._id);
            }
        }
    } else {
        console.log("No unpaid invoices found or invoice_list is not an array.");
    }
}

const cancelDoctorScheduleById = async (id) => {
    const doctorSchedule = await DoctorSchedule.findById(id);
    console.log("Lich kham", doctorSchedule)
    await updateStatus3(id); // Hủy lịch hẹn
    await ScheduleService.decreaseCurrentNumber(doctorSchedule.scheduleId);  //giảm số thứ tự
    await InvoiceService.deleteInvoiceByDoctorScheduleId(id) //xóa hóa đơn


}


cron.schedule('0 0 * * *', async () => {
    console.log('Running the scheduled job to check and cancel schedules...');
    await checkAndCancelSchedule();
});


//gửi mail

const sendReminderEmail = async (email, patientName, appointmentDate, reminderType) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'quynhanh1392002@gmail.com', 
            pass: 'nnqAnh13092002' 
        }
    });

    const mailOptions = {
        from: 'quynhanh1392002@gmail.com',
        to: email,
        subject: reminderType === 'payment' ? 'Nhắc nhở thanh toán hóa đơn khám bệnh' : 'Nhắc nhở lịch khám bệnh',
        text: reminderType === 'payment'
            ? `Xin chào ${patientName},\n\nChúng tôi nhắc bạn thanh toán hóa đơn cho lịch khám mắt vào ngày ${moment(appointmentDate).format('DD/MM/YYYY')}. Vui lòng thanh toán trước ngày khám.\n\nTrân trọng,\nPhòng khám mắt`
            : `Xin chào ${patientName},\n\nĐây là nhắc nhở của bạn về lịch khám mắt vào ngày ${moment(appointmentDate).format('DD/MM/YYYY')}. Vui lòng có mặt đúng giờ.\n\nTrân trọng,\nPhòng khám mắt`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${email}`);
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
    }
};

// Hàm kiểm tra và gửi thông báo nhắc thanh toán
const checkAndSendPaymentReminder = async () => {
    const invoices = await InvoiceService.getAllUnpaidInvoices();
    const currentDate = new Date();
    const twoDaysBefore = moment(currentDate).add(2, 'days').toDate();

    if (invoices && invoices.invoice_list && Array.isArray(invoices.invoice_list)) {
        for (const invoice of invoices.invoice_list) {
            const doctorSchedule = await DoctorSchedule.findById(invoice.doctorScheduleId);
            if (doctorSchedule && doctorSchedule.scheduleId) {
                const schedule = await ScheduleService.findScheduleById(doctorSchedule.scheduleId);
                if (schedule && schedule.date) {
                    const appointmentDate = new Date(schedule.date);

                    if (moment(appointmentDate).isSameOrBefore(twoDaysBefore, 'day')) {
                        const patient = await User.findById(doctorSchedule.patientId);
                        if (patient && patient.email) {
                            await sendReminderEmail(patient.email, patient.name, appointmentDate, 'payment');
                        }
                    }
                }
            }
        }
    }
};

// Hàm kiểm tra và gửi nhắc nhở lịch khám
const checkAndSendAppointmentReminder = async () => {
    const schedules = await DoctorSchedule.find({ status: 0 }); // Chỉ lấy lịch khám chưa hoàn thành
    const currentDate = new Date();
    const oneDayBefore = moment(currentDate).add(1, 'days').toDate();

    if (schedules && Array.isArray(schedules)) {
        for (const doctorSchedule of schedules) {
            const schedule = await Schedule.findById(doctorSchedule.scheduleId);
            if (schedule && schedule.date) {
                const appointmentDate = new Date(schedule.date);

                if (moment(appointmentDate).isSameOrBefore(oneDayBefore, 'day')) {
                    const patient = await User.findById(doctorSchedule.patientId);
                    if (patient && patient.email) {
                        await sendReminderEmail(patient.email, patient.name, appointmentDate, 'appointment');
                    }
                }
            }
        }
    }
};

// Lên lịch công việc cron để kiểm tra và gửi nhắc nhở
cron.schedule('0 9 * * *', async () => { 
    console.log('Running the scheduled job to check and send payment reminders...');
    await checkAndSendPaymentReminder();
});

cron.schedule('0 10 * * *', async () => { 
    console.log('Running the scheduled job to check and send appointment reminders...');
    await checkAndSendAppointmentReminder();
});

module.exports = {
    getAllDoctorSchedule,
    createDoctorSchedule,
    deleteDoctorSchedule,
    getDoctorDetailByPatientId,
    getAllDoctorScheduleByScheduleId,
    checkExist,
    updateStatus1,
    updateStatus2,
    updateStatus3,
    createDoctorScheduleByPhoneNumber,
    cancelDoctorScheduleByPatient
}
