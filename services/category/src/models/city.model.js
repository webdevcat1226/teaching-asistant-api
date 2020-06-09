const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let City = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    code: Number,
    cityName: String,
}, { 
    collection: 'cities'
});

module.exports = mongoose.model('City', City);