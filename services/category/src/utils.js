
const { UserInputError } = require('apollo-server');

const District = require('./models/district.model');
const Role = require('./models/role.model');

const checkOptionalRequired = (data, members) => {
    for (let fld of members) {
        if (data[fld] !== undefined) return true;
    }
    throw new UserInputError(`Either of ${members.join(', ')} is required`, {
        invalidArgs: members
    });
}

const factorCity = data => {
    return data._id !== undefined ? { _id: data._id, code: data.code, cityName: data.cityName } : null;
}

const factorCityArray = data => {
    return data.length && data.length > 0 ? data.map((city, i) => ({ _id: city._id, code: city.code, cityName: city.cityName })) : null;
}

const factorDistrict = data => {
    return data._id !== undefined ? { _id: data._id, cityId: data.cityId, districtName: data.districtName } : null;
}

const factorDistrictArray = data => {
    return data.length > 0 ? data.map(district => ({ _id: district._id, cityId: district.cityId, districtName: district.districtName })) : [];
}

const checkDistrictDuplicated = async ({ cityId, districtName }) => {
    const where = { cityId: cityId, districtName: districtName };
    const district = await District.findOne(where);
    return !!district ? true : false;
}

/**
 *   ---   R O L E   ---
 * */ 

const factorRole = data => {
    return !!data ? { _id: data.id, title: data.title, description: data.description } : null;
}

const factorRoleArray = roles => {
    return roles.length > 0 ? (roles.map(role => ({ _id: role._id, title: role.title, description: role.description}))) : [];
}

const checkRoleDuplicated = async ({ title }) => {
    const where = { title: title };
    const role = await Role.findOne(where);
    return !!role ? true : false;
}


module.exports = {
    checkDuplicate: {
        district: checkDistrictDuplicated,
        role: checkRoleDuplicated,
    },
    checkOptionalRequired: checkOptionalRequired,
    factorCity: factorCity,
    factorCityArray: factorCityArray,
    factorDistrict: {
        array: factorDistrictArray,
        unit: factorDistrict
    },
    factorRole: {
        array: factorRoleArray,
        unit: factorRole,
    }
}