const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Lesson = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
}, {
   collection: 'lessons'
});

module.exports = mongoose.model('Lesson', Lesson);