
const Manager = require('./models/manager.model');


const setValue = (val, alt) => {
    return val !== undefined ? val : alt;
}

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

module.exports = {
    manager: {
        factor: {
            unit: factorManager,
            array: factorManagers,
        },
        checkDuplicate: manageEmailDuplicated,
    }
};