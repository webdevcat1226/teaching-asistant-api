const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON

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

    type Student @key(fields: "_id") {
        _id: ID!,
        schoolId: String,
        studentMemberTypeId: String,
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
        instagram: String,
        image: String,
    }

    type Teacher @key(fields: "_id") {
        _id: ID!,
        schoolId: String,
        roleId: String,
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
        instagram: String,
        image: String,
    }

    type Query {
        # -----   M A N A G E R   -----
        manager(_id: ID!): Manager
        managers(roleId: String, districtId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Manager]!

        # -----   S T U D E N T   -----
        student(_id: ID!): Student
        students(schoolId: String, studentMemberTypeId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Student]!

        # -----   T E A C H E R   -----
        teacher(_id: ID!): Teacher
        teachers(schoolId: String, roleId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Teacher]!

    }

    type Mutation {

        # -----   M A N A G E R   -----
        addManager( roleId: String!, districtId: String!, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: String!, password: String!, email: String!, gsm: String, facebook: String, twitter: String, instagram: String, image: String): UserResponse!
        updateManager(  _id: ID!, roleId: String, districtId: String, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: String, gsm: String, facebook: String, twitter: String, instagram: String, image: String ): UserResponse!
        deleteManager( _id: ID! ): UserResponse!
        confirmManager( _id: ID!, confirmationKey: Int! ): UserResponse!
        getToken( email: String!, password: String!, clientType: String! ): UserResponse!
        verifyToken( token: String! ): UserResponse!

        # -----   S T U D E N T   -----
        addStudent(schoolId: String, studentMemberTypeId: String, name: String!, surname: String!, dateOfBirth: String!, password: String!, gsm: String!, email: String!, facebook: String, twitter: String, instagram: String, image: String): UserResponse!
        updateStudent(_id: ID!, schoolId: String, studentMemberTypeId: String, name: String, surname: String, dateOfBirth: String, facebook: String, twitter: String, instagram: String, image: String): UserResponse!
        deleteStudent(_id: ID!): UserResponse!
        confirmStudent(_id: ID!, confirmationKey: Int!): UserResponse!

        # -----   T E A C H E R   -----
        addTeacher(schoolId: String, roleId: String, name: String!, surname: String!, dateOfBirth: String, password: String!, gsm: String!, email: String!, facebook: String, twitter: String, instagram: String, image: String): UserResponse!
        updateTeacher(_id: ID!, schoolId: String, roleId: String, name: String, surname: String, dateOfBirth: String, facebook: String, instagram: String, twitter: String, image: String): UserResponse!
        deleteTeacher(_id: ID!): UserResponse!
        confirmTeacher(_id: ID!, confirmationKey: Int!): UserResponse!
        
    }

    type UserResponse {
        status: String!,
        message: String!,
        content: JSON!
    }
`;