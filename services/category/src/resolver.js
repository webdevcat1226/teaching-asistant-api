const mongoose = require('mongoose');
const {
  UserInputError
} = require('apollo-server');

const Category = require('./models/category.model');
const City = require("./models/city.model");
const District = require('./models/district.model');
const Role = require('./models/role.model');
const RoleAuthority = require('./models/roleAuthority.model');
const School = require('./models/school.model');
const StudentMemberType = require('./models/studentMemberType.model');


// const { checkToken } = require('./libs/middleware');
const Utils = require("./utils");

module.exports = {
  Query: {
    // -----   C A T E G O R Y   -----
    category: async (_, args, { token }) => {
      const category = await Category.findOne({_id: args._id});
      return Utils.factorCategory.unit(category);
    },
    categories: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.categoryTitle) { where.categoryTitle = new RegExp(args.title, 'i'); }

      let cates = await Category.find(where).skip(offset).limit(limit);
      return Utils.factorCategory.array(cates);
    },

    // -----   C I T Y   -----
    cities: async (_, args, { token }) => {
      // Utils.checkToken(token); //console.log(decoded);
      let where = {};
      let cities = [];
      const offset = args.offset !== undefined ? args.offset : 0;
      if (args.limit !== undefined) {
        cities = await City.find(where).skip(offset).limit(args.limit);
      } else {
        cities = await City.find(where);
      }
      return cities;
    },
    city: async (_, args, { token }) => {
      if (args._id === undefined && args.code === undefined) {
        throw new UserInputError('Either of _id or code is required', {
          invalidArgs: ['_id', 'code']
        });
      }
      let where = {};
      if (args._id !== undefined) {
        where._id = args._id;
      }
      if (args.code !== undefined) {
        where.code = args.code;
      }
      const city = await City.findOne(where);
      return city;
    },

    // -----   D I S T R I C T   -----
    districts: async (_, args, { token }) => {
      let where = {};
      let districts = [];
      const offset = args.offset !== undefined ? args.offset : 0;
      if (args.limit !== undefined) {
        districts = await District.find(where).skip(offset).limit(args.limit);
      } else {
        districts = await District.find(where);
      }
      return Utils.factorDistrict.array(districts);
    },
    district: async(_, args, { token }) => {
      const district = await District.findOne({_id: args._id});
      return Utils.factorDistrict.unit(district);
    },

    // -----   R O L E   -----
    roles: async (_, args, { token }) => {
      let where = {};
      let roles = [];
      const offset = args.offset !== undefined ? args.offset : 0;
      if (!!args.limit) {
        roles = await Role.find(where).skip(offset).limit(args.limit);
      } else {
        roles = await Role.find(where);
      }
      return Utils.factorRole.array(roles);
    }, 
    role: async (_, args, { token }) => {
      const role = await Role.findOne({ _id: args._id });
      return Utils.factorRole.unit(role);
    },

    // -----     R O L E    A U T H O R I T Y     -----
    roleAuthority: async (_, args, { token }) => {
      const roleAuthority = await RoleAuthority.findOne({ _id: args._id });
      return Utils.factorRoleAuthority.unit(roleAuthority);
    },
    roleAuthorities: async (_, args, { token }) => {
      let where = {};
      if (!!args.roleId) { where.roleId = args.roleId; }
      if (!!args.module) { where.module = args.module; }
      if (!!args.roleConstant) { where.roleConstant = args.roleConstant; }
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;

      const roleAuthorities = await RoleAuthority.find(where).skip(offset).limit(limit);
      return Utils.factorRoleAuthority.array(roleAuthorities);
    },

    // -----     S C H O O L     -----
    school: async (_, args, { token }) => {
      const school = await School.findOne({_id: args._id});
      return Utils.factorSchool.unit(school);
    },
    schools: async(_, args, { token }) => {
      let where = {};
      if (!!args.districtId) { where.districtId = args.districtId; }
      if (!!args.name) { where.name = new RegExp(args.name, 'i'); }
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      const schools = await School.find(where).skip(offset).limit(limit); console.log('school', schools);
      return Utils.factorSchool.array(schools);
    },

    // -----     STUDENT MEMBER TYPE     -----
    studentMemberType: async (_, args, { token }) => {
      const smt = await StudentMemberType.findOne({_id: args._id});
      return Utils.factorSMT.unit(smt);
    },
    studentMemberTypes: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      const smts = await StudentMemberType.find().skip(offset).limit(limit);
      return Utils.factorSMT.array(smts);
    },
  },


  Mutation: {
    // -----   C I T Y   -----
    addCategory: async (_, args, { token }) => {
      const duplicated = await Category.findOne({categoryTitle: args.categoryTitle});
      if (!!duplicated) { return {status: 'Error', message: 'Title already exists', content: {}}; }

      let category = { _id: new mongoose.mongo.ObjectId(), categoryTitle: args.categoryTitle };
      const created = await Category.create(category);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.factorCategory.unit(created)}; }
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateCategory: async (_, args, { token }) => {
      let updateData = await Category.findOne({_id: args._id});
      if (!updateData) { return {status: "Error", message: 'Data not found', content: {}}; }

      let exists = await Category.findOne({categoryTitle: args.categoryTitle});
      if (exists && updateData._id.equals(exists._id)) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.factorCategory.unit(exists)} }
      if (exists && !updateData._id.equals(exists._id)) { return {status: 'Error', message: 'Data duplicated', content: {}}; }

      const updated = await Category.findOneAndUpdate({_id: args._id}, {categoryTitle: args.categoryTitle}, {returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data updated successfully', content: Utils.factorCategory.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data', content: {}}; }
    },
    deleteCategory: async (_, args, { token }) => {
      try {
        const deleted = await Category.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted};
      }
      catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },

    // -----   C I T Y   -----
    addCity: async (_, args, { token }) => {
      // check duplication
      const whereDup = {
        cityName: args.cityName,
      };
      const duplicated = await City.findOne(whereDup);
      if (!!duplicated) {
        return {
          status: "Error",
          message: "City name already exists!",
          content: {
            type: "DUPLICATED"
          }
        };
      }

      lastCity = await City.findOne({}).sort({ code: -1 });
      let city = {
        _id: new mongoose.mongo.ObjectId(),
        code: !lastCity ? 1 : lastCity.code + 1,
        cityName: args.cityName,
      };

      const created = await City.create(city);
      if (!created) {
        return {
          status: 'Error',
          message: "Failed to add city...",
          content: {}
        };
      } else {
        return {
          status: 'Success',
          message: "You added a new city successfully",
          content: {
            city: Utils.factorCity(created)
          }
        };
      }
    },
    updateCity: async (_, args, { token }) => {
      if (args._id !== undefined && args.code === undefined) {
        throw new UserInputError('Either of _id or code is required', {
          invalidArgs: ['_id', 'code']
        });
      }

      let where = {};
      if (args._id !== undefined) {
        where._id = args._id;
      }
      if (args.code !== undefined) {
        where.code = args.code;
      } console.log(where);
      const updated = await City.findOneAndUpdate(where, { cityName: args.cityName }, { returnOriginal: false });
      if (!!updated) {
        return {
          status: 'Success',
          message: 'Data has been updated successfully',
          content: { city: Utils.factorCity(updated) },
        };
      } else {
        return {
          status: 'Error',
          message: 'Failed to udpate data...',
          content: { city: Utils.factorCity(updated) },
        };
      }
    },
    deleteCity: async (_, args, { token }) => {
      try {
        const deleted = await City.deleteOne({ _id: args._id });
        return { status: 'Succcess', message: 'Data has been deleted successfully', content: deleted };
      } catch (e) {
        return { status: 'Error', message: 'Failed to delete data...', content: e.message }
      }
    },

    // -----   D I S T R I C T   -----
    addDistrict: async (_, args, { token }) => {
      const duplicated = await Utils.checkDuplicate.district(args.cityId, args.districtName);
      if (duplicated === true) {
        return { status: 'Error', message: 'District already exists!', content: {} };
      }

      let district = { _id: new mongoose.mongo.ObjectId(), cityId: args.cityId, districtName: args.districtName };

      const created = await District.create(district);
      if (!created) {
        return { status: 'Error', message: 'Failed to add a district...', content: {} };
      } else {
        return { status: 'Success', message: 'Data had been added successfully', content: Utils.factorDistrict.unit(created) };
      }
    },
    updateDistrict: async (_, args, { token }) => {
      Utils.checkOptionalRequired(args, ['cityId', 'districtName']);
      let updateData = {};
      if (args.cityId !== undefined) { updateData.cityId = args.cityId; }
      if (args.districtName !== undefined) { updateData.districtName = args.districtName; }

      const updated = await District.findOneAndUpdate({ _id: args._id }, updateData, { returnOriginal: false });
      if (!!updated) {
        return { status: 'Success', message: 'Data has been updated successfully', content: { district: Utils.factorDistrict.unit(updated) } };
      } else {
        return { status: 'Error', message: 'Failed to update data...', content: {} };
      }
    },
    deleteDistrict: async(_, args, { token }) => {
      try {
        const deleted = await District.deleteOne({  _id: args._id });
        return { status: 'Success', message: 'Data has been deleted successfully', content: deleted };
      } catch (e) {
        return { status: 'Error', message: 'Failed to delete data...', content: e.message };
      }
    },

    // -----   R O L E   -----
    addRole: async (_, args, { token }) => {
      const duplicated = await Utils.checkDuplicate.role({ title: args.title });
      if (duplicated === true) {
        return { status: 'Error', message: 'Role already exists!', content: {} }
      }

      let role = { _id: new mongoose.mongo.ObjectId(), title: args.title, description: args.description };

      const created = await Role.create(role);
      if (!created) {
        return { status: 'Error', message: 'Failed to add a role...', content: {} };
      } else {
        return { status: 'Success', message: 'Data had been added successfully', content: Utils.factorRole.unit(created) };
      }
    },
    updateRole: async (_, args, { token }) => {
      Utils.checkOptionalRequired(args, ['title', 'description']);
      let updateData = {};
      if (args.title !== undefined) { updateData.title = args.title; }
      if (args.description !== undefined) { updateData.description = args.description; }

      const updated = await Role.findOneAndUpdate({ _id: args._id }, updateData, { returnOriginal: false });
      if (!!updated) {
        return { status: 'Success', message: 'Data had been updated successfully', content: Utils.factorRole.unit(updated) };
      } else {
        return { status: 'Error', message: 'Failed to update data...', content: {} };
      }
    },
    deleteRole: async (_, args, { token }) => {
      try {
        const deleted = Role.deleteOne({ _id: args._id });
        return { status: 'Success', message: 'Data has been deleted successfully', content: deleted };
      } catch (e) {
        return { status: 'Error', message: 'Failed to delete data...', content: e.message };
      }
    },

    // -----     R O L E    A U T H O R I T Y     -----
    addRoleAuthority: async (_, args, { token }) => {
      const duplicated = await Utils.checkDuplicate.roleAuthority({ roleId: args.roleId, module: args.module, roleConstant: args.roleConstant });
      if (duplicated === true) { return { status: 'Error', message: 'Role authority already defined!', content: {} }; }

      let roleAuthority = { _id: mongoose.mongo.ObjectId(), roleId: args.roleId, module: args.module,  roleConstant: args.roleConstant };
      const created = await RoleAuthority.create(roleAuthority);
      if (!created) { return { status: 'Error', message: 'Failed to add data', content: {} }; }
      else { return { status: 'Success', message: "Data had been added successfully", content: Utils.factorRoleAuthority.unit(created) }; }
    },
    updateRoleAuthority: async (_, args, { token }) => {
      Utils.checkOptionalRequired(args, ['roleId', 'module', 'roleConstant']);
      const roleAuthority = await RoleAuthority.findOne({_id: args._id});
      if (!roleAuthority) { return { status: 'Error', message: 'Not found data', content: {} }; }

      let updateData = { roleId: roleAuthority.roleId, module: roleAuthority.module, roleConstant: roleAuthority.roleConstant };
      let update_count = 0;
      if (!!args.roleId && args.roleId != updateData.roleId) { updateData.roleId = args.roleId; update_count ++; }
      if (!!args.module && args.module != updateData.module) { updateData.module = args.module; update_count ++; }
      if (!!args.roleConstant && args.roleConstant != updateData.roleConstant) { updateData.roleConstant = args.roleConstant; update_count++; }

      if (update_count === 0) { return { status: 'Status', message: 'Data has been updated successfully', content: Utils.factorRoleAuthority.unit(roleAuthority) }; }

      const updateExist = await RoleAuthority.findOne(updateData);
      if (!!updateExist) { return {status: 'Error', message: 'Same info already exists.', content: {}}; }

      const updated = await RoleAuthority.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) { return { status: 'Success', message: 'Data has been updated successfully', content: Utils.factorRoleAuthority.unit(updated) }; }
      else { return { status: 'Error', message: 'Failed to update data...', content: {} }; }
    },
    deleteRoleAuthority: async (_, args, { token }) => {
      try {
        const deleted = await RoleAuthority.deleteOne({_id: args._id});
        return { status: 'Success', message: 'Data has been deleted successfully', content: deleted };
      } catch (e) {
        return { status: 'Error', message: 'Failed to delete data...', content: e.message };
      }
    },

    // -----     S C H O O L     -----
    addSchool: async (_, args, { token }) => {
      const duplicated = await Utils.checkDuplicate.school({ districtId: args.districtId, name: args.name });
      if (!!duplicated) { return {status: 'Error', message: 'School already exists!', content: {}}; }

      let school = { _id: new mongoose.mongo.ObjectId(), districtId: args.districtId, name: args.name };
      const created = await School.create(school);
      if (!created) { return {status: 'Error', message: 'Failed to add data', content: {}}; }
      else { return {status: 'Success', message: 'Data has been added successfully', content: Utils.factorSchool.unit(created) }; }
    },
    updateSchool: async (_, args, { token }) => {
      Utils.checkOptionalRequired(args, ['districtId', 'name']);
      const school = await School.findOne({ _id: args._id });
      if (!school) { return {status: 'Error', message: 'Not found data', content: {}}; }

      let updateData = { districtId: school.districtId, name: school.name };
      let update_count = 0;
      if (!!args.districtId && args.districtId != updateData.districtId) { update.districtId = args.districtId; update_count++; }
      if (!!args.name && args.name != updateData.name) { updateData.name = args.name; update_count++; }

      if (update_count === 0) { return {status: 'Success', message: 'Data has been created successfully', content: Utils.factorSchool.unit(school)}; }

      const updateExists = await School.findOne(updateData);
      if (!!updateExists) { return { status: 'Error', message: 'Same info already exists', content: {}}; }

      const updated = await School.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.factorSchool.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }
    },
    deleteSchool: async (_, args, { token }) => {
      try {
        const deleted = await School.deleteOne({_id: args._id});
        return { success: 'Success', message: 'Data has been deleted successfully', content: deleted };
      } catch (e) {
        return { status: 'Error', message: 'Failed to delete data...', content: e.message };
      }
    },

    // -----     STUDENT MEMBER TYPE     -----
    addStudentMemberType: async (_, args, { token }) => {
      const duplicated = await Utils.checkDuplicate.smt({ typeTitle: args.typeTitle });
      if (!!duplicated) { return {status: 'Error', message: 'Student member type already exists', content: {}}; }

      let smt = { _id: new mongoose.mongo.ObjectId(), typeTitle: args.typeTitle, descriptions: args.descriptions || "", piece: args.piece || 0 };
      const created = await StudentMemberType.create(smt);
      if (!created) { return {status: 'Error', message: 'Failed to add data', content: {}}; }
      else { return {status: 'Success', message: 'Data had been added successfully', content: Utils.factorSMT.unit(created)}; }
    },
    updateStudentMemberType: async (_, args, { token }) => {
      Utils.checkOptionalRequired(args, ['typeTitle', 'descriptions', 'piece']);
      const smt = await StudentMemberType.findOne({_id: args._id});
      if (!smt) { return {status: 'Error', message: "Not found data", content: {}}; }

      let updateData = { typeTitle: smt.typeTitle, descriptions: smt.descriptions, piece: smt.piece };
      let update_count = 0;
      if (!!args.typeTitle && args.typeTitle != updateData.typeTitle) { updateData.typeTitle = args.typeTitle; update_count ++; }
      if (!!args.descriptions && args.descriptions != updateData.descriptions) { updateData.descriptions = args.descriptions; update_count ++; }
      if (!!args.piece && args.piece !== updateData.piece) { updateData.piece = args.piece; update_count ++; }

      const updateExists = await StudentMemberType.findOne({typeTitle: args.typeTitle});
      if (!!updateExists) { return {status: 'Error', message: 'Same info already exists.', content: {}}; }

      const updated = await StudentMemberType.findOneAndUpdate({ _id: args._id }, updateData, { returnOriginal: false });
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.factorSMT.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }

    },
    deleteStudentMemberType: async (_, args, { token }) => {
      try {
        const deleted = await StudentMemberType.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data had been deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content: e.message};
      }
    },


  }
};
