const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RoleAuthority = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    roleId: String,
    module: {
        type: String,
        enum: ['Book', 'BookTest', 'BookTestAnswer', 'BookUnit', 'BookUnitPart', 'BookUnitPartSubTopic', 'BookUnitTopic', 'City', 'District', 'Exam', 'ExamSet', 'ExamSetTest', 'ExamSetTestAnswer', 'Friend', 'Homework', 'HomeworkAnswer','HomeworkContent', 'Lesson', 'Manager', 'Publisher', 'Role', 'RoleAuthority', 'School', 'Student', 'SubTopic', 'Teacher', 'Topic', 'Category', 'ExamSetBookie', 'ExamSetTestLessons', 'Supports'],
        default: 'Book'
    },
    roleConstant: {
        type: String,
        enum: ['Select', 'Insert', 'Update', 'Delete'],
        default: 'Select'
    }
}, { 
    collection: 'roleAuthorities'
});

module.exports = mongoose.model('RoleAuthority', RoleAuthority);