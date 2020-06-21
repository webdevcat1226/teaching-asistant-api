const { gql } = require('apollo-server');
module.exports = gql`
    
    scalar JSON
   
    enum ROLE_MODULE { Book BookTest BookTestAnswer BookUnit BookUnitPart BookUnitPartSubTopic BookUnitTopic City District Exam ExamSet ExamSetTest ExamSetTestAnswer Friend Homework HomeworkAnswer HomeworkContent Lesson Manager Publisher Role RoleAuthority School Student SubTopic Teacher Topic Category ExamSetBookie ExamSetTestLessons Supports }

    enum ROLE_CONSTANT { Select Insert Update Delete }

    type Category @key(fields: "_id") {
        _id: ID!,
        categoryTitle: String!
    }

    type City @key(fields: "_id code"){
        _id: ID!,
        code: Int,
        cityName: String
    }

    type District @key(fields: "_id") {
        _id: ID!
        cityId: String
        districtName: String
        city: City
    }

    type Role @key(fields: "_id") {
        _id: ID!
        title: String
        description: String
    }

    type RoleAuthority @key(fields: "_id") {
        _id: ID!
        roleId: String
        module: ROLE_MODULE
        roleConstant: ROLE_CONSTANT
        role: Role
    }

    type School @key(fields: "_id") {
        _id: ID!
        districtId: String
        name: String
        district: District
    }

    type StudentMemberType @key(fields: "_id") {
        _id: ID!
        typeTitle: String!
        descriptions: String
        piece: Int
    }

    # extend type Teacher @key(fields: "_id") {
    #     _id: ID! @external
    #     role: Role
    #     school: School
    # }
    



    type Query {
        # -----   C A T E G O R Y   -----
        category(_id: ID!): Category
        categories(categoryTitle: String, offset: Int, limit: Int): [Category]!

        # -----   C I T Y   -----
        city(_id: ID, code: Int): City
        cities(offset: Int, limit: Int, forceUpdate: String): [City]!

        # -----     D I S T R I C T     -----
        district(_id: ID!): District
        districts(offset: Int, limit: Int, forceUpdate: String): [District]!

        # -----     R O L E     -----
        role(_id: ID!, forceUpdate: String): Role
        roles(offset: Int, limt: Int, forceUpdate: String): [Role]!

        # -----     R O L E    A U T H O R I T Y     -----
        roleAuthority(_id: ID!, forceUpdate: String): RoleAuthority
        roleAuthorities(roleId: String, module: ROLE_MODULE, roleConstant: ROLE_CONSTANT, offset: Int, limit: Int, forceUpdate: String): [RoleAuthority]!

        # -----     S C H O O L     -----
        school(_id: ID!): School
        schools(districtId: String, name: String, offset: Int, limit: Int, forceUpdate: String): [School]!

        # -----     STUDENT MEMBER TYPE     -----
        studentMemberType(_id: ID!): StudentMemberType
        studentMemberTypes(offset: Int, limit: Int, forceUpdate: String): [StudentMemberType]!
    }

    type Mutation {
        # -----   C A T E G O R Y   -----
        addCategory(categoryTitle: String!): CategoryResponse!
        updateCategory(_id: ID!, categoryTitle: String!): CategoryResponse!
        deleteCategory(_id: ID!): CategoryResponse!

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

        # -----     R O L E    A U T H O R I T Y     -----
        addRoleAuthority(roleId: String!, module: ROLE_MODULE!, roleConstant: ROLE_CONSTANT!): RoleAuthorityResponse!
        updateRoleAuthority(_id: ID!, roleId: String, module: ROLE_MODULE, roleConstant: ROLE_CONSTANT): RoleAuthorityResponse!
        deleteRoleAuthority(_id: ID!): CategoryResponse!

        # -----     S C H O O L     -----
        addSchool(districtId: String!, name: String!): CategoryResponse!
        updateSchool(_id: ID!, districtId: String, name: String): CategoryResponse!
        deleteSchool(_id: ID!): CategoryResponse!

        # -----     STUDENT MEMBER TYPE     -----
        addStudentMemberType(typeTitle: String!, descriptions: String, piece: Int): CategoryResponse!
        updateStudentMemberType(_id: ID!, typeTitle: String, descriptions: String, piece: Int): CategoryResponse!
        deleteStudentMemberType(_id: ID!): CategoryResponse!
    }

    type CategoryResponse {
        status: String!
        message: String!
        content: JSON
    }
    type RoleAuthorityResponse {
        status: String!
        message: String!
        content: RoleAuthority
    }
`;