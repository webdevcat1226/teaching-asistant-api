const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
require('dotenv').config();

const Book = require('./models/book.model');
const BookTest = require('./models/bookTest.model');
const BookTestAnswer = require('./models/bookTestAnswer.model');
const BookUnit = require('./models/bookUnit.model');
const BookUnitPart = require('./models/bookUnitPart.model');
const BookUnitSubTopic = require('./models/bookUnitSubTopic.model');
const BookUnitTopic = require('./models/bookUnitTopic.model');

const Utils = require("./utils");

module.exports = {
  Query: {
    // -----   B O O K   -----
    book: async (_, args, { token }) => {
      const book = await Book.findOne({_id: args._id});
      return Utils.book.factor.unit(book);
    },
    books: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.examId) { where.examId = args.examId; }
      if (!!args.categoryId) {where.categoryId = args.categoryId;}
      if (!!args.title) {where.title = new RegExp(args.title, 'i');}
      if (!!args.publisherId) {where.publisherId = args.publisherId;}
      if (!!args.publishYear) {where.publishYear = args.publishYear;}
      if (!!args.isbn) {where.isbn = args.isbn;}
      if (!!args.level) {where.level = args.level;}
      if (args.showToUsers !== undefined) {where.showToUsers = args.showToUsers;}
      
      let books = await Book.find(where).skip(offset).limit(limit);
      return Utils.book.factor.array(books);
    },

    // -----   B O O K   T E S T   -----
    bookTest: async (_, args, { token }) => {
      const bookTest = await BookTest.findOne({_id: args._id});
      return Utils.bookTest.factor.unit(bookTest);
    },
    bookTests: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.iimit ? args.limit : 0;
      let where = {};
      if (!!args.bookUnitPartId) {where.bookUnitPartId = args.bookUnitPartId;}
      if (!!args.testName) {where.testName = new RegExp(args.testName, 'i');}
      if (!!args.questionCount) {where.questionCount = args.questionCount;}

      let bookTests = await BookTest.find(where).skip(offset).limit(limit);
      return Utils.bookTest.factor.array(bookTests);
    },

    // -----   B O O K   T E S T   A N S W E R   -----
    bookTestAnswer: async (_, args, { token }) => {
      const bta = await BookTestAnswer.findOne({_id: args._id});
      return Utils.bookTestAnswer.factor.unit(bta);
    },
    bookTestAnswers: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.iimit ? args.limit : 0;
      let where = {};
      if (!!args.bookTestId) {where.bookTestId = args.bookTestId;}
      if (!!args.subTopicId) {where.subTopicId = args.subTopicId;}
      if (!!args.questionNumber) {where.questionNumber = args.questionNumber;}
      if (!!args.correctAnswer) {where.correctAnswer = args.correctAnswer;}

      let bookTestAnswers = await BookTestAnswer.find(where).skip(offset).limit(limit);
      return Utils.bookTestAnswer.factor.array(bookTestAnswers);
    },

    // -----   B O O K   U N I T   -----
    bookUnit: async (_, args, { token }) => {
      const bookUnit = await BookUnit.findOne({_id: args._id});
      return Utils.bookUnit.factor.unit(bookUnit);
    },
    bookUnits: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.iimit ? args.limit : 0;
      let where = {};
      if (!!args.bookId) {where.bookId = args.bookId;}
      if (!!args.lessonId) {where.lessonId = args.lessonId;}
      if (!!args.title) {where.title = new RegExp(args.title, 'i');}

      let bookUnits = await BookUnit.find(where).skip(offset).limit(limit);
      return Utils.bookUnit.factor.array(bookUnits);
    },

    // -----   B O O K   U N I T    P A R T   -----
    bookUnitPart: async (_, args, { token }) => {
      const but = await BookUnitPart.findOne({_id: args._id});
      return Utils.bookUnitPart.factor.unit(but);
    },
    bookUnitParts: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.title) {where.title = new RegExp(args.title, 'i');}
      if (!!args.bookUnitId) {where.bookUnitId = args.bookUnitId;}

      let buts = await BookUnitPart.find(where).skip(offset).limit(limit);
      return Utils.bookUnitPart.factor.array(buts);
    },

    // -----   B O O K   U N I T   S U B T O P I C   -----
    bookUnitSubTopic: async (_, args, { token }) => {
      const but = await BookUnitSubTopic.findOne({_id: args._id});
      return Utils.bookUnitSubTopic.factor.unit(but);
    },
    bookUnitSubTopics: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.subTopicId) {where.subTopicId = args.subTopicId;}
      if (!!args.bookUnitPartId) {where.bookUnitPartId = args.bookUnitPartId;}

      let buts = await BookUnitSubTopic.find(where).skip(offset).limit(limit);
      return Utils.bookUnitSubTopic.factor.array(buts);
    },

    // -----   B O O K   U N I T   T O P I C   -----
    bookUnitTopic: async (_, args, { token }) => {
      const but = await BookUnitTopic.findOne({_id: args._id});
      return Utils.bookUnitTopic.factor.unit(but);
    },
    bookUnitTopics: async (_, args, { token }) => {
      const offset = !!args.offset ? args.offset : 0;
      const limit = !!args.limit ? args.limit : 0;
      let where = {};
      if (!!args.topicId) {where.topicId = args.topicId;}
      if (!!args.bookUnitPartId) {where.bookUnitPartId = args.bookUnitPartId;}

      let buts = await BookUnitTopic.find(where).skip(offset).limit(limit);
      return Utils.bookUnitTopic.factor.array(buts);
    },


  },

  Mutation: {
    // -----   B O O K   -----
    addBook: async (_, args, { token }) => {
      const duplicated = await Utils.book.checkDuplicate({title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}}; }

      const book = { 
        _id: new mongoose.mongo.ObjectId(),
        title: args.title,
        examId: args.examId || "",
        categoryId: args.categoryId || "",
        publisherId: args.publisherId || "",
        publishYear: args.publshYear || new Date().getFullYear(),
        isbtn: args.isbn || "",
        showToUsers: args.showToUsers || false,
        image: args.image || "",
      };

      const created = await Book.create(book);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.book.factor.unit(created)}; }
      else { return {status: 'Error', message: 'Failed to add data', content: {}}; }
    },
    updateBook: async (_, args, { token }) => {
      let updateData = await Book.findOne({_id: args._id});
      if (!updateData) {return {status: 'Error', message: 'No data found', content: {}};}

      if (!!args.title) {
        const exists = await Book.findOne({title: args.title, _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}}; }
      }

      // patch data to update
      const fields = ['examId', 'title', 'categoryId', 'publisehrId', 'publishYear', 'isbn', 'level', 'showToUsers', 'image'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);

      const updated = await Book.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.book.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBook: async (_, args, { token }) => {
      try {
        const deleted = await Book.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Topic deleted successfully', content: deleted};
      } catch (e) {
        return {status: 'Error', message: 'Something went wrong', content: {}};
      }
    },

    // -----   B O O K   T E S T   -----
    addBookTest: async (_, args, { token }) => {
      const duplicated = await Utils.bookTest.checkDuplicated({testName: args.testName, bookUnitPartId: args.bookUnitPartId});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookTest = {
        _id: new mongoose.mongo.ObjectId(),
        bookUnitPartId: args.bookUnitPartId,
        testName: args.testName,
        questionCount: args.questionCount || 0
      };
      const created = await BookTest.create(bookTest);
      if (!!created) {return {status:'Success', message: 'Data has been created', content: Utils.bookTest.factor.unit(created)}}
      else {return {status:'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookTest: async (_, args, { token }) => {
      let updateData = await BookTest.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.testName || !!args.bookUnitPartId) {
        const exists = await BookTest.findOne({
          testName: args.testName || updateData.testName, 
          bookUnitPartId: args.bookUnitPartId || updateData.bookUnitPartId,
          _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      // patch data for update
      const fields = ['bookUnitPartId', 'testName', 'questionCount'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);

      const updated = await BookTest.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookTest.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBookTest: async(_, args, {token}) => {
      try {
        const deleted = await BookTest.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted}
      } catch (e) {return {status: 'Error', message: 'Something went wrong', content: {}}}
    },

    // -----   B O O K   T E S T   A N S W E R   -----
    addBookTestAnswer: async (_, args, { token }) => {
      const duplicated = await Utils.bookTestAnswer.checkDuplicated({bookTestId: args.bookTestId, subTopicId: args.subTopicId, questionNumber: args.questionNumber});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookTestAnswer = {
        _id: new mongoose.mongo.ObjectId(),
        bookTestId: args.bookTestId,
        subTopicId: args.subTopicId,
        questionNumber: args.questionNumber,
        correctAnswer: args.correctAnswer || 'Unknown',
      };
      const created = await BookTestAnswer.create(bookTestAnswer);
      if (!!created) {return {status:'Success', message: 'Data has been created', content: Utils.bookTestAnswer.factor.unit(created)}}
      else {return {status:'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookTestAnswer: async (_, args, { token }) => {
      let updateData = await BookTestAnswer.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.bookTestId || !!args.subTopicId || !!args.questionNumber) {
        const exists = await BookTestAnswer.findOne({
          bookTestId: args.bookTestId || updateData.bookTestId,
          subTopicId: args.subTopicId || updateData.subTopicId,
          questionNumber: args.questionNumber || updateData.questionNumber,
          _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      // patch data for update
      const fields = ['bookTestId', 'subTopicId', 'questionNumber', 'correctAnswer'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);

      const updated = await BookTestAnswer.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookTestAnswer.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBookTestAnswer: async(_, args, {token}) => {
      try {
        const deleted = await BookTestAnswer.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted}
      } catch (e) {return {status: 'Error', message: 'Something went wrong', content: {}}}
    },

    // -----   B O O K   U N I T   -----
    addBookUnit: async (_, args, { token }) => {
      const duplicated = await Utils.bookUnit.checkDuplicated({title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookUnit = {
        _id: new mongoose.mongo.ObjectId(),
        title: args.title,
        bookId: args.bookId || "",
        lessonId: args.lessonId || "",
      };
      const created = await BookUnit.create(bookUnit);
      if (!!created) {return {status:'Success', message: 'Data has been created', content: Utils.bookUnit.factor.unit(created)}}
      else {return {status:'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookUnit: async (_, args, { token }) => {
      let updateData = await BookUnit.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.title) {
        const exists = await BookUnit.findOne({title: args.title, _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      // patch data for update
      const fields = ['bookId', 'lessonId', 'title'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);

      const updated = await BookUnit.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false });
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookUnit.factor.unit(updated)};}
      else {return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBook: async(_, args, {token}) => {
      try {
        const deleted = await BookUnit.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted successfully', content: deleted}
      } catch (e) {return {status: 'Error', message: 'Something went wrong', content: {}}}
    },

    // -----   B O O K   U N I T    P A R T   -----
    addBookUnitPart: async (_, args, { token }) => {
      const duplicated = await Utils.bookUnitPart.checkDuplicated({title: args.title});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookUnitPart = {
        _id: new mongoose.mongo.ObjectId(),
        title: args.title,
        bookUnitId: args.bookUnitId || ""
      };
      const created = await BookUnitPart.create(bookUnitPart);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.bookUnitPart.factor.unit(created)}}
      else { return {status: 'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookUnitPart: async (_, args, { token }) => {
      // check if data exists
      let updateData = await BookUnitPart.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.title) {
        const exists = await BookUnitPart.findOne({title: args.title, _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      const fields = ['bookUnitId', 'title'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);
      const updated = await BookUnitPart.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookUnitPart.factor.unit(updated)}}
      else { return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBookUnitPart: async (_, args, { token }) => {
      try {
        const deleted = await BookUnitPart.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted', content: deleted};
      } catch (e) {return {status: 'Error', message: 'Failed to delete data', content: {}}}
    },

    // -----   B O O K   U N I T    S U B T O P I C   -----
    addBookUnitSubTopic: async (_, args, { token }) => {
      const duplicated = await Utils.bookUnitSubTopic.checkDuplicated({bookUnitPartId: args.bookUnitPartId, subTopicId: args.subTopicId});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookUnitSubTopic = {
        _id: new mongoose.mongo.ObjectId(),
        subTopicId: args.subTopicId,
        bookUnitPartId: args.bookUnitPartId || ""
      };
      const created = await BookUnitSubTopic.create(bookUnitSubTopic);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.bookUnitSubTopic.factor.unit(created)}}
      else { return {status: 'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookUnitSubTopic: async (_, args, { token }) => {
      // check if data exists
      let updateData = await BookUnitSubTopic.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.bookUnitPartId || !!args.subTopicId) {
        const exists = await BookUnitSubTopic.findOne({subTopicId: args.subTopicId || updateData.subTopicId, bookUnitPartId: args.bookUnitPartId || updateData.bookUnitPartId , _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      const fields = ['bookUnitPartId', 'subTopicId'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);
      const updated = await BookUnitSubTopic.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookUnitSubTopic.factor.unit(updated)}}
      else { return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBookUnitSubTopic: async (_, args, { token }) => {
      try {
        const deleted = await BookUnitSubTopic.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted', content: deleted};
      } catch (e) {return {status: 'Error', message: 'Failed to delete data', content: {}}}
    },

    // -----   B O O K   U N I T    T O P I C   -----
    addBookUnitTopic: async (_, args, { token }) => {
      const duplicated = await Utils.bookUnitTopic.checkDuplicated({bookUnitPartId: args.bookUnitPartId, topicId: args.topicId});
      if (!!duplicated) { return {status: 'Error', message: 'Duplicated data', content: {}};}

      const bookUnitTopic = {
        _id: new mongoose.mongo.ObjectId(),
        topicId: args.topicId,
        bookUnitPartId: args.bookUnitPartId || ""
      };
      const created = await BookUnitTopic.create(bookUnitTopic);
      if (!!created) { return {status: 'Success', message: 'Data has been added successfully', content: Utils.bookUnitTopic.factor.unit(created)}}
      else { return {status: 'Error', message: 'Failed to add data', content: {}};}
    },
    updateBookUnitTopic: async (_, args, { token }) => {
      // check if data exists
      let updateData = await BookUnitTopic.findOne({_id: args._id});
      if (!updateData) { return {status: 'Error', message: 'No data found', content: {}};}

      // check duplicated
      if (!!args.bookUnitPartId || !!args.topicId) {
        const exists = await BookUnitTopic.findOne({topicId: args.topicId || updateData.topicId, bookUnitPartId: args.bookUnitPartId || updateData.bookUnitPartId , _id: {$ne: args._id}});
        if (!!exists) { return {status: 'Error', message: 'Duplicated data', content: {}};}
      }

      const fields = ['bookUnitPartId', 'topicId'];
      updateData = Utils.patchOriginFromRequest(updateData, args, fields);
      const updated = await BookUnitTopic.findOneAndUpdate({_id: args._id}, updateData, { returnOriginal: false});
      if (!!updated) {return {status: 'Success', message: 'Data has been updated successfully', content: Utils.bookUnitTopic.factor.unit(updated)}}
      else { return {status: 'Error', message: 'Failed to update data', content: {}};}
    },
    deleteBookUnitTopic: async (_, args, { token }) => {
      try {
        const deleted = await BookUnitTopic.deleteOne({_id: args._id});
        return {status: 'Success', message: 'Data has been deleted', content: deleted};
      } catch (e) {return {status: 'Error', message: 'Failed to delete data', content: {}}}
    },

  }
};
