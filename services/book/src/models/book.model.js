const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Book = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: String,
    categoryId: String,
    title: String,
    publisherId: String,
    publishYear: Number,
    isbn: String,
    level: {
        type: String,
        enum: ['Level1', 'Level2', 'Level3', 'Level4', 'Level5'],
        default: 'Level1'
    },
    showToUsers: Boolean,
    image: String,
}, {
   collection: 'books'
});

module.exports = mongoose.model('Book', Book);