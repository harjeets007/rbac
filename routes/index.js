const express = require("express");
const userRouter = require("./user.routes");
const projectRouter = require("./project.routes");
const applicationRouter = require("./application.routes");
const adminRouter = require("./admin.route");
const notificationRoute = require("./notification.route");
const paymentRoute = require("./payment.route");
const aiRouter = require("./ai.route");
const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/project", projectRouter);
router.use("/application", applicationRouter);
router.use("/notification", notificationRoute);
router.use("/payment", paymentRoute);
router.use("/ai", aiRouter);


module.exports = router;
