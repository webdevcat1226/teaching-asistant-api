const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON


    type Friend @key (fields: "_id") {
        _id: ID!,
        studentId: String,
        teacherId: String,
        isAccepted: Boolean,
        isSenderAsStudent: Boolean,
        student: Student
        teacher: Teacher
    }

    type Manager @key(fields: "_id"){
        _id: ID!,
        roleId: String,
        districtId: String,
        isSystemAdministrator: Boolean,
        name: String,
        surname: String,
        fullname: String,
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
        role: Role
        district: District
    }

    type Publisher @key (fields: "_id") {
        _id: ID!,
        name: String,
        email: String,
        phone: String,
        address: String,
    }

    type Student @key(fields: "_id") {
        _id: ID!,
        schoolId: String,
        studentMemberTypeId: String,
        name: String,
        surname: String,
        fullname: String,
        dateOfBirth: String,
        password: String,
        gsm: String,
        email: String,
        confirmationKey: Int,
        isConfirmed: Boolean,
        registrationDate: String,
        facebook: String,
        instagram: String,
        twitter: String,
        image: String,
        school: School
        studentMemberType: StudentMemberType
    }

    type Teacher @key(fields: "_id") {
        _id: ID!,
        schoolId: String,
        roleId: String,
        name: String,
        surname: String,
        fullname: String,
        dateOfBirth: String,
        password: String,
        gsm: String,
        email: String,
        confirmationKey: Int,
        isConfirmed: Boolean,
        registrationDate: String,
        facebook: String,
        instagram: String,
        twitter: String,
        image: String,
        role: Role
        school: School
    }

    extend type District @key(fields: "_id") {
        _id: ID! @external
    }

    extend type Role @key(fields: "_id") {
        _id: ID! @external
    }

    extend type School @key(fields: "_id") {
        _id: ID! @external
    }

    extend type StudentMemberType @key(fields: "_id") {
        _id: ID! @external
    }


    type Query {
        # -----   F R I E N D   -----
        friend(_id: ID!, forceUpdate: String): Friend
        friends(studentId: String, teacherId: String, isAccepted: Boolean, isSenderAsStudent: String, offset: Int, limit: Int): [Friend]!

        # -----   M A N A G E R   -----
        manager(_id: ID!, forceUpdate: String): Manager
        managers(roleId: String, districtId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Manager]!

        # -----   P U B L I S H E R   -----
        publisher(_id: ID!, forceUpdate: String): Publisher
        publishers(email: String, phone: String, name: String, address: String, offset: Int, limit: Int): [Publisher]!

        # -----   S T U D E N T   -----
        student(_id: ID!, forceUpdate: String): Student
        students(schoolId: String, studentMemberTypeId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Student]!

        # -----   T E A C H E R   -----
        teacher(_id: ID!, forceUpdate: String): Teacher
        teachers(schoolId: String, roleId: String, isConfirmed: Boolean, offset: Int, limit: Int, forceUpdate: String): [Teacher]!
    }

    type Mutation {

        # -----   F R I E N D   -----
        addFriend(studentId: String!, teacherId: String!, isAccepted: Boolean, isSenderAsStudent: Boolean!): UserResponse!
        updateFriend(_id: ID!, isAccepted: Boolean, isSenderAsStudent: Boolean): UserResponse!
        deleteFriend(_id: ID!): UserResponse!

        # -----   M A N A G E R   -----
        addManager( roleId: String!, districtId: String!, isSystemAdministrator: Boolean, name: String!, surname: String!, dateOfBirth: String!, password: String!, email: String!, gsm: String, facebook: String, twitter: String, instagram: String, image: String): ManagerResponse!
        updateManager(  _id: ID!, roleId: String, districtId: String, isSystemAdministrator: Boolean, name: String, surname: String, dateOfBirth: String, gsm: String, facebook: String, twitter: String, instagram: String, image: String ): ManagerResponse!
        deleteManager( _id: ID! ): UserResponse!
        confirmManager( _id: ID!, confirmationKey: Int! ): UserResponse!
        getToken( email: String!, password: String!, clientType: String! ): UserResponse!
        verifyToken( token: String! ): UserResponse!
        
        # -----   P U B L I S H E R   -----
        addPublisher(name: String!, email: String!, phone: String!, address: String!): UserResponse!
        updatePublisher(_id: ID!, name: String, phone: String, address: String): UserResponse!
        deletePublisher(_id: ID!): UserResponse!

        # -----   S T U D E N T   -----
        addStudent(schoolId: String, studentMemberTypeId: String, name: String!, surname: String!, dateOfBirth: String!, password: String!, gsm: String!, email: String!, facebook: String, twitter: String, instagram: String, image: String): StudentResponse!
        updateStudent(_id: ID!, schoolId: String, studentMemberTypeId: String, name: String, surname: String, dateOfBirth: String, facebook: String, twitter: String, instagram: String, image: String): StudentResponse!
        deleteStudent(_id: ID!): UserResponse!
        confirmStudent(_id: ID!, confirmationKey: Int!): UserResponse!

        # -----   T E A C H E R   -----
        addTeacher(schoolId: String, roleId: String, name: String!, surname: String!, dateOfBirth: String, password: String!, gsm: String!, email: String!, facebook: String, twitter: String, instagram: String, twitter: String, image: String): TeacherResponse!
        updateTeacher(_id: ID!, schoolId: String, roleId: String, name: String, surname: String, dateOfBirth: String, facebook: String, instagram: String, twitter: String, image: String): TeacherResponse!
        deleteTeacher(_id: ID!): UserResponse!
        confirmTeacher(_id: ID!, confirmationKey: Int!): UserResponse!
    }

    type UserResponse { status: String!,  message: String!, content: JSON! }
    type StudentResponse { status: String!, message: String!, content: Student }
    type TeacherResponse { status: String!, message: String!, content: Teacher }
    type ManagerResponse { status: String!, message: String!, content: Manager }

`;