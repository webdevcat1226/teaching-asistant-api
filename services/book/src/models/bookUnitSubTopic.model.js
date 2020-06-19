const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookUnitSubTopic = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookUnitPartId: String,
    subTopicId: String,
}, {
   collection: 'bookUnitSubTopics'
});

module.exports = mongoose.model('BookUnitSubTopic', BookUnitSubTopic);