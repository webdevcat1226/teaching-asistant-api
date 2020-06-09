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

    type UserProject @key(fields: "_projectID _userEmail"){
        _projectID: ID!,
        _userID: String,
        _userEmail: String!
        userExists: Boolean,
        inviteID: String,

        role: ROLE,
        subrole: SUBROLE,
        type: USER_PROJECT_TYPE,
        issuerID: String,
        issuerRole: ROLE,

        isActive: Boolean,
        isAccepted: Boolean,
        isPending: Boolean,
        isRejected: Boolean,

        createTime: String,
        updateTime: String,

        projectInfo: Project
        invitation: Invitation
    }

    extend type Invitation @key(fields: "_inviteID") {
        _inviteID: ID! @external
    }

    extend type Project @key(fields: "_projectID") {
        _projectID: ID! @external
    }

    type Query {
        allUserProjects(_projectID: ID, _userID: String, _userEmail: String, forceUpdate: String): [UserProject]!

        # userProductById(_id: ID!): Version

        userProject(_projectID: ID!, _userID: ID, _userEmail: String, forceUpdate: String): UserProject

        userProjects(_projectID: ID, _userID: String, _userEmail: String,
            role: ROLE, roles: [ROLE],
            isAccepted: Boolean, isPending: Boolean, isRejected: Boolean,
            type: USER_PROJECT_TYPE, forceUpdate: String): [UserProject]!
    }

    type Mutation {
        userProject_create(
            _projectID: ID!, _userID: String, email: String!,
            inviteID: String,  type: USER_PROJECT_TYPE!,
            userExists: Boolean, role: ROLE!, subrole: SUBROLE, isActive: Boolean
        ): UPResponse

        userProject_update(
            _projectID: ID!, _userEmail: String!,
            isPending: Boolean,  isAccepted: Boolean, isRejected: Boolean,
            role: String, subrole: String, inviteID: String, isActive: Boolean
        ): UPResponse

        userProject_accept(_projectID: ID!, _userEmail: String!): UPResponse

        userProject_reject(_projectID: ID!, _userEmail: String!): UPResponse

        userProject_messageToOwner(
            _projectID: ID!, ownerEmail: String!, content: String!, ownerName: String!,
            senderEmail: String, senderName: String
            ): UPResponse

        userProject_delete(_projectID: ID!, _userID: ID!): UPResponse!

        userProject_deleteEmail(_projectID: ID!, _userEmail: String!): UPResponse!

        userProject_deleteByProjectID(_projectID: ID!): UPResponse!

        userProject_deleteByUserID(_userID: ID!): UPResponse!

        userProject_deleteAll: UPResponse!
    }

    type UPResponse {
        success: Boolean!
        error: Boolean!
        message: String!
        data: JSON
    }
`;