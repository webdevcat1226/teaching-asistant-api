const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookUnitTopic = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookUnitPartId: String,
    topicId: String,
}, {
   collection: 'bookUnitTopics'
});

module.exports = mongoose.model('BookUnitTopic', BookUnitTopic);