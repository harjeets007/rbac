const Application = require("../models/application.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const paginate = require("../services/paginationService");
const { success, error } = require("../services/responseSerivce");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const { page, limit } = req.query;

      const pipeline = [
        {
          $match: {
            role: {
              $ne: "Admin",
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            password: 0,
          },
        },
      ];

      const { pagination, list } = await paginate(
        User,
        {},
        {
          page,
          limit,
          pipeline,
        },
        true,
      );

      return success(
        200,
        "Users fetched successfully",
        {
          pagination,
          users: list,
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      if (!user) {
        return error(404, "User not found", null, res);
      }

      await user.deleteOne();

      return success(200, "User deleted successfully", null, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  getAllApplications: async (req, res) => {
    try {
      const { page, limit } = req.query;

      const pipeline = [
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "project",
            foreignField: "_id",
            as: "project",
          },
        },

        {
          $unwind: "$project",
        },
        {
          $lookup: {
            from: "users",
            localField: "freelancer",
            foreignField: "_id",
            as: "freelancer",
          },
        },

        {
          $unwind: "$freelancer",
        },
        {
          $project: {
            proposal: 1,
            status: 1,
            createdAt: 1,

            project: {
              _id: "$project._id",
              title: "$project.title",
              status: "$project.status",
              budget: "$project.budget",
            },

            freelancer: {
              _id: "$freelancer._id",
              name: "$freelancer.name",
              email: "$freelancer.email",
              role: "$freelancer.role",
            },
          },
        },
      ];

      const { pagination, list } = await paginate(
        Application,
        {},
        {
          page,
          limit,
          pipeline,
        },
        true,
      );

      return success(
        200,
        "Applications fetched successfully",
        {
          pagination,
          applications: list,
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);

      if (!project) {
        return error(404, "Project not found", null, res);
      }

      await project.deleteOne();

      return success(200, "Project deleted successfully", null, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
};
