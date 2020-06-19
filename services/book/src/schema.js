const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON
    enum EXAM_LEVEL { Level1 Level2 Level3 Level4 Level5 }
    enum CORRECT_ANSWER { Unknown A B C D E}

    type Book @key(fields: "_id") {
        _id: ID!,
        examId: String,
        categoryId: String,
        title: String,
        publisherId: String,
        publishYear: Int,
        isbn: String,
        level: EXAM_LEVEL
        showToUsers: Boolean,
        image: String,
    }

    type BookTest @key (fields: "_id") {
        _id: ID!,
        bookUnitPartId: String,
        testName: String!,
        questionCount: Int,
    }

    type BookTestAnswer @key(fields: "_id") {
        _id: ID!,
        bookTestId: String,
        subTopicId: String,
        questionNumber: Int,
        correctAnswer: CORRECT_ANSWER
    }

    type BookUnit @key(fields: "_id") { 
        _id: ID!,
        bookId: String,
        lessonId: String,
        title: String!,
    }

    type BookUnitPart @key(fields: "_id") {
        _id: ID!,
        bookUnitId: String,
        title: String!,
    }

    type BookUnitSubTopic @key(fields: "_id") {
        _id: ID!,
        bookUnitPartId: String,
        subTopicId: String,
    }

    type BookUnitTopic @key (fields: "_id") {
        _id: ID!,
        bookUnitPartId: String,
        topicId: String,
    }


    type Query {
        # -----   B O O K   -----
        book(_id: ID!): Book
        books(examId: String, categoryId: String, title: String, publisherId: String, publishYear: Int, isbn: String, level: EXAM_LEVEL, showToUsers: Boolean, offset: Int, limit: Int):[Book]!

        # -----   B O O K    T E S T   -----
        bookTest(_id: ID!): BookTest
        bookTests(bookUnitPartId: String, testName: String, questionCount: Int, offset: Int, limit: Int): [BookTest]!

        # -----   B O O K    T E S T   A N S W E R   -----
        bookTestAnswer(_id: ID!): BookTestAnswer
        bookTestAnswers(bookTestId: String, subTopicId: String, questionNumber: Int, correctAnswer: CORRECT_ANSWER, offset: Int, limit: Int): [BookTestAnswer]!

        # -----   B O O K   U N I T   -----
        bookUnit(_id: ID!): BookUnit
        bookUnits(bookId: String, lessonId: String, title: String, offset: Int, limit: Int): [BookUnit]!

        # -----   B O O K   U N I T   P A R T   -----
        bookUnitPart(_id: ID!): BookUnitPart
        bookUnitParts(title: String, bookUnitId: String, offset: Int, limit: Int): [BookUnitPart]!

        # -----   B O O K   U N I T   T O P I C   -----
        bookUnitTopic(_id: ID!): BookUnitTopic
        bookUnitTopics(bookUnitPartId: String, topicId: String, offset: Int, limit: Int): [BookUnitTopic]!

        # -----   B O O K   U N I T   S U B T O P I C   -----
        bookUnitSubTopic(_id: ID!): BookUnitSubTopic
        bookUnitSubTopics(bookUnitPartId: String, subTopicId: String, offset: Int, limit: Int): [BookUnitSubTopic]!
    }

    type Mutation {
        # -----   B O O K   -----
        addBook(title: String!, examId: String, categoryId: String, publisherId: String, publishYear: Int, isbn: String, level: EXAM_LEVEL, showToUsers: Boolean, image: String): BookResponse!
        updateBook(_id: ID!, title: String, examId: String, categoryId: String, publisherId: String, publishYear: Int, isbn: String, level: EXAM_LEVEL, showToUsers: Boolean, image: String): BookResponse!
        deleteBook(_id: ID!): BookResponse!

        # -----   B O O K    T E S T   -----
        addBookTest(bookUnitPartId: String!, testName: String!, questionCount: Int): BookResponse!
        updateBookTest(_id: ID!, bookUnitPartId: String, testName: String, questionCount: Int): BookResponse!
        deleteBookTest(_id: ID!): BookResponse!

        # -----   B O O K    T E S T   A N S W E R   -----
        addBookTestAnswer(bookTestId: String!, subTopicId: String!, questionNumber: Int!, correctAnswer: CORRECT_ANSWER): BookResponse!
        updateBookTestAnswer(_id: ID!, bookTestId: String, subTopicId: String, questionNumber: Int, correctAnswer: CORRECT_ANSWER): BookResponse!
        deleteBookTestAnswer(_id: ID!): BookResponse!

        # -----   B O O K    U N I T   -----
        addBookUnit(title: String!, bookId: String, lessonId: String): BookResponse!
        updateBookUnit(_id: ID!, title: String, bookId: String, lessonId: String): BookResponse!
        deleteBookUnit(_id: ID!): BookResponse!

        # -----   B O O K   U N I T   P A R T   -----
        addBookUnitPart(title: String!, bookUnitId: String): BookResponse!
        updateBookUnitPart(_id: ID!, title: String, bookUnitId: String): BookResponse!
        deleteBookUnitPart(_id: ID!): BookResponse!

        # -----   B O O K   U N I T   S U B T O P I C   -----
        addBookUnitSubTopic(bookUnitPartId: String!, subTopicId: String!): BookResponse
        updateBookUnitSubTopic(_id: ID!, bookUnitPartId: String, subTopicId: String): BookResponse!
        deleteBookUnitSubTopic(_id: ID!): BookResponse!

        # -----   B O O K   U N I T   T O P I C   -----
        addBookUnitTopic(bookUnitPartId: String!, topicId: String!): BookResponse
        updateBookUnitTopic(_id: ID!, bookUnitPartId: String, topicId: String): BookResponse!
        deleteBookUnitTopic(_id: ID!): BookResponse!

    }

    type BookResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;