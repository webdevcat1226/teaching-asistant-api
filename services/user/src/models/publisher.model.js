const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Publisher = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    address: String,
}, {
   collection: 'publishers'
});

module.exports = mongoose.model('Publisher', Publisher);