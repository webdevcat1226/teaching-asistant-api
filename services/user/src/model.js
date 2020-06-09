const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let UserProject = new Schema({
    _projectID: mongoose.Schema.Types.ObjectId,
    _userID: String,
    _userEmail: String,
    userExists: Boolean,
    inviteID: String,
    
    role: String,
    subrole: String,
    type: String,
    issuerID: String,
    issuerRole: String,

    isActive: Boolean,
    isAccepted: Boolean,
    isPending: Boolean,
    isRejected: Boolean,
    createTime: Date,
    updateTime: Date
}, {
   collection: 'userProjects'
});

module.exports = mongoose.model('UserProject', UserProject);