const mongoose = require('mongoose');
const {
  UserInputError
} = require('apollo-server');

const City = require("./models/city.model");
const District = require('./models/district.model');
const Role = require('./models/role.model');

// const { checkToken } = require('./libs/middleware');
const Utils = require("./utils");

module.exports = {
  Query: {
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
    }
  },



  Mutation: {
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

  }
};
