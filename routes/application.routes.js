const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const applicationController = require("../controller/application.controller");
const applicationRouter = express.Router();

// APPLY TO A PROJECT (FREELANCER ONLY)
applicationRouter.post(
  "/:projectId",
  authMiddleware,
  roleMiddleware("Freelancer"),
  applicationController.applyToProject,
);

// GET ALL APPLICATIONS SUBMITTED BY LOGGED-IN FREELANCER
applicationRouter.get(
  "/my-applications",
  authMiddleware,
  roleMiddleware("Freelancer"),
  applicationController.getMyApplications,
);

// GET ALL APPLICATIONS FOR A SPECIFIC PROJECT (CLIENT ONLY)
applicationRouter.get(
  "/project/:projectId",
  authMiddleware,
  roleMiddleware("Client"),
  applicationController.getProjectApplications,
);

// ACCEPT OR REJECT APPLICATION (CLIENT ONLY)
applicationRouter.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("Client"),
  applicationController.updateApplicationStatus,
);

module.exports = applicationRouter;
