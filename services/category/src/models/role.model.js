const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Role = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
}, { 
    collection: 'roles'
});

module.exports = mongoose.model('Role', Role);