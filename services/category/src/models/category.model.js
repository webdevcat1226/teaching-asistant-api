const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Category = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    categoryTitle: String,
}, { 
    collection: 'categories'
});

module.exports = mongoose.model('Category', Category);