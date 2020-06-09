const mongoose = require('mongoose');
const City = require("./models/city.model");
// const { checkToken } = require('./libs/middleware');
const Utils = require("./utils");


module.exports = {
  Query: {
    cities: async (_, __, { token }) => {
      // Utils.checkToken(token); //console.log(decoded);
      let where = {};
      const arr = await City.find(where); // console.log(projects);
      return arr;
    },
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

      lastCity = await City.findOne({}).sort({code: 1});

      let city = {
        _id: new mongoose.mongo.ObjectId(),
        code: !lastCity ? 1 : lastCity.code + 1,
        cityName: args.cityName,
      };

      const created = await City.create(city);
      console.log(created)
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
            city: {
              _id: created.id,
              code: created.code,
              cityName: created.cityName,
            }
          }
        };
      }
    },
  }
};
