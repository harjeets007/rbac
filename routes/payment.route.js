const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const paymentController = require("../controller/payment.controller");
const paymentRoute = express.Router();

// CREATE PAYMENT SESSION
paymentRoute.post(
  "/checkout/:projectId",
  authMiddleware,
  roleMiddleware("Client"),
  paymentController.createCheckoutSession,
);

paymentRoute.get(
  "/transactions",
  authMiddleware,
  paymentController.getTransactionHistory,
);

module.exports = paymentRoute;
