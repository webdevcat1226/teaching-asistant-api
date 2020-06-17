const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Exam = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    date: Date,
}, {
   collection: 'exams'
});

module.exports = mongoose.model('Exam', Exam);