const express = require("express");
const projectController = require("../controller/project.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const projectRouter = express.Router();

// CREATE A NEW PROJECT (CLIENT ONLY)
projectRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("Client"),
  projectController.createProject,
);

// GET ALL PROJECTS CREATED BY LOGGED-IN CLIENT
projectRouter.get(
  "/my-projects",
  authMiddleware,
  roleMiddleware("Client"),
  projectController.getMyProjects,
);

// GET ALL PROJECTS
projectRouter.get("/", authMiddleware, projectController.getAllProjects);

// GET SINGLE PROJECT BY ID
projectRouter.get("/:id", authMiddleware, projectController.getSingleProject);

// DELETE OWN PROJECT (CLIENT ONLY)
projectRouter.delete(
  "/my-project/:id",
  authMiddleware,
  roleMiddleware("Client"),
  projectController.clientDeleteOwnProject,
);

module.exports = projectRouter;
