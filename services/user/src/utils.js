
const Manager = require('./models/manager.model');
const Student = require('./models/student.model');

const setValue = (val, alt) => {
    return val !== undefined ? val : alt;
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

// Student
const checkStudentDuplicated = async (where) => {
    const student = await Student.findOne(where);
    return !!student;
}

const factorStudent = (data) => {
    const fields = ['_id', 'schoolId', 'studentMemberTypeId', 'name', 'surname', 'dateOfBirth', 'password', 'gsm', 'email', 'isConfirmed', 'registrationDate', 'facebook', 'instagram', 'image'];
    if (!data) return null;
    let student = {
        'confirmationKey': 0,
    };
    for (let fld of fields) { student[fld] = data[fld]; }
    return student;
}

const factorStudentArray = (dataSet) => {
    return !!dataSet && dataSet.length > 0 ? (dataSet.map(data => factorStudent(data))) : [];
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
};