const { default: mongoose } = require("mongoose");
const Project = require("../models/project.model");
const paginate = require("../services/paginationService");
const { success, error } = require("../services/responseSerivce");

module.exports = {
  createProject: async (req, res) => {
    try {
      const { title, description, budget } = req.body;

      if (!title || !description || !budget) {
        return error(400, "Please provide all required fields", null, res);
      }

      const project = await Project.create({
        title,
        description,
        budget,
        client: req.user._id,
      });

      return success(201, "Project created successfully", project, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
  getAllProjects: async (req, res) => {
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
            from: "users",
            localField: "client",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $unwind: "$client",
        },
        {
          $project: {
            title: 1,
            description: 1,
            budget: 1,
            status: 1,
            createdAt: 1,
            client: {
              _id: "$client._id",
              name: "$client.name",
              email: "$client.email",
              role: "$client.role",
            },
          },
        },
      ];

      const { pagination, list } = await paginate(
        Project,
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
        "Projects fetched successfully",
        {
          pagination,
          list,
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  getSingleProject: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id).populate(
        "client",
        "name email role",
      );

      if (!project) {
        return error(404, "Project not found", null, res);
      }

      return success(200, "Project fetched successfully", project, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  getMyProjects: async (req, res) => {
    try {
      const clientId = new mongoose.Types.ObjectId(req.user._id);
      const projects = await Project.find({
        client: clientId,
      }).sort({ createdAt: -1 });

      return success(200, "My projects fetched successfully", projects, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  clientDeleteOwnProject: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);

      if (!project) {
        return error(404, "Project not found", null, res);
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return error(403, "You can delete only your own projects", null, res);
      }

      await project.deleteOne();

      return success(200, "Project deleted successfully", null, res);
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
};
