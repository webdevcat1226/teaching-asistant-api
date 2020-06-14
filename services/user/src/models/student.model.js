const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Student = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    schoolId: String,
    
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
   collection: 'students'
});

module.exports = mongoose.model('Student', Student);