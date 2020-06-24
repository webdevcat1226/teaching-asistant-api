const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Teacher = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    schoolId: String,
    roleId: String,
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
    instagram: String,
    twitter: String,
    image: String,
    token: String,
}, {
   collection: 'teachers'
});

module.exports = mongoose.model('Teacher', Teacher);