const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentMemberType = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    typeTitle: String,
    descriptions: String,
    piece: Number,
}, { 
    collection: 'studentMemberTypes'
});

module.exports = mongoose.model('StudentMemberType', StudentMemberType);