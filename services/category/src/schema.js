const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON
   
    type City @key(fields: "_id code"){
        _id: ID!,
        code: Int,
        cityName: String
    }

    type Query {
        cities(forceUpdate: String): [City]!
    }

    type Mutation {
        addCity(cityName: String!): CityResponse!
    }

    type CityResponse {
        status: String!
        message: String!
        content: JSON
    }
`;