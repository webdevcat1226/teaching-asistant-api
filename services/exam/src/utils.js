const Exam = require('./models/exam.model');
const ExamSet = require('./models/examSet.model');


// -----   E X A M   -----

const factorExam = exam => {
    return !!exam ? {_id: exam._id, title: exam.title || "", date: exam.date} : null;
}

const factorExams = exams => {
    return (!!exams && exams.length > 0) ? (exams.map(exam => factorExam(exam))) :  [];
}

const checkExamDup = async where => {
    const exam = await Exam.findOne(where);
    return !!exam;
}

// -----   E X A M    S E T   -----
const factorExamSet = examSet=> {
    return !!examSet ? { _id: examSet._id, examId: examSet.examId, categoryId: examSet.categoryId, title: examSet.title, publisherId: examSet.publisherId, publishYear: examSet.publishYear, isbn: examSet.isbn, showToUsers: examSet.showToUsers, image: examSet.image } : null;
}

const factorExamSets = ess => {
    return (!!ess && ess.length > 0) ? (ess.map(es => factorExamSet(es))) : [];
}

const checkExamSetDup = async where => {
    const examSet = await ExamSet.findOne(where);
    return !!examSet;
}

module.exports = {
    exam: {
        factor: {
            unit: factorExam,
            array: factorExams,
        },
        checkDuplicate: checkExamDup,
    },
    examSet: {
        factor: {
            unit: factorExamSet,
            array: factorExamSets,
        },
        checkDuplicate: checkExamSetDup,
    }
}