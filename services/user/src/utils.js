
const Manager = require('./models/manager.model');
const Student = require('./models/student.model');
const Teacher = require('./models/teacher.model');
const Publisher = require('./models/publisher.model');
const Friend = require('./models/friend.model');

const setValue = (val, alt) => {
    return val !== undefined ? val : alt;
}

// Friend
const checkFriendDuplicated = async where => {
    const friend = await Friend.findOne(where);
    return !!friend;
}

const factorFriend = async fd => {
    return !!fd ? { _id: fd._id, studentId: fd.studentId, teacherId: fd.teacherId, isAccepted: fd.isAccepted, isSenderAsStudent: fd.isSenderAsStudent } : null;
}

const factorFriends = async fds => {
    return !!fds && fds.length > 0 ? (fds.map(fd => factorFriend(fd))) : [];
}

// Manager

const factorManager = (data) => {
    const fields = ['_id', 'roleId', 'districtId', 'isSystemAdministrator', 'name', 'surname', 'dateOfBirth', 'password', 'gsm', 'email', 'confirmationKey', 'isConfirmed', 'registrationDate',
        'facebook', 'twitter', 'instagram', 'image'];
    if (!data) { return null; }
    let manager = {};
    for (let fld of fields) {
        manager[fld] = setValue(data[fld], "");
    }
    manager['fullname'] = `${!!data['name'] ? data['name'] : ''}${!!data['surname'] ? ' ' + data['surname'] : ''}`;
    manager['password'] = '_SECRET_';
    return manager;
}

const factorManagers = (items) => {
    if (!items) return [];
    let managers = [];
    for (let item of items) {
        managers.push(factorManager(item));
    }
    return managers;
}

const manageEmailDuplicated = async (email) => {
    const manager = await Manager.findOne({ email: email });
    return !!manager;
}

// Publisher
const checkPublisherDuplicated = async (where) => {
    const publisher = await Publisher.findOne(where);
    return !!publisher;
}

const factorPublisher = async (pb) => {
    return !!pb ? { _id: pb._id, name: pb.name, email: pb.email, phone: pb.phone, address: pb.address } : null;
}

const factorPublishers = async (pbs) => {
    return !!pbs && pbs.length > 0 ? pbs.map(pb => factorPublisher(pb)) : [];
}

// Student
const checkStudentDuplicated = async (where) => {
    const student = await Student.findOne(where);
    return !!student;
}

const factorStudent = (data) => {
    const fields = ['_id', 'schoolId', 'studentMemberTypeId', 'name', 'surname', 'dateOfBirth', 'password', 'gsm', 'email', 'isConfirmed', 'registrationDate', 'facebook', 'instagram', 'twitter', 'image'];
    if (!data) return null;
    let student = {
        'confirmationKey': 0,
    };
    for (let fld of fields) { student[fld] = data[fld]; }
    student['fullname'] = `${!!data['name'] ? data['name'] : ''}${!!data['surname'] ? ' ' + data['surname'] : ''}`;
    student['password'] = '_SECRET_';
    return student;
}

const factorStudentArray = (dataSet) => {
    return !!dataSet && dataSet.length > 0 ? (dataSet.map(data => factorStudent(data))) : [];
}

// Teacher
const checkTeacherDuplicated = async (where) => {
    const teacher = await Teacher.findOne(where);
    return !!teacher;
}

const factorTeacher = data => {
    const fields = ['_id', 'schoolId', 'roleId', 'name', 'surname', 'dateOfBirth', 'password', 'gsm', 'email', 'isConfirmed', 'registrationDate', 'facebook', 'instagram', 'twitter', 'image'];
    if (!data) return null;
    let teacher = {
        'confirmationKey': 0,
    };

    for (let fld of fields) { teacher[fld] = data[fld]; }
    teacher['fullname'] = `${!!data['name'] ? data['name'] : ''}${!!data['surname'] ? ' ' + data['surname'] : ''}`;
    teacher['password'] = '_SECRET_';
    return teacher; 
}

const factorTeachers = teachers => {
    return !!teachers && teachers.length > 0 ? (teachers.map(teacher => factorTeacher(teacher))) : [];
}


module.exports = {
    manager: {
        factor: {
            unit: factorManager,
            array: factorManagers,
        },
        checkDuplicate: manageEmailDuplicated,
    },
    student: {
        factor: {
            unit: factorStudent,
            array: factorStudentArray,
        },
        checkDuplicate: checkStudentDuplicated
    },
    teacher: {
        factor: {
            unit: factorTeacher,
            array: factorTeachers,
        },
        checkDuplicate: checkTeacherDuplicated,
    },
    publisher: {
        checkDuplicate: checkPublisherDuplicated,
        factor: {
            unit: factorPublisher,
            array: factorPublishers,
        }
    },
    friend: {
        checkDuplicate: checkFriendDuplicated,
        factor: {
            unit: factorFriend,
            array: factorFriends,
        }
    },
};