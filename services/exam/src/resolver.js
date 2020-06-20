const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const Exam = require("./models/exam.model");
const ExamAnswer = require('./models/examAnswer.model');
const ExamSet = require('./models/examSet.model');
const ExamSetBookie = require('./models/examSetBookie.model');
const ExamTest = require('./models/examTest.model');
const Lesson = require('./models/lesson.model');
const Subtopic = require('./models/subtopic.model');
const Topic = require('./models/topic.model');

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
    
    // -----   E X A M    A N S W E R   -----
    examAnswer: async (_, args, { token }) => {
      const ea = await ExamAnswer.findOne({_id: args._id});
      return Utils.examAnswer.factor.unit(ea);
    },
    examAnswers: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.examSetTestId) {where.examSetTestId = args.examSetTestId;}
      if (!!args.subTopicId) {where.subTopicId = args.subTopicId;}
      if (!!args.questionNumber) {where.questionNumber = args.questionNumber;}
      if (!!args.correctAnswer) {where.correctAnswer = args.correctAnswer;}

      const eas = await ExamAnswer.find(where).skip(offset).limit(limit);
      return Utils.examAnswer.factor.array(eas);
    },

    // -----   E X A M    S E T   -----
    examSet: async (_, args, { token }) => {
      const es = await ExamSet.findOne({_id: args._id});
      return Utils.examSet.factor.unit(es);
    },
    examSets: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.examId) { where.examId = args.examId; }
      if (!!args.categoryId) { where.categoryId = args.categoryId; }
      if (!!args.publisherId) { where.publisherId = args.publisherId; }
      if (!!args.publishYear) { where.publishYear = args.publishYear; }
      //if (!!args.isbn) { where.isbn = args.isbn; }
      if (args.showToUsers !== undefined) { where.showToUsers = args.showToUsers; }
      if (!!args.level) { where.level = args.level; }
      let ess = await ExamSet.find(where).skip(offset).limit(limit);
      return Utils.examSet.factor.array(ess);
    },

    // -----   EXAM SET BOOKIE   -----
    examSetBookie: async (_, args, { token }) => {
      const esb = await ExamSetBookie.findOne({_id: args._id});
      return Utils.examSetBookie.factor.unit(esb);
    },
    examSetBookies: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.examSetId) {where.examSetId = args.examSetId;}
      if (!!args.bookieTitle) {where.bookieTitle = args.bookieTitle;}
      const esbs = await ExamSetBookie.find(where).skip(offset).limit(limit);
      return Utils.examSetBookie.factor.array(esbs);
    },

    // -----   EXAM TEST   -----
    examTest: async (_, args, { token }) => {
      const et = await ExamTest.findOne({_id: args._id});
      return Utils.examTest.factor.unit(et);
    },
    examTests: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.examSetBookieId) {where.examSetBookieId = args.examSetBookieId;}
      if (!!args.title) {where.title = new RegExp(args.title, 'i');}
      if (!!args.sequence) {where.sequence = args.sequence;}
      if (!!args.questionCount) {where.questionCount = args.questionCount; }

      let ets = await ExamTest.find(where).skip(offset).limit(limit);
      return Utils.examTest.factor.array(ets);
    },

    // -----   L E S S O N   -----
    lesson: async (_, args, { token }) => {
      const lesson = await Lesson.findOne({_id: args._id});
      return Utils.lesson.factor.unit(lesson);
    },
    lessons: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.title) { where.title = new RegExp(args.title, 'i'); }
      let lessons = await Lesson.find(where).skip(offset).limit(limit);
      return Utils.lesson.factor.array(lessons);
    },

    // -----   S U B T O P I C   -----
    subtopic: async (_, args, { token }) => {
      const subtopic = await Subtopic.findOne({_id: args._id});
      return Utils.subtopic.factor.unit(subtopic);
    },
    subtopics: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.topicId) { where.topicId = args.topicId; }
      if (!!args.title) { where.title = new RegExp(args.title, 'i'); }

      let subtopics = await Subtopic.find(where).skip(offset).limit(limit);
      return Utils.subtopic.factor.array(subtopics);
    },

    // -----   T O P I C   -----
    topic: async (_, args, { token }) => {
      const topic = await Topic.findOne({_id: args._id});
      return Utils.topic.factor.unit(topic);
    },
    topics: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.lessonId) { where.lessonId = args.lessonId; }
      if (!!args.title) { where.title = new RegExp(args.title, 'i'); }

      let topics = await Topic.find(where).skip(offset).limit(limit);
      return Utils.topic.factor.array(topics);
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
    
    // -----   E X A M    A N S W E R   -----
    addExamAnswer: async (_, args, { token }) => {
      const duplicated = await Utils.examAnswer.checkDuplicated({examSetTestId: args.examSetTestId, subTopicId: args.subTopicId,  questionNumber: args.questionNumber});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      const examAnswer = {
        _id: new mongoose.mongo.ObjectId(),
        examSetTestId: args.examSetTestId,
        subTopicId: args.subTopicId,
        questionNumber: args.questionNumber,
        correctAnswer: args.correctAnswer,
      };
      const created = await ExamAnswer.create(examAnswer);
      if (!!created) {return {status: 'Success', message: 'Data has been added successfully', content: Utils.examAnswer.factor.unit(created)};}
      else {return {status: 'Error', message: 'Failed to add data', content: {}};}
    },
    updateExamAnswer: async (_, args, { token }) => {
      // check existence
      let updateData = await ExamAnswer.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}}; }

      // check duplicate
      const exists = await ExamAnswer.findOne({
        _id: {$ne: args},
        examSetTestId: args.examSetTestId || updateData.examSetTestId,
        subTopicId: args.subTopicId || updateData.subTopicId,
        questionNumber: args.questionNumber || updateData.questionNumber,
      });
      if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }
      // patch data to update
      if (!!args.examSetTestId) {updateData.examSetTestId = args.examSetTestId;}
      if (!!args.subTopicId) {updateData.subTopicId = args.subTopicId;}
      if (!!args.questionNumber) {updateData.questionNumber = args.questionNumber;}
      if (!!args.correctAnswer) {updateData.correctAnswer = args.correctAnswer;}

      const updated = await ExamAnswer.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated', content: Utils.examAnswer.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteExamAnswer: async (_, args, { token }) => {
      try {
        const deleted = await ExamAnswer.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data deleted been deleted', content: deleted};
      } catch (e) {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },

    // -----   E X A M    S E T   -----
    addExamSet: async (_, args, { token }) => {
      const duplicated = await Utils.examSet.checkDuplicate({ examId: args.examId, categoryId: args.categoryId, title: args.title, publisherId: args.publisherId, publishYear: args.publishYear });
      if (duplicated) { return {status: 'Error', message: 'Same exam set already exists', content: {}}; }

      let es = {
        _id: new mongoose.mongo.ObjectId(),
        examId: args.examId,
        categoryId: args.categoryId,
        title: args.title,
        publisherId: args.publisherId,
        publishYear: args.publishYear,
        isbn: args.isbn || "",
        level: args.level || "",
        showToUsers: args.showToUsers || false,
        image: args.image || "" 
      };
      const created = await ExamSet.create(es);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.examSet.factor.unit(created)};}
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateExamSet: async (_, args, { token }) => {
      let updateData = await ExamSet.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'Data not found', content: {}} }

      
      const updateFlds = ['examId', 'categoryId', 'title', 'publisherId', 'publishYear', 'isbn', 'level', 'showToUsers', 'image'];
      const reqFlds = ['examId', 'categoryId', 'title', 'publisherId', 'publishYear'];
      let reqWhere = {};

      for (let fld of reqFlds) {
        reqWhere[fld] = args[fld] || updateData[fld];
      }
      for (let fld of updateFlds) {
        if (args[fld] !== undefined) { updateData[fld] = args[fld]; }
      }

      const exists = await ExamSet.findOne(reqWhere);
      if (!!exists && !exists._id.equals(updateData._id)) { return {status: 'Success', message: 'Duplicated data', content: {}}; }

      const updated = await ExamSet.findOneAndUpdate({_id: args._id}, updateData, {returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.examSet.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data...', content: {}}; }
    },
    deleteExamSet: async (_, args, { token }) => {
      try {
        const deleted = await ExamSet.deleteOne({_id: args._id});
        if (!!deleted) { return {status: 'Success', message: 'Data has been deleted', content: deleted}; }
        else { return {status: 'Error', message: 'Failed to delete data', content: {}}; }
      } catch (e) {
        return {status: 'Error', message: 'Failed to delete data', content: {}};
      }
    },

    // -----   EXAM SET BOOKIE   -----
    addExamSetBookie: async (_, args, { token }) => {
      const duplicated = await Utils.examSetBookie.checkDuplicated({examSetId: args.examSetId, bookieTitle: args.bookieTitle});
      if (!!duplicated) { return {status: 'Error', message: 'Data already exists', content: {}}; }
      const esb = {_id: new mongoose.mongo.ObjectId(), examSetId: args.examSetId, bookieTitle: args.bookieTitle};
      const created = await ExamSetBookie.create(esb);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.examSetBookie.factor.unit(created)};}
      else {return {status: 'Error', message: 'Failed to add data', content: {}};}
    },
    updateExamSetBookie: async (_, args, { token }) => {
      let updateData = await ExamSetBookie.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}}; }
      
      const exists = await ExamSetBookie.findOne({_id: {$ne: args._id}, examSetId: args.examSetId || updateData.examSetId, bookieTitle: args.bookieTitle || updateData.bookieTitle});console.log('hi')
      if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }
      console.log('hi')
      // patch update data
      if (!!args.examSetId) {updateData.examSetId = args.examSetId;}
      if (!!args.bookieTitle) {updateData.bookieTitle = args.bookieTitle;}

      const updated = await ExamSetBookie.findOneAndUpdate({_id: args._id}, updateData, {returnOriginal: false});
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.examSetBookie.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content:{}};}
    },
    deleteExamSetBookie: async (_, args, { token }) => {
      try {
        const deleted = await ExamSetBookie.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },

    // -----   EXAM TEST   -----
    addExamTest: async (_, args, { token }) => {
      const duplicate = await Utils.examTest.checkDuplicated({examSetBookieId: args.examSetBookieId, title: args.title});
      if (!!duplicate) {return {status: 'Error', message: 'Duplicated data', content: {}};}

      const et = {
        _id: new mongoose.mongo.ObjectId(),
        examSetBookieId: args.examSetBookieId,
        title: args.title,
        sequence: args.sequence || 0,
        questionCount: args.questionCount || 0,
      };
      const created = await ExamTest.create(et);
      if (!!created) {return {status: 'Scuccess', message: 'Data has been added successfully', content: Utils.examTest.factor.unit(created)};}
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateExamTest: async (_, args, { token }) => {
      let updateData = await ExamTest.findOne({_id: args._id});
      if (!updateData) {return {status: 'Error', message: 'No data found', content: {}};}

      const exists = await ExamTest.findOne({
          _id: {$ne: args._id}, 
          examSetBookieId: args.examSetBookieId || updateData.examSetBookieId,
          title: args.title || updateData.title
        });
      if (!!exists) {return {status: 'Error', message: 'Same data alread exists', content: {}};}

      if (!!args.examSetBookieId) {updateData.examSetBookieId = args.examSetBookieId;}
      if (!!args.title) {updateData.title = args.title;}
      if (!!args.sequence) {updateData.sequence = args.sequence;}
      if (!!args.questionCount) {updateData.questionCount = args.questionCount;}

      const updated = await ExamTest.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.examTest.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteExamTest: async (_, args, { token }) => {
      try {
        const deleted = ExamTest.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted', content: deleted};
      } catch (e) {return {status: 'Error', message: 'Failed to delete data', content: {}};}
    },

    // -----   L E S S O N   -----
    addLesson: async (_, args, { token }) => {
      const duplicated = await Utils.lesson.checkDuplicate({title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      let lesson = {_id: new mongoose.mongo.ObjectId(), title: args.title};
      const created = await Lesson.create(lesson);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.lesson.factor.unit(created)}; }
      else { return { status: 'Error', message: 'Failed to add data', content: {} }; }
    },
    updateLesson: async (_, args, { token }) => {
      const updateData = await Lesson.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}}; }
      const exists = await Lesson.findOne({title: args.title, _id: {$ne: args._id}});
      if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      const updated = await Lesson.findOneAndUpdate({_id: args._id}, {title: args.title}, {returnOriginal: false});
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.lesson.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data', content: {}}; }
    },
    deleteLesson: async (_, args, { token }) => {
      try {
        const deleted = await Lesson.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted};
      }
      catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },

    // -----   S U B T O P I C   -----
    addSubtopic: async (_, args, { token }) => {
      const duplicated = await Utils.subtopic.checkDuplicate({topicId: args.topicId, title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      const subtopic = {_id: new mongoose.mongo.ObjectId(), topicId: args.topicId, title: args.title};
      const created = await Subtopic.create(subtopic);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.subtopic.factor.unit(created)}; }
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateSubtopic: async (_, args, { token }) => {
      let updateData = await Subtopic.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}}; }

      let exists = await Subtopic.findOne({topicId: args.topicId || updateData.topicId, title: args.title || updateData.title, _id: {$ne: args._id}});
      if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      if (!!args.topicId) {updateData.topicId = args.topicId;}
      if (!!args.title) { updateData.title = args.title; }
      const updated = await Subtopic.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) { return {status: 'Success', message: 'Data has been updated successfully', content: Utils.subtopic.factor.unit(updated)}; }
      else { return {status: 'Error', message: 'Failed to update data', content: {}}; }
    },
    deleteSubtopic: async (_, args, { token }) => {
      try {
        const deleted = await Subtopic.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data had been deleted successfully', content: deleted};
      }
      catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },

    // -----   T O P I C   -----
    addTopic: async (_, args, { token }) => {
      const duplicated = await Topic.findOne({lessonId: args.lessonId, title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      const topic = { _id: new mongoose.mongo.ObjectId(), lessonId: args.lessonId, title: args.title };

      const created = await Topic.create(topic);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.topic.factor.unit(created)}; }
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateTopic: async (_, args, { token }) => {
      let updateData = await Topic.findOne({_id: args._id});
      if (!updateData) {return {status: 'Error', message: 'No data found', content: {}};}

      const exists = await Topic.findOne({lessonId: args.lessonId, title: args.title, _id: {$ne: args._id}});
      if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      if (!!args.lessonId) {updateData.lessonId = args.lessonId;}
      if (!!args.title) {updateData.title = args.title;}
      const updated = await Topic.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.topic.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteTopic: async (_, args, { token }) => {
      try {
        const deleted = await Topic.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Topic deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },
  },


  Exam: {
    async __resolveReference(exm) {
      const exam = await Exam.findOne({_id: exm._id});
      return Utils.exam.factor.unit(exam);
    },
  },

  ExamAnswer: {
    async __resolveReference(ea) {
      const examAnswer = await ExamAnswer.findOne({_id: ea._id});
      return Utils.examAnswer.factor.unit(examAnswer);
    },
    async subtopic(ea) {
      const subtopic = await Subtopic.findOne({_id: ea.subTopicId});
      console.log(ea, subtopic);
      return Utils.subtopic.factor.unit(subtopic);
    },
    async examTest(ea) {
      const examTest = await ExamTest.findOne({_id: ea.examSetTestId});
      return Utils.examTest.factor.unit(examTest);
    },
  },

  ExamSet: {
    async __resolveReference(es) {
      const examSet = await ExamSet.findOne({_id: es._id});
      return Utils.examSet.factor.unit(examSet);
    },
    async exam(es) {
      const exam = await Exam.findOne({_id: es.examId});
      return Utils.exam.factor.unit(exam);
    },
    category(es) { return {__typename: "Category", _id: es.categoryId}; },
    publisher(es) { return {__typename: "Publisher", _id: es.publisherId}; }
  },

  ExamSetBookie: {
    async __resolveReference(esb) {
      const examSetBookie = await ExamSetBookie.findOne({_id: esb._id});
      return Utils.examSetBookie.factor.unit(examSetBookie);
    },
    async examSet(esb) {
      const examSet = await ExamSet.findOne({_id: esb.examSetId});
      return Utils.examSet.factor.unit(examSet);
    },
  },

  ExamTest: {
    async __resolveReference(et) {
      const examTest = await ExamTest.findOne({_id: et._id});
      return Utils.examTest.factor.unit(examTest);
    },
    async examSetBookie(et) {
      const esb = await ExamSetBookie.findOne({_id: et.examSetBookieId});
      return Utils.examSetBookie.factor.unit(esb);
    },
  },

  Lesson: {
    async __resolveReference(ls) {
      const lesson = await Lesson.findOne({_id: ls._id});
      return Utils.lesson.factor.unit(lesson);
    },
  },

  Subtopic: {
    async __resolveReference(st) {
      const subtopic = await Subtopic.findOne({_id: st._id});
      return Utils.subtopic.factor.unit(subtopic);
    },
  },

  Topic: {
    async __resolveReference(tp) {
      const topic = await Topic.findOne({_id: tp._id});
      return Utils.topic.factor.unit(topic);
    },
    async lesson(topic) {
      const lesson = await Lesson.findOne({_id: topic.lessonId});
      return Utils.lesson.factor.unit(lesson);
    },
  }
};
