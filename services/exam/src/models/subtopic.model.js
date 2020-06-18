const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Subtopic = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    topicId: String,
    title: String,
}, {
   collection: 'subtopics'
});

module.exports = mongoose.model('Subtopic', Subtopic);