const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON
   
    type City @key(fields: "_id code"){
        _id: ID!,
        code: Int,
        cityName: String
    }

    type District @key(fields: "_id") {
        _id: ID!
        cityId: String
        districtName: String
    }

    type Role @key(fields: "_id") {
        _id: ID!
        title: String
        description: String
    }

    type Query {
        # -----   C I T Y   -----
        city(_id: ID, code: Int): City
        cities(offset: Int, limit: Int, forceUpdate: String): [City]!

        # -----     D I S T R I C T     -----
        district(_id: ID!): District
        districts(offset: Int, limit: Int, forceUpdate: String): [District]!

        # -----     R O L E     -----
        role(_id: ID!): Role
        roles(offset: Int, limt: Int, forceUpdate: String): [Role]!
    }

    type Mutation {
        # -----   C I T Y   -----
        addCity(cityName: String!): CategoryResponse!
        updateCity(_id: ID, code: Int, cityName: String!): CategoryResponse!
        deleteCity(_id: ID!): CategoryResponse!

        # -----     D I S T R I C T     -----
        addDistrict(cityId: String!, districtName: String!): CategoryResponse!
        updateDistrict(_id: ID, cityId: String, districtName: String): CategoryResponse!
        deleteDistrict(_id: ID!): CategoryResponse!

        # -----     R O L E     -----
        addRole(title: String!, description: String!): CategoryResponse!
        updateRole(_id: ID!, title: String, description: String): CategoryResponse!
        deleteRole(_id: ID!): CategoryResponse!
    }

    type CategoryResponse {
        status: String!
        message: String!
        content: JSON
    }
`;