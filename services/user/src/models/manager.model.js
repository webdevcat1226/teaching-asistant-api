const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Manager = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roleId: String,
    districtId: String,
    isSystemAdministrator: Boolean,
    name: String,
    surname: String,
    dateOfBirth: Date,
    password: String,
    gsm: String,
    email: String,
    confirmationKey: Number,
    isConfirmed: Boolean,
    registrationDate: Date,
    facebook: String,
    twitter: String,
    instagram: String,
    image: String,
    token: String,
}, {
   collection: 'managers'
});

module.exports = mongoose.model('Manager', Manager);