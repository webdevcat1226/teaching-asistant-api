
const { UserInputError } = require('apollo-server');

const District = require('./models/district.model');
const Role = require('./models/role.model');
const RoleAuthority = require('./models/roleAuthority.model');
const School = require('./models/school.model');
const StudentMemberType = require('./models/studentMemberType.model');


const checkOptionalRequired = (data, members) => {
    for (let fld of members) {
        if (data[fld] !== undefined) return true;
    }
    throw new UserInputError(`Either of ${members.join(', ')} is required`, {
        invalidArgs: members
    });
}


/**
 *   ---   C A T E G O R Y   ---
 * */ 

 const factorCategory = cate => {
     return !!cate ? { _id: cate._id, categoryTitle: cate.categoryTitle } : null;
 }

 const factorCategories = cates => {
     return !!cates && cates.length > 0 ? (cates.map(cate => factorCategory(cate))) : [];
 }

const checkCategoryDuplicate = async where => {
    const category = await Category.findOne(where);
    return !!category;
}


const factorCity = data => {
    return data._id !== undefined ? { _id: data._id, code: data.code, cityName: data.cityName } : null;
}

const factorCityArray = data => {
    return data.length && data.length > 0 ? data.map((city, i) => ({ _id: city._id, code: city.code, cityName: city.cityName })) : null;
}

const factorDistrict = data => {
    return data !== undefined ? { _id: data._id, cityId: data.cityId, districtName: data.districtName } : null;
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
    // return !!data ? { _id: data.id, title: data.title, description: data.description } : null;
    return !!data ? data : null;
}

const factorRoleArray = roles => {
    return roles.length > 0 ? (roles.map(role => ({ _id: role._id, title: role.title, description: role.description}))) : [];
}

const checkRoleDuplicated = async ({ title }) => {
    const where = { title: title };
    const role = await Role.findOne(where);
    return !!role ? true : false;
}

/**
 *   ---   R O L E    A U T H O R I T Y  ---
 * */ 

const factorRoleAuthority = ra => {
    return !!ra ? { _id: ra._id, roleId: ra.roleId, module: ra.module, roleConstant: ra.roleConstant } : null;
}

const factorRoleAuthorityArray = ras => {
    return !!ras && ras.length > 0 ? ( ras.map(ra => factorRoleAuthority(ra)) ) : [];
}

const checkRoleAuthorityDuplicated = async (where) => {
    const roleAuthority = await RoleAuthority.findOne(where);
    return !!roleAuthority;
}

/**
 *   ---   S C H O O L  ---
 * */ 

const checkSchoolDuplicated = async (where) => {
    const duplicated = await School.findOne(where);
    return !!duplicated;
}

const factorSchool = school => {
    return !!school ? { _id: school._id, districtId: school.districtId, name: school.name } : null;
}

const factorSchoolArray = schools => {
    return schools && schools.length > 0 ? (schools.map(school => factorSchool(school))) : [];
}


/**
 *   ---   STUDENT MEMBER TYPE  ---
 * */ 
const checkStudentMemberTypeDuplicated = async (where) => {
    const smt = await StudentMemberType.findOne(where);
    return !!smt;
}

const factorSMT = smt => {
    return !!smt ? { _id: smt._id, typeTitle: smt.typeTitle, descriptions: smt.descriptions, piece: smt.piece } : null;
}

const factorSMTArray = smts => {
    return !!smts && smts.length > 0 ? (smts.map(smt => factorSMT(smt))) : [];
}



module.exports = {
    checkDuplicate: {
        category: checkCategoryDuplicate,
        district: checkDistrictDuplicated,
        role: checkRoleDuplicated,
        roleAuthority: checkRoleAuthorityDuplicated,
        school: checkSchoolDuplicated,
        smt: checkStudentMemberTypeDuplicated,
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
    },
    factorRoleAuthority: {
        unit: factorRoleAuthority,
        array: factorRoleAuthorityArray,
    },
    factorSchool: {
        unit: factorSchool,
        array: factorSchoolArray,
    },
    factorSMT: {
        unit: factorSMT,
        array: factorSMTArray,
    },
    factorCategory: {
        unit: factorCategory,
        array: factorCategories,
    }
}