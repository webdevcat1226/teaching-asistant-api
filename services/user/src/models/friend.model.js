const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Friend = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    studentId: String,
    teacherId: String,
    isAccepted: Boolean,
    isSenderAsStudent: Boolean,
}, {
   collection: 'friends'
});

module.exports = mongoose.model('Friend', Friend);