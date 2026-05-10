const { io } = require("socket.io-client");

// connect to backend server
const socket = io("http://localhost:4000");

const userId = "69ff83b6043878418da9b7cb"; // MongoDB user id (client or freelancer)

socket.on("connect", () => {
  console.log("Connected:", socket.id);

  socket.emit("register", userId);
});

// listen for notifications
socket.on("newNotification", (data) => {
  console.log("Notification received:", data);
});

// debug disconnect
socket.on("disconnect", () => {
  console.log("Disconnected");
});
