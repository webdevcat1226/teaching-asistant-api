const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON

    enum EXAMSET_LEVEL { Level1 Level2 Level3 Level4 Level5 }
    enum CORRECT_ANSWER { Unknown A B C D E}

    type Exam @key(fields: "_id") {
        _id: ID!
        title: String
        date: String,
    }

    type ExamAnswer @key(fields: "_id") {
        _id: ID!,
        examSetTestId: String,
        subTopicId: String,
        questionNumber: Int,
        correctAnswer: CORRECT_ANSWER
    }

    type ExamSet @key(fields: "_id") {
        _id: ID!,
        examId: String,
        categoryId: String,
        title: String,
        publisherId: String,
        publishYear: Int,
        isbn: String,
        level: EXAMSET_LEVEL,
        showToUsers: Boolean,
        image: String,
    }

    type ExamSetBookie @key(fields: "_id") {
        _id: ID!,
        examSetId: String,
        bookieTitle: String,
    }

    type ExamTest @key(fields: "_id") {
        _id: ID!,
        examSetBookieId: String,
        title: String,
        sequence: Int
        questionCount: Int
    }


    type Lesson @key(fields: "_id") {
        _id: ID!
        title: String!
    }

    type Subtopic @key(fields: "_id") {
        _id: ID!,
        topicId: String,
        title: String,
    }

    type Topic @key(fields: "_id") {
        _id: ID!
        lessonId: String
        title: String
    }

    type Query {
        # -----   E X A M   -----
        exam(_id: ID!): Exam!
        exams(title: String, offset: Int, limit: Int): [Exam]!
        
        # -----   E X A M    A N S W E R   -----
        examAnswer(_id: ID!): ExamAnswer
        examAnswers(examSetTestId: String, subTopicId: String, questionNumber: Int, correctAnswer: CORRECT_ANSWER, offset: Int, limit: Int): [ExamAnswer]!

        # -----   E X A M S E T   -----
        examSet(_id: ID!): ExamSet
        examSets(examId: String, categoryId: String, publisherId: String, publishYear: Int, level: EXAMSET_LEVEL, showToUsers: Boolean, offset: Int, limit: Int): [ExamSet]!

        # -----   Exam Set Bookie   -----
        examSetBookie(_id: ID!): ExamSetBookie
        examSetBookies(examSetId: ID, bookieTitle: String, offset: Int, limit: Int): [ExamSetBookie]!

        # -----   EXAM TEST   -----
        examTest(_id: ID!): ExamTest
        examTests(examSetBookieId: String, title: String, sequence: Int, questionCount: Int, offset: Int, limit: Int): [ExamTest]!

        # -----   L E S S O N   -----
        lesson(_id: ID!): Lesson
        lessons(title: String, offset: Int, limit: Int): [Lesson]!

        # -----   S U B T O P I C   -----
        subtopic(_id: ID!): Subtopic
        subtopics(topicId: ID, title: String, offset: Int, limit: Int): [Subtopic]!

        # -----   T O P I C   -----
        topic(_id: ID!): Topic
        topics(lessonId: String, title: String, offset: Int, limit: Int):[Topic]!
    }

    type Mutation {
        # -----   E X A M   -----
        addExam(title: String!, date: String!): ExamResponse!
        updateExam(_id: ID!, title: String, date: String): ExamResponse!
        deleteExam(_id: ID!): ExamResponse!
        
        # -----   E X A M    A N S W E R   -----
        addExamAnswer(examSetTestId: String!, subTopicId: String!, questionNumber: Int!, correctAnswer: CORRECT_ANSWER): ExamResponse!
        updateExamAnswer(_id: ID!, examSetTestId: String, subTopicId: String, questionNumber: Int, correctAnswer: CORRECT_ANSWER): ExamResponse!
        deleteExamAnswer(_id: ID!): ExamResponse!

        # -----   E X A M S E T   -----
        addExamSet(examId: String!, categoryId: String!, title: String!, publisherId: String!, publishYear: Int!, isbn: String, level: EXAMSET_LEVEL, showToUsers: Boolean, image: String): ExamResponse!
        updateExamSet(_id: ID!, examId: String, categoryId: String, title: String, publisherId: String, publishYear: Int, isbn: String, level: EXAMSET_LEVEL, showToUsers: Boolean, image: String): ExamResponse!
        deleteExamSet(_id: ID!): ExamResponse!

        # -----   Exam Set Bookie   -----
        addExamSetBookie(examSetId: String!, bookieTitle: String!): ExamResponse!
        updateExamSetBookie(_id: ID!, examSetId: String, bookieTitle: String): ExamResponse!
        deleteExamSetBookie(_id: ID!): ExamResponse!

        # -----   EXAM TEST   -----
        addExamTest(examSetBookieId: String!, title: String!, sequence: Int, questionCount: Int): ExamResponse!
        updateExamTest(_id: ID!, examSetBookieId: String, title: String, sequence: Int, questionCount: Int): ExamResponse!
        deleteExamTest(_id: ID!): ExamResponse!

        # -----   L E S S O N   -----
        addLesson(title: String!): ExamResponse!
        updateLesson(_id: ID!, title: String!): ExamResponse!
        deleteLesson(_id: ID!): ExamResponse!

        # -----   S U B T O P I C   -----
        addSubtopic(topicId: ID!, title: String!): ExamResponse!
        updateSubtopic(_id: ID!, topicId: String, title: String): ExamResponse!
        deleteSubtopic(_id: ID!): ExamResponse!

        # -----   T O P I C   -----
        addTopic(lessonId: String!, title: String!): ExamResponse!
        updateTopic(_id: ID!, lessonId: String, title: String): ExamResponse!
        deleteTopic(_id: ID!): ExamResponse!
    }

    type ExamResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;