const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON

    enum ROLE {
        OWNER
        MANAGER
        MENTOR
        TEAM_MEMBER
    }    
    
    enum SUBROLE {
        SITE_MANAGER
        BUSINESS_COACH
        SME
        NONE
    }

    enum USER_PROJECT_TYPE {
        ASSIGN
        JOIN
    }

    type Manager @key(fields: "_id"){
        _id: ID!,
        roleId: String,
        districtId: String,
        isSystemAdministrator: Boolean,
        name: String,
        surname: String,
        dateOfBirth: String,
        password: String,
        gsm: String,
        email: String,
        confirmationKey: Int,
        isConfirmed: Boolean,
        registrationDate: String,
        facebook: String,
        twitter: String,
        instagram: String,
        image: String,
    }

    type Query {
        manager(_id: ID!): Manager
        managers(roleId: String, districtId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Manager]!
    }

    type Mutation {

        # -----   M A N A G E R   -----
        addManager( roleId: String!, districtId: String!, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: String!, password: String!, email: String!, gsm: String, facebook: String, twitter: String, instagram: String, image: String): UserResponse!
        updateManager(  _id: ID!, roleId: String, districtId: String, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: String, gsm: String, facebook: String, twitter: String, instagram: String, image: String ): UserResponse!
        deleteManager( _id: ID! ): UserResponse!
        confirmManager( _id: ID!, confirmationKey: Int! ): UserResponse!
        getToken( email: String!, password: String!, clientType: String! ): UserResponse!
        verifyToken( token: String! ): UserResponse!
    }

    type UserResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;