const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Manager = require("./models/manager.model");
const Student = require('./models/student.model');
const Utils = require("./utils");

module.exports = {
  Query: {
    // -----   M A N A G E R   -----
    managers: async (_, args, { token }) => {
      // Utils.checkToken(token); //console.log(decoded);
      let where = {};
      if (args.roleId !== undefined) { where.roleId = args.roleId; }
      if (args.districtId !== undefined) { where.districtId = args.districtId; }
      if (args.isConfirmed !== undefined) { where.isConfirmed = args.isConfirmed; }

      const offset = args.offset !== undefined ? args.offset : 0;
      const limit = args.limit !== undefined ? args.limit : 0;
      let managers = [];
      managers = await Manager.find(where).skip(offset).limit(limit);
      return Utils.manager.factor.array(managers);
    },
    manager: async (_, args, { token }) => {
      const manager = await Manager.findOne({ _id: args._id });
      return Utils.manager.factor.unit(manager);
    },

    // -----   S T U D E N T   -----
    student: async (_, args, { token }) => {
      const student = await Student.findOne({_id: args._id});
      return Utils.student.factor.unit(student);
    },
    students: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      //schoolId: String, studentMemberTypeId: String, isConfirmed: Boolean
      let where = {};
      if (!!args.schoolId) { where.schoolId = args.schoolId; }
      if (!!args.studentMemberTypeId) { where.studentMemberTypeId = args.studentMemberTypeId; }
      if (!!args.isConfirmed) { where.isConfirmed = args.isConfirmed; }
      let students = await Student.find(where).skip(offset).limit(limit);
      return Utils.student.factor.array(students);
    },

  },

  Mutation: {
    // -----   M A N A G E R   -----
    addManager: async (_, args, { token }) => {
      // roleId: String!, districtId: String!, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: Date!, password: String!, email: String!,
      // gsm: String, email: String!, facebook: String, twitter: String, instagram: String, image: String
      const duplicated = await Utils.manager.checkDuplicate(args.email);
      if (!!duplicated) {
        return { status: 'Error', message: 'Email alread exists', content: {} };
      }

      const manager = {
        _id: new mongoose.mongo.ObjectId(), roleId: args.roleId, districtId: args.districtId, name: args.name, surname: args.surname, dateOfBirth: args.dateOfBirth, email: args.email,
        gsm: args.gsm || "", facebook: args.facebook || "", twitter: args.twitter || "", instagram: args.instagram || "", image: args.image || "", isSystemAdministrator: args.isSystemAdministrator || false,
      };
      manager.registrationDate = new Date().toISOString();
      manager.isConfirmed = false;
      manager.confirmationKey = Math.floor(Math.random() * 900000 + 100000); // 6 digits
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      manager.password = await bcrypt.hash(args.password, salt);

      const created = await Manager.create(manager);
      if (!!created) {
        return { status: 'Success', message: 'Data has been added successfully', content: Utils.manager.factor.unit(created) }; //Utils.manager.factor.unit(created)
      } else {
        return { status: 'Error', message: 'Failed to add data...', content: {} };
      }
    },
    updateManager: async (_, args, { token }) => {
      const fields = ['roleId', 'districtId', 'isSystemAdministrator', 'name', 'surname', 'dateOfBirth', 'facebook', 'twitter', 'instagram', 'image'];
      let updateData = {};
      for (let fld of fields) {
        updateData[fld] = args[fld];
      }
      const updated = await Manager.findOneAndUpdate({ _id: args._id }, updateData, { returnOriginal: false });
      if (!!updated) {
        return { status: 'Success', message: 'Data has been updated successfully', content: Utils.manager.factor.unit(updated) };
      } else {
        return { status: 'Error', message: 'Failed to update data...', content: {} };
      }
    },
    deleteManager: async (_, args, { token }) => {
      const deleted = Manager.deleteOne({ _id: args._id });
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
    confirmManager: async (_, args, { token }) => {
      const manager = await Manager.findOne({ _id: args._id });
      if (!manager) { return { status: 'Error', message: "Manager not found!", content: {} }; }

      if (manager.isConfirmed === true) {
        return { status: 'Success', message: 'Manager already verified', content: Utils.manager.factor.unit(manager) };
      } else if (manager.confirmationKey != args.confirmationKey) {
        return { status: 'Error', message: 'Confirmation key does not match!', content: {} };
      } else {
        // confirm manager and remove confirmation Key
        const updated = await Manager.findOneAndUpdate({_id: args._id}, { isConfirmed: true, confirmationKey: 0 }, {returnOriginal: false});
        if (!!updated) {
          return { status: 'Success', message: 'Manager has been confirmed successfully', content: Utils.manager.factor.unit(updated) };
        } else {
          return { status: 'Error', message: 'Failed to confirm manager', content: {} };
        }
      }
    },

    // -----   A U T H   -----
    getToken: async (_, args, { token }) => {
      let user;
      if (args.clientType == 'Manager') {
          user = await Manager.findOne({ email: args.email });
      }

      if (!user) { return { status: 'Error', message: 'Not found user with given email.', content: {} }; }

      const passwordMatch = await bcrypt.compare(args.password, user.password);
      if (passwordMatch === true) {
        const secret = process.env.PORT_USER;
        const expiration = Math.floor(Date.now() / 1000) - 3600 * 24;
        const jwtoken = jwt.sign({
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: expiration,
          data: {
            _id: user._id,
            email: user.email,
            name: user.name 
          }
        }, secret); 
        return { status: 'Success', message: 'Success', content: {
            user: { id: user._id},
            type: args.type,
            token: jwtoken,
            expiration: expiration,
          }
        };
      } else {
        return { status: 'Error', message: 'Password does not match!', content: {} };
      }
    },
    verifyToken: async (_, args, { token }) => {
      const secret = process.env.PORT_USER;
      try {
        let decoded = jwt.verify(args.token, secret);
        return { status: 'Success', message: 'Test', content: decoded };
      } catch (e) {
        console.log(e.name);
        return { status: 'Error', message: 'Token error', content: {type: e.name} };
      }
    },

    // -----   S T U D E N T   -----
    addStudent: async (_, args, { token }) => {
      const emailDup = await Utils.student.checkDuplicate({email: args.email});
      if (!!emailDup) { return {status: 'Error', message: 'Email already exists!', content: {}}; }
      const phoneDup = await Utils.student.checkDuplicate({gsm: args.gsm});
      if (!!phoneDup) { return {status: 'Error', message: 'Phone number already exists!', content: {}}; }

      let student = {_id: new mongoose.mongo.ObjectId(), email: args.email, gsm: args.gsm, name: args.name, surname: args.surname, dateOfBirth: args.dateOfBirth, registrationDate: new Date().toISOString(), isConfirmed: false,
        schoolId: args.schoolId || '', studentMemberTypeId: args.studentMemberTypeId || "", facebook: args.facebook || "", instagram: args.instagram || "", image: args.image || ""};
      student.confirmatinKey = Math.floor(Math.random() * 900000 + 100000); // 6 digits;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      student.password = await bcrypt.hash(args.password, salt);
      const created = await Student.create(student);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.student.factor.unit(created)}; } 
      else { return {status: 'Error', message: 'Failed to add data...', content: {}}; }
    },
    updateStudent: async (_, args, { token }) => {
      const fields = ['_id', 'schoolId', 'studentMemberTypeId', 'name', 'surname', 'dateOfBirth', 'password', 'facebook', 'instagram', 'image'];
      let updateData = await Student.findOne({_id: args._id});

      for (let fld of fields) { if (!!args[fld]) updateData[fld] = args[fld]; }
      const updated = await Student.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.student.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }
    },
    deleteStudent: async (_, args, { token }) => {
      try {
        const deleted = await Student.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content:{}};
      }
    },
  }
};
