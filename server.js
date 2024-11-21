// Server side
const express = require("express");
const http = require("http");

const PORT = 5000;
const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const io = require("socket.io")(server);

let connectedPeers = [];

io.on("connection", (socket) => {
  socket.on("group-chat-message", (data) => {
    // emit to all except sender
    // socket.broadcast.emit("group-chat-message", data);

    // emit to all users
    io.emit("group-chat-message", data);
  });

  socket.on("register-new-user", (userData) => {
    const { username } = userData;
    const newPeer = {
      username,
      socketId: socket.id,
    };

    connectedPeers = [...connectedPeers, newPeer];
    broadcaseConnectedPeers();
  });

  socket.on("direct-message", (data) => {
    const { receiverSocketId } = data;
    const connectedPeer = connectedPeers.find(
      (peer) => peer.socketId === receiverSocketId
    );

    if (connectedPeer) {
      const authorData = {
        ...data,
        isAuthor: true,
      };

      // Emit event with message to ourself
      socket.emit("direct-message", authorData);
    }

    // Emit event for receiver of message
    io.to(receiverSocketId).emit("direct-message", data);
  });

  socket.on("disconnect", () => {
    connectedPeers = connectedPeers.filter(
      (peer) => peer.socketId !== socket.id
    );

    const data = {
      socketIdOfDisconnectedPeer: socket.id,
    };

    broadcaseConnectedPeers();
    io.emit("peer-disconnected", data);
  });
});

const broadcaseConnectedPeers = () => {
  const data = { connectedPeers };
  io.emit("active-peers", data);
};

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
