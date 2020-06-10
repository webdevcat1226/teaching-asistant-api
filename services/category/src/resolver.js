const mongoose = require('mongoose');
const {
  UserInputError
} = require('apollo-server');
const City = require("./models/city.model");
// const { checkToken } = require('./libs/middleware');
const Utils = require("./utils");

module.exports = {
  Query: {
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
    }
  },

  Mutation: {
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
    }
  }
};
