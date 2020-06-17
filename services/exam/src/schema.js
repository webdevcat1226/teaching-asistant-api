const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON

    type Exam @key(fields: "_id") {
        _id: ID!
        title: String
        date: String,
    }

    type Query {
        exam(_id: ID!): Exam!
        exams(title: String, offset: Int, limit: Int): [Exam]!
    }

    type Mutation {
        addExam(title: String!, date: String!): ExamResponse!
        updateExam(_id: ID!, title: String, date: String): ExamResponse!
        deleteExam(_id: ID!): ExamResponse!
    }

    type ExamResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;