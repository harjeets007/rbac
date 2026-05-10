const { Server } = require("socket.io");

let io;
const users = {};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // REGISTER USER
    socket.on("register", (userId) => {
      users[userId] = socket.id;
      console.log("Users map:", users);
    });
    // DISCONNECT
    socket.on("disconnect", () => {
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
      console.log("User disconnected");
    });
  });
};

const getReceiverSocketId = (userId) => {
  return users[userId];
};

module.exports = {
  initSocket,
  getReceiverSocketId,
  getIO: () => io,
};
