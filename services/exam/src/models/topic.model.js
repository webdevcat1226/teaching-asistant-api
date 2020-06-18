const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Topic = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    lessonId: String,
    title: String,
}, {
   collection: 'topics'
});

module.exports = mongoose.model('Topic', Topic);