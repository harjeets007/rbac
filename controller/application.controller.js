const { default: mongoose } = require("mongoose");
const Application = require("../models/application.model");
const Project = require("../models/project.model");
const paginate = require("../services/paginationService");
const { error, success } = require("../services/responseSerivce");
const Notification = require("../models/notification.model");
const { getReceiverSocketId, getIO } = require("../socket/socket");

module.exports = {
  applyToProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { proposal } = req.body;

      const project = await Project.findById(projectId);

      if (!project) {
        return error(404, "Project not found", null, res);
      }

      const alreadyApplied = await Application.findOne({
        project: projectId,
        freelancer: req.user._id,
      });

      if (alreadyApplied) {
        return error(400, "You already applied to this project", null, res);
      }

      const application = await Application.create({
        project: projectId,
        freelancer: req.user._id,
        proposal,
      });

      // CREATE NOTIFICATION
      const notification = await Notification.create({
        receiver: project.client,
        sender: req.user._id,
        title: "New Application",
        message: `${req.user.name} applied to your project`,
        type: "application",
      });

      // REAL-TIME EMIT
      const receiverSocketId = getReceiverSocketId(project.client.toString());

      if (receiverSocketId) {
        getIO().to(receiverSocketId).emit("newNotification", notification);
      }

      return success(
        201,
        "Application submitted successfully",
        application,
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
  getMyApplications: async (req, res) => {
    try {
      const { page, limit } = req.query;

      const freelancerId = new mongoose.Types.ObjectId(req.user._id);

      const pipeline = [
        {
          $match: {
            freelancer: freelancerId,
          },
        },

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
          $project: {
            proposal: 1,
            status: 1,
            createdAt: 1,

            project: {
              _id: "$project._id",
              title: "$project.title",
              description: "$project.description",
              budget: "$project.budget",
              status: "$project.status",
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
          list,
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },

  getProjectApplications: async (req, res) => {
    try {
      const { projectId } = req.params;

      const { page, limit } = req.query;

      const project = await Project.findById(projectId);

      if (!project) {
        return error(404, "Project not found", null, res);
      }

      if (project.client.toString() !== req.user._id.toString()) {
        return error(403, "Access denied", null, res);
      }

      const projectObjectId = new mongoose.Types.ObjectId(projectId);

      const pipeline = [
        {
          $match: {
            project: projectObjectId,
          },
        },

        {
          $sort: {
            createdAt: -1,
          },
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
          list,
        },
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
  updateApplicationStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const { status } = req.body;

      if (!["accepted", "rejected"].includes(status)) {
        return error(400, "Invalid status", null, res);
      }

      const application = await Application.findById(id)
        .populate({
          path: "project",
          select: "title budget status client",
          populate: {
            path: "client",
            select: "name email role",
          },
        })
        .populate({
          path: "freelancer",
          select: "name email role",
        });

      if (!application) {
        return error(404, "Application not found", null, res);
      }

      application.status = status;

      if (status === "accepted") {
        application.project.status = "in-progress";

        await application.project.save();
      }

      await application.save();

      const notification = await Notification.create({
        receiver: application.freelancer._id,
        sender: req.user._id,
        title: `Application ${status}`,
        message: `Your application was ${status}`,
        type:
          status === "accepted"
            ? "application_accepted"
            : "application_rejected",
      });

      const receiverSocketId = getReceiverSocketId(
        application.freelancer._id.toString(),
      );

      if (receiverSocketId) {
        getIO().to(receiverSocketId).emit("newNotification", notification);
      }

      return success(
        200,
        `Application ${status} successfully`,
        application,
        res,
      );
    } catch (err) {
      return error(500, err.message, null, res);
    }
  },
};
