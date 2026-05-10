const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const http = require("http");
const connectDB = require("./config/database");
const { initSocket } = require("./socket/socket");
const path = require("path");
const router = require("./routes");
const paymentController = require("./controller/payment.controller");
require("dotenv").config();

const server = express();

connectDB();

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook,
);

server.use(cors({ origin: "*" }));
server.use(morgan("dev"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api/v1", router);

server.use((req, res) => {
  return res.status(404).send({ success: false, message: "not Found" });
});

const port = process.env.server_PORT || 2000;
const httpServer = http.createServer(server);

//socket connection
initSocket(httpServer);

httpServer.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
