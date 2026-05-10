const express = require("express");
const adminController = require("../controller/admin.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const adminRouter = express.Router();

// GET ALL USERS
adminRouter.get(
  "/users",
  authMiddleware,
  roleMiddleware("Admin"),
  adminController.getAllUsers,
);

// DELETE USER
adminRouter.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  adminController.deleteUser,
);

// GET ALL APPLICATIONS
adminRouter.get(
  "/applications",
  authMiddleware,
  roleMiddleware("Admin"),
  adminController.getAllApplications,
);

// DELETE PROJECT
adminRouter.delete(
  "/projects/:id",
  authMiddleware,
  roleMiddleware("Admin"),
  adminController.deleteProject,
);

module.exports = adminRouter;
