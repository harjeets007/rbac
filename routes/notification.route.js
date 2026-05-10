const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const notificationController = require("../controller/notification.controller");
const notificationRoute = express.Router();

notificationRoute.get(
  "/",
  authMiddleware,
  notificationController.getNotifications,
);

notificationRoute.patch(
  "/read/:id",
  authMiddleware,
  notificationController.markAsRead,
);

module.exports = notificationRoute;
