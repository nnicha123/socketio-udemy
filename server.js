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

io.on("connection", (socket) => {
  socket.on("group-chat-message", (data) => {
    // emit to all except sender
    // socket.broadcast.emit("group-chat-message", data);

    // emit to all users
    io.emit("group-chat-message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
