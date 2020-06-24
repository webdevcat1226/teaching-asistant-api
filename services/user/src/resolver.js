const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Manager = require("./models/manager.model");
const Student = require('./models/student.model');
const Teacher = require('./models/teacher.model');
const Publisher = require('./models/publisher.model');
const Friend = require('./models/friend.model');

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

    // -----   T E A C H E R   -----
    teacher: async (_, args, { token }) => {
      const teacher = await Teacher.findOne({_id: args._id});
      return Utils.teacher.factor.unit(teacher);
    },
    teachers: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 100;
      let where = {};
      if (!!args.schoolId) { where.schoolId = args.schoolId; }
      if (!!args.roleId) { where.roleId = args.roleId; }
      if (!!args.isConfirmed) { where.isConfirmed = args.isConfirmed; }
      const teachers = await Teacher.find(where).skip(offset).limit(limit);
      return Utils.teacher.factor.array(teachers);
    },

    // -----   P U B L I S H E R   -----
    publisher: async (_, args, { token }) => {
      const publisher = await Publisher.findOne({_id: args._id});
      return Utils.publisher.factor.unit(publisher);
    },
    publishers: async (_, args, { token }) => { 
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.name) { where.name = new RegExp(args.name, 'i'); }
      if (!!args.address) { where.address = new RegExp(args.address, 'i'); }
      if (!!args.phone) { where.phone = args.phone; }
      if (!!args.email) { where.email = args.email; }

      let publishers = await Publisher.find(where).skip(offset).limit(limit);
      return Utils.publisher.factor.array(publishers);
    },

    // -----   F R I E N D   -----
    friend: async (_, args, { token }) => {
      const friend = await Friend.findOne({_id: args._id});
      return Utils.friend.factor.unit(friend);
    },
    friends: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.studentId) { where.studentId = args.studentId; }
      if (!!args.teacherId) { where.teacherId = args.teacherId; }
      if (args.isAccepted !== undefined) { where.isAccepted = args.isAccepted; }
      if (args.isSenderAsStudent !== undefined) { where.isSenderAsStudent = args.isSenderAsStudent; }

      let friends = await Friend.find(where).skip(offset).limit(limit);
      return Utils.friend.factor.array(friends);
    },

  },

  Mutation: {
    // -----   M A N A G E R   -----
    addManager: async (_, args, { token }) => {
      // roleId: String!, districtId: String!, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: Date!, password: String!, email: String!,
      // gsm: String, email: String!, facebook: String, twitter: String, instagram: String, image: String
      const duplicated = await Utils.manager.checkDuplicate(args.email);
      if (!!duplicated) {
        return { status: 'Error', message: 'Email alread exists', content: null };
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
        return { status: 'Error', message: 'Failed to add data...', content: null };
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
        return { status: 'Error', message: 'Failed to update data...', content: null };
      }
    },
    deleteManager: async (_, args, { token }) => {
      const deleted = await Manager.deleteOne({ _id: args._id });
      if (!!deleted) {
        if (deleted.deletedCount > 0) {
          return { status: 'Success', message: 'Data has been deleted successfully', content: {...deleted, _id: args._id} };
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
      if (!!emailDup) { return {status: 'Error', message: 'Email already exists!', content: null}; }
      const phoneDup = await Utils.student.checkDuplicate({gsm: args.gsm});
      if (!!phoneDup) { return {status: 'Error', message: 'Phone number already exists!', content: null}; }

      let student = {_id: new mongoose.mongo.ObjectId(), email: args.email, gsm: args.gsm, name: args.name, surname: args.surname, dateOfBirth: args.dateOfBirth, registrationDate: new Date().toISOString(), isConfirmed: false,
        schoolId: args.schoolId || '', studentMemberTypeId: args.studentMemberTypeId || "", facebook: args.facebook || "", instagram: args.instagram || "", twitter: args.twitter || "", image: args.image || ""};
      student.confirmationKey = Math.floor(Math.random() * 900000 + 100000); // 6 digits;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      student.password = await bcrypt.hash(args.password, salt);
      const created = await Student.create(student);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.student.factor.unit(created)}; } 
      else { return {status: 'Error', message: 'Failed to add data...', content: null}; }
    },
    updateStudent: async (_, args, { token }) => {
      const fields = ['_id', 'schoolId', 'studentMemberTypeId', 'name', 'surname', 'dateOfBirth', 'facebook', 'instagram', 'twitter', 'image'];
      let updateData = await Student.findOne({_id: args._id});

      for (let fld of fields) { if (!!args[fld]) updateData[fld] = args[fld]; }
      const updated = await Student.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.student.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: null}; }
    },
    deleteStudent: async (_, args, { token }) => {
      try {
        const deleted = await Student.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: {...deleted, _id: args._id}};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content:{}};
      }
    },
    confirmStudent: async (_, args, { token }) => {
      let student = await Student.findOne({_id: args._id});
      if (!student) { return {status: 'Error', message: 'Data not found', content: {}}; }
      // check if already confirmed
      if (student.isConfirmed === 1) {return {status: 'Success', message: 'User is already verified', content: Utils.student.factor.unit(student)}}

      if (student.confirmationKey === args.confirmationKey) {
        //const updateData = {studentisConfirmed: true, confirmationKey: 0};
        student.isConfirmed = true;
        student.confirmationKey = 0;
        const updated = await Student.findOneAndUpdate({_id: args._id}, student, {returnOriginal: false});
        return {status: 'Success', message: 'User had been verified successfully', content: Utils.student.factor.unit(updated)};
      } else { return {status: 'Error', message: 'Cofirmationkey does not match!', content: {}}; }
    },

    // -----   T E A C H E R   -----
    addTeacher: async (_, args, { token }) => {
      const emailDup = await Utils.teacher.checkDuplicate({email: args.email});
      if (!!emailDup) { return {status: 'Error', message: 'Email already exists!', content: null}; }
      const phoneDup = await Utils.teacher.checkDuplicate({gsm: args.gsm});
      if (!!phoneDup) { return {status: 'Error', message: 'Phone number already exists!', content: null}; }

      let teacher = {_id: new mongoose.mongo.ObjectId(), email: args.email, gsm: args.gsm, name: args.name, surname: args.surname, dateOfBirth: args.dateOfBirth, registrationDate: new Date().toISOString(), isConfirmed: false,
        schoolId: args.schoolId || '', roleId: args.roleId || "", facebook: args.facebook || "", instagram: args.instagram || "", twitter: args.twitter || "", image: args.image || ""};
      teacher.confirmationKey = Math.floor(Math.random() * 900000 + 100000); // 6 digits;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      teacher.password = await bcrypt.hash(args.password, salt);
      const created = await Teacher.create(teacher);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.teacher.factor.unit(created)}; } 
      else { return {status: 'Error', message: 'Failed to add data...', content: null}; }
    },
    updateTeacher: async (_, args, { token }) => {
      const fields = ['_id', 'schoolId', 'roleId', 'name', 'surname', 'dateOfBirth', 'facebook', 'instagram', 'twitter', 'image'];
      let updateData = await Teacher.findOne({_id: args._id});

      for (let fld of fields) { if (!!args[fld]) updateData[fld] = args[fld]; }
      const updated = await Teacher.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.teacher.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: null}; }
    },
    deleteTeacher: async (_, args, { token }) => {
      try {
        const deleted = await Teacher.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: {...deleted, _id: args._id}};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content:{}};
      }
    },
    confirmTeacher: async (_, args, { token }) => {
      let teacher = await Teacher.findOne({_id: args._id});
      if (!teacher) { return {status: 'Error', message: 'Data not found', content: {}}; }
      // check if already confirmed
      if (teacher.isConfirmed === 1) {return {status: 'Success', message: 'User is already verified', content: Utils.teacher.factor.unit(teacher)}}

      if (teacher.confirmationKey === args.confirmationKey) {
        //const updateData = {studentisConfirmed: true, confirmationKey: 0};
        teacher.isConfirmed = true;
        teacher.confirmationKey = 0;
        const updated = await Teacher.findOneAndUpdate({_id: args._id}, teacher, {returnOriginal: false});
        return {status: 'Success', message: 'User had been verified successfully', content: Utils.teacher.factor.unit(updated)};
      } else { return {status: 'Error', message: 'Cofirmationkey does not match!', content: {}}; }
    },

    // -----   P U B L I S H E R   -----
    addPublisher: async (_, args, { token }) => {
      const pubDuplicated = await Utils.publisher.checkDuplicate({ email: args.email });
      if (!!pubDuplicated) { return {status: 'Error', message: 'Email already exists', content: {}}; }

      let publisher = { _id: new mongoose.mongo.ObjectId(), email: args.email, name: args.name, phone: args.phone || "", address: args.address || "" };
      const created = await Publisher.create(publisher);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.publisher.factor.unit(created)};}
      else { return {status: 'Error', message: 'Failed to add data...', content: {}}; }
    },
    updatePublisher: async (_, args, { token }) => {
      const fields = ['name', 'email', 'phone', 'address'];
      let updateData = await Publisher.findOne({_id: args._id});

      for (let fld of fields) { if (!!args[fld]) updateData[fld] = args[fld]; }
      const updated = await Publisher.findOneAndUpdate({_id: args._id}, updateData, {returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.publisher.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }
    },
    deletePublisher: async (_, args, { token }) => {
      try {
        const deleted = await Publisher.deleteOne({ _id: args._id });
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content: {}};
      }
    },

    // -----   F R I E N D   -----
    addFriend: async (_, args, { token }) => {
      // todo - check student and teacher exists?

      // check duplicated
      const duplicated = await Utils.friend.checkDuplicate({ studentId: args.studentId, teacherId: args.teacherId });
      if (!!duplicated) { return {status: 'Scucess', message: 'Dupliated data', content: {}}; }

      const friend = { _id: new mongoose.mongo.ObjectId(), studentId: args.studentId, teacherId: args.teacherId, isAccepted: false, isSenderAsStudent: args.isSenderAsStudent || true };
      const created = await Friend.create(friend);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.friend.factor.unit(created)}; }
      else { return {status: 'Error', message: 'Failed to add data...', content: {}}; }
    },
    updateFriend: async (_, args, { token }) => {
      let updateData = await Friend.findOne({ _id: args._id });

      if (args.isAccepted !== undefined) { updateData.isAccepted = args.isAccepted; }
      if (args.isSenderAsStudent !== undefined) { updateData.isSenderAsStudent = args.isSenderAsStudent; }
      const updated = await Friend.findOneAndUpdate({_id: args._id}, updateData, {returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.friend.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }
    },
    deleteFriend: async (_, args, { token }) => {
      try {
        const deleted = await Friend.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data...', content: {}};
      }
    },

  },

  Friend: {
    async __resolveReference(fr) {
      const friend = await Friend.findOne({_id: fr._id});
      return Utils.friend.factor.unit(friend);
    },
    async student(friend) { 
      const student = await Student.findOne({_id: friend.studentId});
      return Utils.student.factor.unit(student);
    },
    async teacher(friend) {
      const teacher = await Teacher.findOne({_id: friend.teacherId});
      return Utils.teacher.factor.unit(teacher);
    }
  },

  Manager: {
    async __resolveReference(st) {
      const manager = await Manager.findOne({_id: st._id});
      return Utils.manager.factor.unit(manager);
    },
    district(manager) { return {__typename: "District", _id: manager.districtId}; },
    role(manager) { return {__typename: "Role", _id: manager.roleId}; },
  },

  Publisher: {
    async __resolveReference(pbl) {
      const publisher = await Publisher.findOne({_id: pbl._id});
      return Utils.publisher.factor.unit(publisher);
    },
  },

  Student: {
    async __resolveReference(st) {
      const student = await Student.findOne({_id: st._id});
      return Utils.student.factor.unit(student);
    },
    school(student) { return {__typename: "School", _id: student.schoolId}; },
    studentMemberType(student) { return {__typename: "StudentMemberType", _id: student.studentMemberTypeId}; }
  },

  Teacher: {
    async __resolveReference(tch) {
      const teacher = await Teacher.findOne({_id: tch._id});
      return Utils.teacher.factor.unit(teacher);
    },
    role(teacher) { return {__typename: "Role", _id: teacher.roleId}; },
    school(teacher) { return {__typename: "School", _id: teacher.schoolId}; }
  },
};
