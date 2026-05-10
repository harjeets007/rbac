const express = require("express");
const { generateDescription } = require("../controller/ai.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const aiRouter = express.Router();

aiRouter.post(
  "/description",
  authMiddleware,
  roleMiddleware("Client"),
  generateDescription,
);

module.exports = aiRouter;
