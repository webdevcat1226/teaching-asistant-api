const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON


    type ExamResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;