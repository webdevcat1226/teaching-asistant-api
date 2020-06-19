const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookTest = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookUnitPartId: String,
    testName: String,
    questionCount: Number,
}, {
   collection: 'bookTests'
});

module.exports = mongoose.model('BookTest', BookTest);