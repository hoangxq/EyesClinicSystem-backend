const Doctor = require('../model/doctor');
const User = require('../model/user');
const CONFIG_STATUS = require('../config/status.json');
const { REGEX } = require('../config/regex');

const getAllDoctor = async () => {
    var doctor_list = [];
    var doctors = [];
    var total = Number;
    doctors = await Doctor.find(
        null,
        'userId hospital image created_at updated_at'
    )

    console.log(doctors)


    for (let i = 0; i < doctors.length; i++) {
        let doctor_detail = {
            _id: String,
            name: String,
            age: Number,
            hospital: String,
            image: String,
            created_at: Date,
            updated_at: Date,
        };
        console.log(doctors[i].userId)
        const user = await User.findOne({ _id: doctors[i].userId });
        console.log(user);
        doctor_detail._id = doctors[i]._id;
        doctor_detail.name = user.name;
        doctor_detail.age = user.age;
        doctor_detail.hospital = doctors[i].hospital;
        doctor_detail.image = doctors[i].image;
        doctor_detail.created_at = doctors[i].created_at;
        doctor_detail.updated_at = doctors[i].updated_at;

        doctor_list.push(doctor_detail);
    }

    return {
        doctor_list,
        meta_data: {
            length: doctor_list.length,
            total,
        },
    };
};

const getDoctorDetailByID = async (doctor_id) => {

    const doctor_info = await Doctor.findOne({ _id: doctor_id });
    console.log(doctor_info)
    const user_info = await User.findOne({ _id: doctor_info.userId })
    return {
        doctor_info: {
            name: user_info.name,
            age: user_info.age,
            gender: user_info.gender,
            hospital: doctor_info.hospital,
            degree: doctor_info.degree,
            experience: doctor_info.experience,
            achievements: doctor_info.achievements,
            image:doctor_info.image,
            // created_at: doctor_info.created_at,
            // updated_at: doctor_info.updated_at,
            __v: doctor_info.__v,
        },
    };
};

const createDoctorInfor = async (
    userId,
    hospital,
    degree,
    experience,
    achievements
) => {
    console.log(userId);
    console.log(hospital);
    const image = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    // Kiểm tra xem User có tồn tại không
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser) {
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'Create Doctor failed, the User ID is not exist. Please try again',
        };
    }

    // Tạo một bác sĩ mới
    const newDoctor = await Doctor.create({
        userId,
        hospital,
        degree,
        experience,
        achievements,
        image,
    });
    console.log(newDoctor)

    return {
        status: CONFIG_STATUS.SUCCESS,
        result: {
            doctor: newDoctor,
        },
        message: 'Doctor created successfully',
    };
}
const checkExistDoctor = async (doctor_id) => {
    let isExist = Boolean;
    if (!REGEX.OBJECT_ID_REGEX.test(doctor_id)) {
        isExist = false;
    } else {
        isExist = await Doctor.exists({ _id: doctor_id });
    }
    return {
        isExist,
    };
};

const getDoctorDetailByUserId = async (user_id) => {
    const user_info = await User.findOne({ _id: user_id })
    if(!user_info){
        return {
            status: CONFIG_STATUS.FAIL,
            message:
                'User is not found',
        };
    }else{
        // console.log(user_info)
        const doctor_info = await Doctor.findOne({userId: user_info._id});
        // console.log(doctor_info)
        return {
            doctor_info: {
                name: user_info.name,
                age: user_info.age,
                gender: user_info.gender,
                hospital: doctor_info.hospital,
                degree: doctor_info.degree,
                experience: doctor_info.experience,
                achievements: doctor_info.achievements,
                image:doctor_info.image,
                // created_at: doctor_info.created_at,
                // updated_at: doctor_info.updated_at,
                __v: doctor_info.__v,
            },
        };
    }
}

module.exports = {
    getAllDoctor,
    createDoctorInfor,
    getDoctorDetailByID,
    checkExistDoctor,
    getDoctorDetailByUserId
}