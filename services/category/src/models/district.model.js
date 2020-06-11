const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let District = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    cityId: String,
    districtName: String,
}, { 
    collection: 'districts'
});

module.exports = mongoose.model('District', District);