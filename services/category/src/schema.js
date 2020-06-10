const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON
   
    type City @key(fields: "_id code"){
        _id: ID!,
        code: Int,
        cityName: String
    }

    type Query {
        city(_id: ID, code: Int): City
        cities(offset: Int, limit: Int, forceUpdate: String): [City]!
    }

    type Mutation {
        addCity(cityName: String!): CityResponse!
        updateCity(_id: ID, code: Int, cityName: String!): CityResponse!
    }

    type CityResponse {
        status: String!
        message: String!
        content: JSON
    }
`;