const Exam = require('./models/exam.model');

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


module.exports = {
    exam: {
        factor: {
            unit: factorExam,
            array: factorExams,
        },
        checkDuplicate: checkExamDup,
    },
}