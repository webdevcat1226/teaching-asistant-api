const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let BookUnitPart = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    bookUnitId: String,
    title: String,
}, {
   collection: 'bookUnitParts'
});

module.exports = mongoose.model('BookUnitPart', BookUnitPart);