const Book = require('./models/book.model');
const BookTest = require('./models/bookTest.model');
const BookTestAnswer = require('./models/bookTestAnswer.model');
const BookUnit = require('./models/bookUnit.model');
const BookUnitPart = require('./models/bookUnitPart.model');
const BookUnitSubTopic = require('./models/bookUnitSubTopic.model');
const BookUnitTopic = require('./models/bookUnitTopic.model');



const patchOriginFromRequest = (origin, req, fields) => {
    for (let fld of fields) {
        if (req[fld] !== undefined) {
            origin[fld] = req[fld];
        }
    }
    return origin;
}

// -----   B O O K   -----

const factorBook = book => {
    return !!book ? {
        _id: book._id, title: book.title, categoryId: book.categoryId || "", examId: book.examId || "",
        publisherId: book.publisherId || "", publishYear: book.publishYear || new Date().getFullYear(),
        isbn: book.isbn || "", level: book.level || "Level1", showToUsers: book.showToUsers || false, image: book.image || "",
    } : null;
}
const factorBooks = books => {
    return (!!books && books.length > 0) ? (books.map(book => factorBook(book))) : [];
}
const checkBookDup = async where => {
    const book = await Book.findOne(where);
    return !!book;
}

// -----   B O O K   T E S T    -----
const factorBookTest = bu => {
    return !!bu ? {_id: bu._id, bookUnitPartId: bu.bookUnitPartId, testName: bu.testName, questionCount: bu.questionCount || 0} : null;
}
const factorBookTests = bus => {
    return !!bus && bus.length > 0 ? (bus.map(bu => factorBookTest(bu))) : [];
}
const checkBookTestDup = async where => {
    const bookTest = await BookTest.findOne(where);
    return !!bookTest;
}

// -----   B O O K   T E S T   A N S W E R    -----
const factorBookTestAnswer = bu => {
    return !!bu ? {_id: bu._id, bookTestId: bu.bookTestId, subTopicId: bu.subTopicId, questionNumber: bu.questionNumber, correctAnswer: bu.correctAnswer} : null;
}
const factorBookTestAnswers = bus => {
    return !!bus && bus.length > 0 ? (bus.map(bu => factorBookTestAnswer(bu))) : [];
}
const checkBookTestAnswerDup = async where => {
    const bookTest = await BookTestAnswer.findOne(where);
    return !!bookTest;
}

// -----   B O O K   U N I T    -----
const factorBookUnit = bu => {
    return !!bu ? {_id: bu._id, bookId: bu.bookId, lessonId: bu.lessonId, title: bu.title} : null;
}
const factorBookUnits = bus => {
    return !!bus && bus.length > 0 ? (bus.map(bu => factorBookUnit(bu))) : [];
}
const checkBookUnitDup = async where => {
    const bookUnit = await BookUnit.findOne(where);
    return !!bookUnit;
}

// -----   B O O K   U N I T    P A R T    -----
const factorBookUnitPart = but => {
    return !!but ? { _id: but._id, title: but.title, bookUnitId: but.bookUnitId } : null;
}
const factorBookUnitParts = buts => {
    return !!buts && buts.length > 0 ? (buts.map(but => factorBookUnitPart(but))) : [];
}
const checkBookUnitPartDup = async where => {
    const but = await BookUnitPart.findOne(where);
    return !!but;
}

// -----   B O O K   U N I T    S U B T O P I C    -----
const factorBookUnitSubTopic = but => {
    return !!but ? { _id: but._id, subTopicId: but.subTopicId, bookUnitPartId: but.bookUnitPartId } : null;
}
const factorBookUnitSubTopics = buts => {
    return !!buts && buts.length > 0 ? (buts.map(but => factorBookUnitSubTopic(but))) : [];
}
const checkBookUnitSubTopicDup = async where => {
    const but = await BookUnitSubTopic.findOne(where);
    return !!but;
}

// -----   B O O K   U N I T    T O P I C    -----
const factorBookUnitTopic = but => {
    return !!but ? { _id: but._id, topicId: but.topicId, bookUnitPartId: but.bookUnitPartId } : null;
}
const factorBookUnitTopics = buts => {
    return !!buts && buts.length > 0 ? (buts.map(but => factorBookUnitTopic(but))) : [];
}
const checkBookUnitTopicDup = async where => {
    const but = await BookUnitTopic.findOne(where);
    return !!but;
}


module.exports = {
    patchOriginFromRequest: patchOriginFromRequest,
    book: {
        factor: {
            unit: factorBook,
            array: factorBooks,
        },
        checkDuplicate: checkBookDup,
    },
    bookTest: {
        factor: {
            unit: factorBookTest,
            array: factorBookTests,
        },
        checkDuplicated: checkBookTestDup,
    },
    bookTestAnswer: {
        factor: {
            unit: factorBookTestAnswer,
            array: factorBookTestAnswers,
        },
        checkDuplicated: checkBookTestAnswerDup,
    },
    bookUnit: {
        factor: {
            unit: factorBookUnit,
            array: factorBookUnits,
        },
        checkDuplicated: checkBookUnitDup,
    },
    bookUnitPart: {
        factor: {
            unit: factorBookUnitPart,
            array: factorBookUnitParts,
        },
        checkDuplicated: checkBookUnitPartDup,
    },
    bookUnitSubTopic: {
        factor: {
            unit: factorBookUnitSubTopic,
            array: factorBookUnitSubTopics,
        },
        checkDuplicated: checkBookUnitSubTopicDup,
    },
    bookUnitTopic: {
        factor: {
            unit: factorBookUnitTopic,
            array: factorBookUnitTopics,
        },
        checkDuplicated: checkBookUnitTopicDup,
    }
}