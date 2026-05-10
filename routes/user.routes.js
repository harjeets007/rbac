const express = require("express");
const userController = require("../controller/user.controller");
const userRouter = express.Router();

// user Routes
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

module.exports = userRouter;
