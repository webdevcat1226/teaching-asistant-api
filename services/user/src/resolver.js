const UserProject = require("./model");
// const { checkToken } = require('./libs/middleware');
const Utils = require("./libs");

module.exports = {
  Query: {
    allUserProjects: async (_, __, { token }) => {
      Utils.checkToken(token); //console.log(decoded);

      let where = {};
      if (args._projectID !== undefined) {
        where._projectID = args._projectID;
      }
      if (args._userID !== undefined) {
        where._userID = args._userID;
      }
      if (args._userEmail !== undefined) {
        where._userEmail = args._userEmail;
      }

      const arr = await UserProject.find(where); // console.log(projects);
      return arr;
    },

    userProjects: async (_, args, { token }) => {
      Utils.checkToken(token);

      const where = {};
      if (args._projectID !== undefined) {
        where._projectID = args._projectID;
      }
      if (args._userID !== undefined) {
        where._userID = args._userID;
      }
      if (args.isAccepted !== undefined) {
        where.isAccepted = args.isAccepted;
      }
      if (args.isPending !== undefined) {
        where.isPending = args.isPending;
      }
      if (args.isRejected !== undefined) {
        where.isRejected = args.isRejected;
      }
      if (args._userEmail !== undefined) {
        where._userEmail = args._userEmail;
      }
      if (args.type !== undefined) {
        where.type = args.type;
      }
      if (args.role !== undefined) {
        where.role = args.role;
      }

      if (args.roles && args.roles.length > 0) {
        const whereOr = [];
        for (const role of args.roles) {
          whereOr.push({ role: role });
        }
        whereOr["$or"] = whereOr;
      }

      const ups = await UserProject.find(where);
      return ups;
    },

    userProject: async (_, args, { token }) => {
      Utils.checkToken(token);

      if (args._userID !== undefined && args._userEmail !== undefined) {
        return null;
      } else {
        let where = { _projectID: args._projectID };
        if (args._userID !== undefined) {
          where._userID = args._userID;
        }
        if (args._userEmail !== undefined) {
          where._userEmail = args._userEmail;
        }

        const up = await UserProject.findOne(where);
        return up;
      }
    }
  },

  UserProject: {
    projectInfo(userProject) {
      return { __typename: "Project", _projectID: userProject._projectID };
    },

    invitation(userProject) {
      if (!userProject.inviteID) {
        return null;
      }
      return { __typename: "Invitation", _inviteID: userProject.inviteID };
    }
  },

  Mutation: {
    userProject_create: async (_, args, { token }) => {
      // console.log('[manager]', args.manager);
      const issuer = Utils.checkToken(token);

      // check duplication
      const whereDup = {
        _projectID: args._projectID,
        _userEmail: args.email,
        isRejected: false
      };
      const duplicated = await UserProject.findOne(whereDup);
      // console.log(duplicated);
      if (!!duplicated) {
        return {
          success: false,
          error: true,
          message: "User has been already assigned to project!",
          data: {}
        };
      }

      let up = {
        _projectID: args._projectID,
        _userEmail: args.email,
        _userID: args._userID || "",
        userExists: args.userExists || false,
        inviteID: args.inviteID || "",

        role: args.role || "",
        subrole: args.subrole || "NONE",
        type: args.type || "ASSIGN",
        issuerID: issuer._userID,
        issuerRole: args.issuerRole || "OWNER",

        isActive: args.isActive || false,
        isAccepted: args.isAccepted || false,
        isPending: args.isPending || true,
        isRejected: args.isRejected || false,

        createTime: Date.now(), //Math.floor(Date.now() / 1000),
        updateTime: Date.now() //Math.floor(Date.now() / 1000)
      };

      const created = await UserProject.create(up);

      if (!created) {
        return {
          success: false,
          error: true,
          message: "Faield to create."
        };
      } else {
        // after create, will delete rejected assigns.
        const whereRjected = {
          _projectID: args._projectID,
          _userEmail: args.email,
          isRejected: true
        };
        await UserProject.deleteOne(whereRjected);
        return {
          success: true,
          error: false,
          message: "New data has been created successfully",
          data: created
        };
      }
    },

    userProject_update: async (_, args, { token }) => {
      Utils.checkToken(token);

      const upInfo = await UserProject.findOne({
        _projectID: args._projectID,
        _userEmail: args._userEmail
      });

      // check exist
      if (!upInfo) {
        return {
          status: false,
          message: "Data not found with given info!"
        };
      }

      const optionalArgs = [
        "isPending",
        "isAccepted",
        "isRejected",
        "role",
        "subrole",
        "inviteID",
        "isActive"
      ];
      // upInfo.role = args.role || upInfo.role;
      // upInfo.isActive = args.isActive !== undefined ? args.isActive : upInfo.isActive;
      for (const param of optionalArgs) {
        if (args[param] !== undefined) {
          upInfo[param] = args[param];
        }
      }
      upInfo.updateTime = Math.floor(Date.now() / 1000);

      const updated = await UserProject.findOneAndUpdate(
        { _projectID: args._projectID, _userEmail: args._userEmail },
        upInfo
      );

      if (!updated) {
        return {
          success: false,
          error: true,
          message: "Server error!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "Data has been updated successfully!"
        };
      }
    },

    userProject_accept: async (_, args, { token }) => {
      Utils.checkToken(token);

      const upInfo = await UserProject.findOne({
        _projectID: args._projectID,
        _userEmail: args._userEmail
      });

      // check exist
      if (!upInfo) {
        return {
          status: false,
          message: "Data not found with given info!"
        };
      }

      upInfo.isPending = false;
      upInfo.isAccepted = true;
      upInfo.isRejected = false;
      upInfo.updateTime = Math.floor(Date.now() / 1000);

      const updated = await UserProject.findOneAndUpdate(
        { _projectID: args._projectID, _userEmail: args._userEmail },
        upInfo
      );

      if (!updated) {
        return {
          success: false,
          error: true,
          message: "Server error!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "You have successfully accepted."
        };
      }
    },

    userProject_reject: async (_, args, { token }) => {
      Utils.checkToken(token);

      const upInfo = await UserProject.findOne({
        _projectID: args._projectID,
        _userEmail: args._userEmail
      });

      // check exist
      if (!upInfo) {
        return {
          status: false,
          message: "Data not found with given info!"
        };
      }

      upInfo.isPending = false;
      upInfo.isAccepted = false;
      upInfo.isRejected = true;
      upInfo.updateTime = Math.floor(Date.now() / 1000);

      const updated = await UserProject.findOneAndUpdate(
        { _projectID: args._projectID, _userEmail: args._userEmail },
        upInfo
      );

      if (!updated) {
        return {
          success: false,
          error: true,
          message: "Server error!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "You have successfully declined."
        };
      }
    },

    userProject_messageToOwner: async (_, args, { token }) => {
      const issuer = Utils.checkToken(token);

      subject = `Message From ${args.senderName}`;
      content = `<p>
            ${args.content}
                <p>`;
      
      Utils.sendEmail(args.senderEmail, args.ownerEmail, subject, content, true);
      return {
        success: true,
        error: false,
        message: 'Message has been sent successfully!',
        data: {}
      };
    },

    userProject_delete: async (_, args, { token }) => {
      Utils.checkToken(token);

      const deleted = await UserProject.deleteOne({
        _projectID: args._projectID,
        _userID: args._userID
      });

      if (!deleted) {
        return {
          success: false,
          error: true,
          message: "Database error!"
        };
      } else if (deleted.deletedCount === 0) {
        return {
          success: false,
          error: true,
          message: "No data found to delete!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "Data has been successfully deleted."
        };
      }
    },

    userProject_deleteEmail: async (_, args, { token }) => {
      Utils.checkToken(token);

      const deleted = await UserProject.deleteOne({
        _projectID: args._projectID,
        _userEmail: args._userEmail
      });

      if (!deleted) {
        return {
          success: false,
          error: true,
          message: "Database error!"
        };
      } else if (deleted.deletedCount === 0) {
        return {
          success: false,
          error: true,
          message: "No data found to delete!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "Data has been successfully deleted."
        };
      }
    },

    userProject_deleteByProjectID: async (_, args, { token }) => {
      Utils.checkToken(token);

      const deleted = UserProject.deleteMany({ _projectID: args._projectID });

      if (!deleted) {
        return {
          success: false,
          error: true,
          message: "Database error!"
        };
      } else if (deleted.deletedCount === 0) {
        return {
          success: false,
          error: true,
          message: "No data found to delete!"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "All data has been successfully deleted.",
          data: {
            count: deleted.deletedCount
          }
        };
      }
    },

    userProject_deleteByUserID: async (_, args, { token }) => {
      Utils.checkToken(token);

      const deleted = UserProject.deleteMany({ _userID: args._userID });

      if (!deleted) {
        return {
          success: false,
          error: true,
          message: "Database error!"
        };
      } else if (deleted.deletedCount === 0) {
        return {
          success: false,
          error: true,
          message: "No data found to delete"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "All data has been successfully deleted.",
          data: { count: deleted.deletedCount }
        };
      }
    },

    userProject_deleteAll: async (_, __, { token }) => {
      Utils.checkToken(token);

      const deleted = UserProject.deleteMany({});

      if (!deleted) {
        return {
          success: false,
          error: true,
          message: "Database error!"
        };
      } else if (deleted.deletedCount === 0) {
        return {
          success: false,
          error: true,
          message: "No data found to delete"
        };
      } else {
        return {
          success: true,
          error: false,
          message: "All data has been successfully deleted.",
          data: { count: deleted.deletedCount }
        };
      }
    }
  }
};
