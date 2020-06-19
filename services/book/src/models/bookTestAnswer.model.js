const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookTestAnswer = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookTestId: String,
    subTopicId: String,
    questionNumber: Number,
    correctAnswer: {
        type: String,
        enum: ['Unknown', 'A', 'B', 'C', 'D', 'E'],
        default: 'Unknown'
    },
}, {
   collection: 'bookTestAnswers'
});

module.exports = mongoose.model('BookTestAnswer', BookTestAnswer);