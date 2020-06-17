const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const Exam = require("./models/exam.model");

const Utils = require("./utils");

module.exports = {
  Query: {
    // -----   E X A M   -----
    exams: async (_, args, { token }) => {
      // Utils.checkToken(token); //console.log(decoded);
      const offset = args.offset !== undefined ? args.offset : 0;
      const limit = args.limit !== undefined ? args.limit : 0;

      let where = {};
      if (!!args.title) { where.title = new RegExp(args.title, 'i'); }
      
      const exams = await Exam.find(where).skip(offset).limit(limit);
      return Utils.exam.factor.array(exams);
    },
    exam: async (_, args, { token }) => {
      const exam = await Exam.findOne({ _id: args._id });
      return Utils.exam.factor.unit(exam);
    },
  },

  
  Mutation: {
    // -----   E X A M   -----
    addExam: async (_, args, { token }) => {
      // const duplicated = await Utils.exam.checkDuplicate({ title });
      // if (!!duplicated) {
      //   return { status: 'Error', message: 'Email alread exists', content: {} };
      // }

      const exam = {
        _id: new mongoose.mongo.ObjectId(),
        title: args.title,
        date: args.date,
      };
      
      const created = await Exam.create(exam);
      if (!!created) {
        return { status: 'Success', message: 'Data has been added successfully', content: Utils.exam.factor.unit(created) }; //Utils.manager.factor.unit(created)
      } else {
        return { status: 'Error', message: 'Failed to add data...', content: {} };
      }
    },
    updateExam: async (_, args, { token }) => {
      const fields = ['title', 'date'];
      let updateData = await Exam.findOne({_id: args._id});

      if (!updateData) { return {status: 'Error', message: 'Data not found', content: {}}; }

      for (let fld of fields) {
        updateData[fld] = args[fld];
      }
      const updated = await Exam.findOneAndUpdate({ _id: args._id }, updateData, { returnOriginal: false });
      if (!!updated) {
        return { status: 'Success', message: 'Data has been updated successfully', content: Utils.exam.factor.unit(updated) };
      } else {
        return { status: 'Error', message: 'Failed to update data...', content: {} };
      }
    },
    deleteExam: async (_, args, { token }) => {
      const deleted = Exam.deleteOne({ _id: args._id });
      if (!!deleted) {
        if (deleted.deletedCount > 0) {
          return { status: 'Success', message: 'Data has been deleted successfully', content: deleted };
        } else {
          return { status: 'Error', message: 'Not found data to delete', content: {} };
        }
      } else {
        return { status: 'Error', message: 'Failed to delete data...', content: {} };
      }
    },
  }
};
