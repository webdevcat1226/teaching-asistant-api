const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let ExamSetBookie = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examSetId: String,
    bookieTitle: String,
}, {
   collection: 'examSetBookies'
});

module.exports = mongoose.model('ExamSetBookie', ExamSetBookie);