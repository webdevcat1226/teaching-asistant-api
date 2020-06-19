const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookUnit = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookId: String,
    lessonId: String,
    title: String,
}, {
   collection: 'bookUnits'
});

module.exports = mongoose.model('BookUnit', BookUnit);