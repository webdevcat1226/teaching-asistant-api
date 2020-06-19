const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let ExamAnswer = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examSetTestId: String,
    subTopicId: String,
    questionNumber: Number,
    correctAnswer: {
        type: String,
        enum: ['Unknown', 'A', 'B', 'C', 'D', 'E'],
        default: 'Unknown'
    },
}, {
   collection: 'examAnswers'
});

module.exports = mongoose.model('ExamAnswer', ExamAnswer);